using BreathingFree.Data;
using BreathingFree.Models;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using Microsoft.EntityFrameworkCore;
using System.Text.RegularExpressions;
using Microsoft.Extensions.Configuration;
using BCrypt.Net;
using Microsoft.Extensions.Logging;

namespace BreathingFree.Services
{
    public class AuthService
    {
        private readonly ApplicationDbContext _context;
        private readonly IConfiguration _configuration;
        private readonly IWebHostEnvironment _environment;
        private readonly ILogger<AuthService> _logger;

        public AuthService(
            ApplicationDbContext context, 
            IConfiguration configuration, 
            IWebHostEnvironment environment,
            ILogger<AuthService> logger)
        {
            _context = context;
            _configuration = configuration;
            _environment = environment;
            _logger = logger;
        }

        public async Task<User?> GetUserByEmailAsync(string email)
        {
            try 
            {
                return await _context.Users.FirstOrDefaultAsync(u => u.Email == email);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error getting user by email: {Email}", email);
                throw;
            }
        }

        public bool ValidatePassword(User user, string password)
        {
            try 
            {
                return BCrypt.Net.BCrypt.Verify(password, user.PasswordHash);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error validating password for user: {UserId}", user.UserID);
                throw;
            }
        }

        public string GenerateJwtToken(User user)
        {
            try 
            {
                var jwtSettings = _configuration.GetSection("JwtSettings");
                var secretKey = jwtSettings["SecretKey"] ?? throw new InvalidOperationException("JWT SecretKey is not configured");
                var issuer = jwtSettings["Issuer"] ?? throw new InvalidOperationException("JWT Issuer is not configured");
                var audience = jwtSettings["Audience"] ?? throw new InvalidOperationException("JWT Audience is not configured");

                var securityKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(secretKey));
                var credentials = new SigningCredentials(securityKey, SecurityAlgorithms.HmacSha256);

                // Map RoleID to role name
                string roleName = user.RoleID switch
                {
                    1 => "Admin",
                    2 => "Member",
                    3 => "Doctor",
                    4 => "Staff",
                    _ => "User"
                };

                var claims = new[]
                {
                    new Claim(ClaimTypes.NameIdentifier, user.UserID.ToString()),
                    new Claim(ClaimTypes.Email, user.Email),
                    new Claim(ClaimTypes.Role, roleName)
                };

                var token = new JwtSecurityToken(
                    issuer: issuer,
                    audience: audience,
                    claims: claims,
                    expires: DateTime.Now.AddDays(1),
                    signingCredentials: credentials
                );

                return new JwtSecurityTokenHandler().WriteToken(token);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error generating JWT token for user: {UserId}", user.UserID);
                throw;
            }
        }

        public async Task<(bool success, string message)> RegisterUserAsync(RegisterModel model)
        {
            try 
            {
                if (string.IsNullOrEmpty(model.Email) || string.IsNullOrEmpty(model.Password))
                {
                    return (false, "Email và mật khẩu không được để trống.");
                }

                var existingUser = await _context.Users.FirstOrDefaultAsync(u => u.Email == model.Email);
                if (existingUser != null)
                {
                    return (false, "Email đã được sử dụng.");
                }

                var hashedPassword = BCrypt.Net.BCrypt.HashPassword(model.Password);
                var user = new User
                {
                    Email = model.Email,
                    PasswordHash = hashedPassword,
                    FullName = model.FullName ?? "Chưa cập nhật",
                    RoleID = 2, // Default role for regular users
                    CreatedAt = DateTime.Now,
                    Status = "Active"
                };

                _context.Users.Add(user);
                await _context.SaveChangesAsync();

                return (true, "Đăng ký thành công.");
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error registering user with email: {Email}", model.Email);
                throw;
            }
        }

        public async Task<(bool success, string message, User? user)> LoginAsync(LoginModel model)
        {
            try 
            {
                _logger.LogInformation("Attempting login for email: {Email}", model.Email);

                if (string.IsNullOrEmpty(model.Email) || string.IsNullOrEmpty(model.Password))
                {
                    _logger.LogWarning("Login attempt with empty email or password");
                    return (false, "Email và mật khẩu không được để trống.", null);
                }

                var user = await GetUserByEmailAsync(model.Email);
                if (user == null)
                {
                    _logger.LogWarning("Login attempt for non-existent email: {Email}", model.Email);
                    return (false, "Email hoặc mật khẩu không đúng.", null);
                }

                _logger.LogInformation("Found user with ID: {UserId}, attempting password validation", user.UserID);
                var isValidPassword = ValidatePassword(user, model.Password);
                _logger.LogInformation("Password validation result for user {UserId}: {Result}", user.UserID, isValidPassword);

                if (!isValidPassword)
                {
                    _logger.LogWarning("Invalid password attempt for email: {Email}", model.Email);
                    return (false, "Email hoặc mật khẩu không đúng.", null);
                }

                _logger.LogInformation("Successful login for user: {UserId} with role: {RoleId}", user.UserID, user.RoleID);
                return (true, "Đăng nhập thành công.", user);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error during login for email: {Email}", model.Email);
                throw;
            }
        }

        public async Task<User> GetUserProfileAsync(int userId)
        {
            var user = await _context.Users.FindAsync(userId);
            if (user == null)
                return null;
            
            // Đảm bảo không trả về mật khẩu
            user.PasswordHash = null;
            return user;
        }

        public async Task<bool> UpdateUserProfileAsync(int userId, ProfileUpdateModel model)
        {
            var user = await _context.Users.FindAsync(userId);
            if (user == null)
                return false;

            // Cập nhật các thông tin được phép thay đổi
            user.FullName = model.FullName;
            user.Phone = model.Phone;
            user.Address = model.Address;
            
            // Xử lý avatar - nếu là base64 string
            if (!string.IsNullOrEmpty(model.Avatar) && IsBase64Image(model.Avatar))
            {
                try 
                {
                    // Lưu ảnh thành file
                    var base64Data = model.Avatar;
                    if (model.Avatar.Contains(","))
                    {
                        base64Data = Regex.Match(model.Avatar, @"data:image/(?<type>.+?);base64,(?<data>.+)").Groups["data"].Value;
                    }
                    
                    var imageBytes = Convert.FromBase64String(base64Data);
                    
                    // Tạo thư mục nếu chưa tồn tại
                    var uploadsFolder = Path.Combine(_environment.WebRootPath ?? "wwwroot", "uploads", "avatars");
                    if (!Directory.Exists(uploadsFolder))
                        Directory.CreateDirectory(uploadsFolder);
                    
                    // Tạo tên file duy nhất
                    var fileName = $"{userId}_{Guid.NewGuid()}.jpg";
                    var filePath = Path.Combine(uploadsFolder, fileName);
                    
                    // Lưu file
                    await File.WriteAllBytesAsync(filePath, imageBytes);
                    
                    // Lưu đường dẫn vào database
                    var relativePath = $"/uploads/avatars/{fileName}";
                    user.Avatar = relativePath;
                }
                catch (Exception ex)
                {
                    Console.WriteLine($"Error saving image: {ex.Message}");
                    // Fallback - lưu base64 nếu không lưu được file
                    user.Avatar = model.Avatar;
                }
            }
            else if (!string.IsNullOrEmpty(model.Avatar))
            {
                // Nếu không phải base64 thì giả sử là URL và lưu trực tiếp
                user.Avatar = model.Avatar;
            }

            try
            {
                await _context.SaveChangesAsync();
                return true;
            }
            catch
            {
                return false;
            }
        }
        
        // Kiểm tra xem chuỗi có phải là base64 của ảnh không
        private bool IsBase64Image(string base64String)
        {
            if (string.IsNullOrEmpty(base64String))
                return false;
                
            // Kiểm tra xem có phải định dạng data URL không
            if (base64String.StartsWith("data:image/"))
                return true;
                
            // Kiểm tra xem có phải base64 thuần không
            try
            {
                // Cắt bỏ tiền tố data URL nếu có
                string base64 = base64String;
                if (base64String.Contains(","))
                {
                    base64 = base64String.Split(',')[1];
                }
                
                Convert.FromBase64String(base64);
                return true;
            }
            catch
            {
                return false;
            }
        }

        public async Task<(bool Success, string Message)> ChangePasswordAsync(int userId, ChangePasswordModel model)
        {
            var user = await _context.Users.FindAsync(userId);
            if (user == null)
                return (false, "User not found");

            // Verify the old password
            if (!BCrypt.Net.BCrypt.Verify(model.OldPassword, user.PasswordHash))
                return (false, "Current password is incorrect");

            // Check if new password is the same as old password
            if (BCrypt.Net.BCrypt.Verify(model.NewPassword, user.PasswordHash))
                return (false, "New password cannot be the same as the current password");

            // Update password
            user.PasswordHash = BCrypt.Net.BCrypt.HashPassword(model.NewPassword);
            await _context.SaveChangesAsync();

            return (true, "Password changed successfully");
        }
    }
}

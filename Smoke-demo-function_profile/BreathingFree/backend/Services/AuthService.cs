using BreathingFree.Data;
using BreathingFree.Models;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using Microsoft.EntityFrameworkCore;
using System.Text.RegularExpressions;

namespace BreathingFree.Services
{
    public class AuthService
    {
        private readonly ApplicationDbContext _context;
        private readonly IConfiguration _config;
        private readonly IWebHostEnvironment _environment;

        public AuthService(ApplicationDbContext context, IConfiguration config, IWebHostEnvironment environment)
        {
            _context = context;
            _config = config;
            _environment = environment;
        }

        public async Task<string> RegisterAsync(RegisterModel model)
        {
            if (_context.Users.Any(u => u.Email == model.Email))
                return "Email already exists";

            var user = new User
            {
                FullName = model.FullName,
                Email = model.Email,
                PasswordHash = BCrypt.Net.BCrypt.HashPassword(model.Password),
                Gender = model.Gender,
                DOB = model.DOB,
                RoleID = 2,
                Status = "Active"
            };

            _context.Users.Add(user);
            await _context.SaveChangesAsync();

            return "User registered successfully";
        }

        public async Task<string> LoginAsync(LoginModel model)
        {
            var user = await _context.Users.FirstOrDefaultAsync(u => u.Email == model.Email);
            if (user == null || !BCrypt.Net.BCrypt.Verify(model.Password, user.PasswordHash))
                return null;

            return GenerateJwtToken(user);
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

        public async Task<User> GetUserByEmailAsync(string email)
        {
            var user = await _context.Users.FirstOrDefaultAsync(u => u.Email == email);
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

        private string GenerateJwtToken(User user)
        {
            var tokenHandler = new JwtSecurityTokenHandler();
            var key = Encoding.ASCII.GetBytes(_config["Jwt:Key"]);
            var tokenDescriptor = new SecurityTokenDescriptor
            {
                Subject = new ClaimsIdentity(new[]
                {
                    new Claim(ClaimTypes.NameIdentifier, user.UserID.ToString()),
                    new Claim(ClaimTypes.Email, user.Email),
                    new Claim(ClaimTypes.Role, user.RoleID.ToString())
                }),
                Expires = DateTime.UtcNow.AddDays(7),
                SigningCredentials = new SigningCredentials(new SymmetricSecurityKey(key), SecurityAlgorithms.HmacSha256Signature)
            };

            var token = tokenHandler.CreateToken(tokenDescriptor);
            return tokenHandler.WriteToken(token);
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

using BreathingFree.Services;
using Microsoft.AspNetCore.Mvc;
using BreathingFree.Models;
using Microsoft.AspNetCore.Authorization;
using System.Security.Claims;

namespace BreathingFree.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AuthController : ControllerBase
    {
        private readonly AuthService _authService;
        private readonly IConfiguration _config;
        private readonly IWebHostEnvironment _environment;
        private readonly IHttpContextAccessor _httpContextAccessor;

        public AuthController(AuthService authService, IConfiguration config, 
            IWebHostEnvironment environment, IHttpContextAccessor httpContextAccessor)
        {
            _authService = authService;
            _config = config;
            _environment = environment;
            _httpContextAccessor = httpContextAccessor;
        }

        [HttpPost("register")]
        public async Task<IActionResult> Register([FromBody] RegisterModel model)
        {
            var result = await _authService.RegisterAsync(model);
            if (result.Contains("exists")) return BadRequest(result);
            return Ok(result);
        }

        /*[HttpPost("login")]
        public IActionResult Login([FromBody] LoginModel model)
        {
            var token = _authService.Login(model);
            if (token == null) return Unauthorized("Invalid credentials");

            return Ok(new { token });
        }*/
        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] LoginModel model)
        {
            var token = await _authService.LoginAsync(model);
            if (token == null)
                return Unauthorized("Invalid credentials");

            // Lấy thông tin người dùng từ email để trả về cùng token
            var user = await _authService.GetUserByEmailAsync(model.Email);
            if (user == null)
                return Unauthorized("User not found");

            // Trả về token và thông tin cơ bản của user
            return Ok(new { 
                token,
                user = new {
                    userId = user.UserID,
                    fullName = user.FullName,
                    email = user.Email,
                    roleId = user.RoleID
                }
            });
        }

        [HttpGet("profile")]
        [Authorize]
        public async Task<IActionResult> GetProfile()
        {
            var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (string.IsNullOrEmpty(userId))
                return Unauthorized();

            var userProfile = await _authService.GetUserProfileAsync(int.Parse(userId));
            if (userProfile == null)
                return NotFound("User not found");

            // Xử lý avatar URL
            if (!string.IsNullOrEmpty(userProfile.Avatar) && !userProfile.Avatar.StartsWith("http") && !userProfile.Avatar.StartsWith("data:"))
            {
                // Nếu avatar là đường dẫn tương đối, thêm đường dẫn gốc
                var request = _httpContextAccessor.HttpContext.Request;
                var baseUrl = $"{request.Scheme}://{request.Host}";
                userProfile.Avatar = $"{baseUrl}{userProfile.Avatar}";
            }

            return Ok(userProfile);
        }

        [HttpPut("profile")]
        [Authorize]
        public async Task<IActionResult> UpdateProfile([FromBody] ProfileUpdateModel model)
        {
            var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (string.IsNullOrEmpty(userId))
                return Unauthorized();

            var result = await _authService.UpdateUserProfileAsync(int.Parse(userId), model);
            if (!result)
                return BadRequest("Failed to update profile");

            // Lấy thông tin profile đã cập nhật để trả về
            var updatedProfile = await _authService.GetUserProfileAsync(int.Parse(userId));
            
            return Ok(new { 
                message = "Profile updated successfully",
                profile = updatedProfile
            });
        }

        [HttpPost("change-password")]
        [Authorize]
        public async Task<IActionResult> ChangePassword([FromBody] ChangePasswordModel model)
        {
            var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (string.IsNullOrEmpty(userId))
                return Unauthorized();

            var result = await _authService.ChangePasswordAsync(int.Parse(userId), model);
            
            if (!result.Success)
                return BadRequest(result.Message);

            return Ok(new { message = result.Message });
        }
    }
}

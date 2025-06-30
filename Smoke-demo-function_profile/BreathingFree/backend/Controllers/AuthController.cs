using Microsoft.AspNetCore.Mvc;
using BreathingFree.Models;
using BreathingFree.Services;
using Microsoft.AspNetCore.Authorization;
using System.Security.Claims;
using Microsoft.Extensions.Logging;

namespace BreathingFree.Controllers
{
    [Route("api/auth")]
    [ApiController]
    public class AuthController : ControllerBase
    {
        private readonly AuthService _authService;
        private readonly ILogger<AuthController> _logger;

        public AuthController(AuthService authService, ILogger<AuthController> logger)
        {
            _authService = authService;
            _logger = logger;
        }

        [HttpPost("register")]
        public async Task<IActionResult> Register([FromBody] RegisterModel model)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var result = await _authService.RegisterUserAsync(model);
            if (!result.success)
            {
                return BadRequest(new { message = result.message });
            }

            return Ok(new { message = result.message });
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] LoginModel model)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var result = await _authService.LoginAsync(model);
            if (!result.success || result.user == null)
            {
                return BadRequest(new { message = result.message });
            }

            var token = _authService.GenerateJwtToken(result.user);

            return Ok(new
            {
                token,
                userId = result.user.UserID,
                email = result.user.Email,
                fullName = result.user.FullName,
                roleId = result.user.RoleID,
                message = result.message
            });
        }

        [Authorize]
        [HttpPost("logout")]
        public IActionResult Logout()
        {
            try
            {
                var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
                _logger.LogInformation("Logout attempt for user: {UserId}", userId);

                Response.Cookies.Delete("jwt");

                _logger.LogInformation("Logout successful for user: {UserId}", userId);
                return Ok(new { message = "Đăng xuất thành công." });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error during logout");
                return StatusCode(500, new { message = "Đã xảy ra lỗi trong quá trình đăng xuất. Vui lòng thử lại sau." });
            }
        }

        [Authorize]
        [HttpGet("me")]
        public async Task<IActionResult> GetCurrentUser()
        {
            var userEmail = User.FindFirst(ClaimTypes.Email)?.Value;
            if (string.IsNullOrEmpty(userEmail))
            {
                return Unauthorized(new { message = "Không tìm thấy thông tin người dùng." });
            }

            var user = await _authService.GetUserByEmailAsync(userEmail);
            if (user == null)
            {
                return NotFound(new { message = "Không tìm thấy thông tin người dùng." });
            }

            return Ok(new
            {
                id = user.UserID,
                email = user.Email,
                fullName = user.FullName,
                roleId = user.RoleID
            });
        }

        [Authorize]
        [HttpGet("profile")]
        public async Task<IActionResult> GetProfile()
        {
            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier);
            if (userIdClaim == null || !int.TryParse(userIdClaim.Value, out int userId))
            {
                return Unauthorized(new { message = "Không tìm thấy thông tin người dùng." });
            }

            var user = await _authService.GetUserProfileAsync(userId);
            if (user == null)
            {
                return NotFound(new { message = "Không tìm thấy thông tin người dùng." });
            }

            return Ok(user);
        }

        [Authorize]
        [HttpPut("profile")]
        public async Task<IActionResult> UpdateProfile([FromBody] ProfileUpdateModel model)
        {
            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier);
            if (userIdClaim == null || !int.TryParse(userIdClaim.Value, out int userId))
            {
                return Unauthorized(new { message = "Không tìm thấy thông tin người dùng." });
            }

            var success = await _authService.UpdateUserProfileAsync(userId, model);
            if (!success)
            {
                return BadRequest(new { message = "Không thể cập nhật thông tin người dùng." });
            }

            return Ok(new { message = "Cập nhật thông tin thành công." });
        }

        [Authorize]
        [HttpPost("change-password")]
        public async Task<IActionResult> ChangePassword([FromBody] ChangePasswordModel model)
        {
            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier);
            if (userIdClaim == null || !int.TryParse(userIdClaim.Value, out int userId))
            {
                return Unauthorized(new { message = "Không tìm thấy thông tin người dùng." });
            }

            var result = await _authService.ChangePasswordAsync(userId, model);
            if (!result.Success)
            {
                return BadRequest(new { message = result.Message });
            }

            return Ok(new { message = result.Message });
        }
    }
}

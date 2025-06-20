using BreathingFree.Services;
using Microsoft.AspNetCore.Mvc;
using BreathingFree.Models;

namespace BreathingFree.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AuthController : ControllerBase
    {
        private readonly AuthService _authService;

        public AuthController(AuthService authService)
        {
            _authService = authService;
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

            return Ok(new { token });
        }

    }

}

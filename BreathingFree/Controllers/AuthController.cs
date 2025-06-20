using BreathingFree.Services;
using Microsoft.AspNetCore.Mvc;
using BreathingFree.Models;
using BreathingFree.Services.Validation;

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


        /*[HttpPost("register")]
        public async Task<IActionResult> Register([FromBody] RegisterModel model)
        {
            if (!ModelState.IsValid)
            {
                var errors = ModelState.Values
                    .SelectMany(v => v.Errors)
                    .Select(e => e.ErrorMessage)
                    .ToList();

                return BadRequest(new { message = "Validation failed", errors });
            }

            var result = await _authService.RegisterAsync(model);
            if (result.Contains("exists")) return BadRequest(result);
            return Ok(result);
        }*/
        [HttpPost("register")]
        public async Task<IActionResult> Register([FromBody] RegisterModel model)
        {
            var errors = InputValidator.ValidateRegister(model); // ✅ kiểm tra thủ công
            if (errors.Any())
                return BadRequest(new { message = "Validation failed", errors });

            var result = await _authService.RegisterAsync(model);
            if (result.Contains("exists")) return BadRequest(result);
            return Ok(result);
        }



        /*[HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] LoginModel model)
        {
            var token = await _authService.LoginAsync(model);
            if (token == null)
                return Unauthorized("Invalid credentials");

            return Ok(new { token });
        }*/

        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] LoginModel model)
        {
            var errors = InputValidator.ValidateLogin(model); // ✅ kiểm tra thủ công
            if (errors.Any())
                return BadRequest(new { message = "Validation failed", errors });

            var token = await _authService.LoginAsync(model);
            if (token == null)
                return Unauthorized("Incorrect email or password. Please try again.");

            return Ok(new { token });
        }

    }

}

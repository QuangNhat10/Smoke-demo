using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using BreathingFree.Models;
using BreathingFree.Services;
using System.Security.Claims;

namespace BreathingFree.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class QuitPlanController : ControllerBase
    {
        private readonly QuitPlanService _quitPlanService;

        public QuitPlanController(QuitPlanService quitPlanService)
        {
            _quitPlanService = quitPlanService;
        }

        [HttpPost]
        public async Task<IActionResult> CreateQuitPlan([FromBody] CreateQuitPlanDto createDto)
        {
            try
            {
                var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
                if (string.IsNullOrEmpty(userIdClaim) || !int.TryParse(userIdClaim, out int userId))
                {
                    return Unauthorized(new { message = "Không thể xác thực người dùng" });
                }

                var quitPlan = await _quitPlanService.CreateQuitPlanAsync(userId, createDto);
                return Ok(new { 
                    message = "Tạo kế hoạch cai thuốc thành công", 
                    data = quitPlan 
                });
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetQuitPlan(int id)
        {
            try
            {
                var quitPlan = await _quitPlanService.GetQuitPlanAsync(id);
                
                // Kiểm tra quyền truy cập
                var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
                if (string.IsNullOrEmpty(userIdClaim) || !int.TryParse(userIdClaim, out int userId))
                {
                    return Unauthorized(new { message = "Không thể xác thực người dùng" });
                }

                if (quitPlan.UserID != userId)
                {
                    return Forbid("Bạn không có quyền truy cập kế hoạch này");
                }

                return Ok(new { data = quitPlan });
            }
            catch (ArgumentException ex)
            {
                return NotFound(new { message = ex.Message });
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        [HttpGet("my-plans")]
        public async Task<IActionResult> GetMyQuitPlans()
        {
            try
            {
                var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
                if (string.IsNullOrEmpty(userIdClaim) || !int.TryParse(userIdClaim, out int userId))
                {
                    return Unauthorized(new { message = "Không thể xác thực người dùng" });
                }

                var quitPlans = await _quitPlanService.GetUserQuitPlansAsync(userId);
                return Ok(new { data = quitPlans });
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        [HttpGet("active")]
        public async Task<IActionResult> GetActiveQuitPlan()
        {
            try
            {
                var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
                if (string.IsNullOrEmpty(userIdClaim) || !int.TryParse(userIdClaim, out int userId))
                {
                    return Unauthorized(new { message = "Không thể xác thực người dùng" });
                }

                var quitPlan = await _quitPlanService.GetActiveQuitPlanAsync(userId);
                return Ok(new { data = quitPlan });
            }
            catch (ArgumentException ex)
            {
                return NotFound(new { message = ex.Message });
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        [HttpPut("{id}/status")]
        public async Task<IActionResult> UpdateQuitPlanStatus(int id, [FromBody] UpdateQuitPlanStatusDto updateDto)
        {
            try
            {
                var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
                if (string.IsNullOrEmpty(userIdClaim) || !int.TryParse(userIdClaim, out int userId))
                {
                    return Unauthorized(new { message = "Không thể xác thực người dùng" });
                }

                // Logic cập nhật status sẽ được implement sau
                return Ok(new { message = "Cập nhật trạng thái thành công" });
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        // Endpoint cho bác sĩ xem kế hoạch của bệnh nhân
        [HttpGet("patient/{patientId}")]
        [Authorize(Roles = "Doctor")]
        public async Task<IActionResult> GetPatientQuitPlans(int patientId)
        {
            try
            {
                var quitPlans = await _quitPlanService.GetUserQuitPlansAsync(patientId);
                return Ok(new { data = quitPlans });
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        // Endpoint cho bác sĩ phê duyệt kế hoạch
        [HttpPut("{id}/approve")]
        [Authorize(Roles = "Doctor")]
        public async Task<IActionResult> ApproveQuitPlan(int id, [FromBody] ApproveQuitPlanDto approveDto)
        {
            try
            {
                // Logic phê duyệt sẽ được implement sau
                return Ok(new { message = "Phê duyệt kế hoạch thành công" });
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        [HttpPost("add-smoke-free-day")]
        public async Task<IActionResult> AddSmokeFreeDay()
        {
            try
            {
                var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
                if (string.IsNullOrEmpty(userIdClaim) || !int.TryParse(userIdClaim, out int userId))
                {
                    return Unauthorized(new { message = "Không thể xác thực người dùng" });
                }

                var progress = await _quitPlanService.AddSmokeFreeDay(userId);
                return Ok(new { 
                    message = "Chúc mừng bạn đã có thêm một ngày không hút thuốc!", 
                    data = progress 
                });
            }
            catch (ArgumentException ex)
            {
                return BadRequest(new { message = ex.Message });
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = "Có lỗi xảy ra khi ghi nhận tiến trình" });
            }
        }

        [HttpPost("reset")]
        public async Task<IActionResult> ResetQuitPlan()
        {
            try
            {
                var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
                if (string.IsNullOrEmpty(userIdClaim) || !int.TryParse(userIdClaim, out int userId))
                {
                    return Unauthorized(new { message = "Không thể xác thực người dùng" });
                }

                var result = await _quitPlanService.ResetQuitPlanAsync(userId);
                return Ok(new { 
                    message = "Đã reset kế hoạch cai thuốc thành công! Bạn có thể tạo kế hoạch mới.", 
                    data = result 
                });
            }
            catch (ArgumentException ex)
            {
                return BadRequest(new { message = ex.Message });
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = "Có lỗi xảy ra khi reset kế hoạch" });
            }
        }
>>>>>>> feb8be7 ( Complete)
    }

    // DTO classes cho các request
    public class UpdateQuitPlanStatusDto
    {
        public string Status { get; set; } = string.Empty; // Active, Completed, Paused, Cancelled
        public string? Notes { get; set; }
    }

    public class ApproveQuitPlanDto
    {
        public bool IsApproved { get; set; }
        public string? DoctorNotes { get; set; }
        public List<string>? RecommendedSupport { get; set; }
    }
} 
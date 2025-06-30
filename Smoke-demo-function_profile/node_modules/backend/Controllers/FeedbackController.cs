using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using BreathingFree.Data;
using BreathingFree.Models;
using System.Threading.Tasks;
using System.Linq;
using Microsoft.Extensions.Logging;
using Microsoft.AspNetCore.Authorization;
using System.Security.Claims;

namespace BreathingFree.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class FeedbackController : ControllerBase
    {
        private readonly ApplicationDbContext _context;
        private readonly ILogger<FeedbackController> _logger;

        public FeedbackController(ApplicationDbContext context, ILogger<FeedbackController> logger)
        {
            _context = context;
            _logger = logger;
        }

        [HttpGet("doctors")]
        public async Task<IActionResult> GetDoctors()
        {
            try
            {
                var doctors = await _context.Users
                    .Where(u => u.RoleID == 3) // RoleID 3 là bác sĩ
                    .Select(d => new
                    {
                        d.UserID,
                        d.FullName,
                        d.Email,
                        d.Phone,
                        d.Specialty,
                        AverageRating = _context.Feedbacks
                            .Where(f => f.DoctorID == d.UserID)
                            .Select(f => (double)f.Rating)
                            .DefaultIfEmpty()
                            .Average(),
                        ReviewCount = _context.Feedbacks
                            .Count(f => f.DoctorID == d.UserID)
                    })
                    .ToListAsync();

                return Ok(doctors);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Có lỗi xảy ra khi lấy danh sách bác sĩ.", error = ex.Message });
            }
        }

        [Authorize]
        [HttpPost("doctors")]
        public async Task<IActionResult> AddDoctorFeedback([FromBody] Feedback feedback)
        {
            try
            {
                // Kiểm tra người dùng đã đăng nhập
                var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
                if (string.IsNullOrEmpty(userId) || int.Parse(userId) != feedback.UserID)
                {
                    return Unauthorized(new { message = "Bạn không có quyền thực hiện hành động này." });
                }

                // Kiểm tra membership
                var membership = await _context.Memberships
                    .Where(m => m.UserID == int.Parse(userId) && m.EndDate > DateTime.UtcNow)
                    .FirstOrDefaultAsync();

                if (membership == null)
                {
                    return StatusCode(403, new { message = "Bạn cần có gói thành viên để đánh giá bác sĩ." });
                }

                // Kiểm tra bác sĩ tồn tại
                var doctor = await _context.Users
                    .FirstOrDefaultAsync(d => d.UserID == feedback.DoctorID && d.RoleID == 3);

                if (doctor == null)
                {
                    return NotFound(new { message = "Không tìm thấy bác sĩ." });
                }

                // Kiểm tra đánh giá hợp lệ
                if (feedback.Rating < 1 || feedback.Rating > 5)
                {
                    return BadRequest(new { message = "Đánh giá phải từ 1 đến 5 sao." });
                }

                if (string.IsNullOrWhiteSpace(feedback.FeedbackText))
                {
                    return BadRequest(new { message = "Vui lòng nhập nội dung đánh giá." });
                }

                // Normalize feedback text to ensure proper Unicode handling
                feedback.FeedbackText = feedback.FeedbackText.Normalize(System.Text.NormalizationForm.FormC);

                // Kiểm tra xem người dùng đã đánh giá bác sĩ này chưa
                var existingFeedback = await _context.Feedbacks
                    .FirstOrDefaultAsync(f => f.UserID == int.Parse(userId) && f.DoctorID == feedback.DoctorID);

                if (existingFeedback != null)
                {
                    // Cập nhật đánh giá cũ
                    existingFeedback.Rating = feedback.Rating;
                    existingFeedback.FeedbackText = feedback.FeedbackText;
                    existingFeedback.SubmittedAt = DateTime.UtcNow;
                    await _context.SaveChangesAsync();
                    return Ok(new { message = "Đã cập nhật đánh giá của bạn." });
                }

                // Thêm đánh giá mới
                feedback.SubmittedAt = DateTime.UtcNow;
                _context.Feedbacks.Add(feedback);
                await _context.SaveChangesAsync();

                return Ok(new { message = "Đã thêm đánh giá thành công." });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Có lỗi xảy ra khi thêm đánh giá.", error = ex.Message });
            }
        }

        [HttpGet("doctors/{doctorId}")]
        public async Task<IActionResult> GetDoctorFeedbacks(int doctorId)
        {
            try
            {
                var feedbacks = await _context.Feedbacks
                    .Where(f => f.DoctorID == doctorId)
                    .Include(f => f.User)
                    .Select(f => new
                    {
                        f.FeedbackID,
                        f.Rating,
                        FeedbackText = f.FeedbackText != null ? f.FeedbackText.Normalize(System.Text.NormalizationForm.FormC) : null,
                        f.SubmittedAt,
                        UserName = f.User != null ? f.User.FullName : "Anonymous"
                    })
                    .OrderByDescending(f => f.SubmittedAt)
                    .ToListAsync();

                return Ok(feedbacks);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Có lỗi xảy ra khi lấy danh sách đánh giá.", error = ex.Message });
            }
        }
    }
}

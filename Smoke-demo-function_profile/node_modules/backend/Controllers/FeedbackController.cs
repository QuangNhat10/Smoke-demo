using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using BreathingFree.Data;
using BreathingFree.Models;
using System.Threading.Tasks;
using System.Linq;
using Microsoft.Extensions.Logging;

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

        [HttpGet("search")]
        public async Task<IActionResult> SearchDoctors([FromQuery] string? name)
        {
            try
            {
                _logger.LogInformation($"Searching doctors with name: {name}");

                // First, just try to get all users to see if that works
                var allUsers = await _context.Users.ToListAsync();
                _logger.LogInformation($"Total users in database: {allUsers.Count}");

                // Then filter for doctors
                var doctors = allUsers.Where(u => u.RoleID == 3)
                    .Select(d => new
                    {
                        d.UserID,
                        FullName = d.FullName ?? "Chưa cập nhật",
                        Email = d.Email ?? "Chưa cập nhật",
                        Gender = d.Gender ?? "Chưa cập nhật",
                        DOB = d.DOB,
                        Phone = d.Phone ?? "Chưa cập nhật",
                        Address = d.Address ?? "Chưa cập nhật",
                        Avatar = d.Avatar ?? "👨‍⚕️",
                        Specialty = d.Specialty ?? "Chưa cập nhật chuyên môn",
                        Position = d.Position ?? "Chưa cập nhật chức vụ",
                        ShortBio = d.ShortBio ?? "Chưa có thông tin"
                    })
                    .ToList();

                _logger.LogInformation($"Found {doctors.Count} doctors");

                // If name is provided, filter in memory
                if (!string.IsNullOrWhiteSpace(name))
                {
                    name = name.ToLower();
                    doctors = doctors.Where(d =>
                        d.FullName.ToLower().Contains(name) ||
                        d.Specialty.ToLower().Contains(name) ||
                        d.Position.ToLower().Contains(name)
                    ).ToList();
                    _logger.LogInformation($"After name filter: {doctors.Count} doctors");
                }

                return Ok(doctors);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error searching doctors");
                throw; // Let the global error handler deal with it
            }
        }

        [HttpPost]
        public async Task<IActionResult> AddFeedback([FromBody] Feedback feedback)
        {
            try
            {
                if (!ModelState.IsValid)
                {
                    return BadRequest(ModelState);
                }

                // Verify doctor exists
                var doctorExists = await _context.Users
                    .AnyAsync(u => u.UserID == feedback.DoctorID && u.RoleID == 3);

                if (!doctorExists)
                {
                    return BadRequest(new { message = "Doctor not found" });
                }

                feedback.SubmittedAt = DateTime.Now;
                _context.Feedbacks.Add(feedback);
                await _context.SaveChangesAsync();

                return Ok(new { message = "Feedback added successfully", feedback });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error adding feedback");
                throw; // Let the global error handler deal with it
            }
        }

        [HttpGet("doctor/{doctorId}")]
        public async Task<IActionResult> GetDoctorFeedbacks(int doctorId)
        {
            try
            {
                var feedbacks = await _context.Feedbacks
                    .Where(f => f.DoctorID == doctorId)
                    .OrderByDescending(f => f.SubmittedAt)
                    .Select(f => new
                    {
                        f.FeedbackID,
                        f.Rating,
                        Comment = f.FeedbackText ?? "",
                        f.SubmittedAt
                    })
                    .ToListAsync();

                return Ok(feedbacks);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error getting doctor feedbacks");
                throw; // Let the global error handler deal with it
            }
        }
    }
}

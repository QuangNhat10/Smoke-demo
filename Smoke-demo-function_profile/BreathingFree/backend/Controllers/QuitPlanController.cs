using System;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using BreathingFree.Models;
using BreathingFree.Data;
using System.Security.Claims;
using Microsoft.EntityFrameworkCore;

namespace BreathingFree.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class QuitPlanController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public QuitPlanController(ApplicationDbContext context)
        {
            _context = context;
        }

        [HttpPost]
        public async Task<IActionResult> CreatePlan([FromBody] QuitPlan plan)
        {
            try
            {
                var userIdString = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
                if (string.IsNullOrEmpty(userIdString) || !int.TryParse(userIdString, out int userId))
                {
                    return Unauthorized();
                }

                plan.UserID = userId;
                plan.CreatedAt = DateTime.Now;
                plan.IsApproved = false;

                _context.QuitPlans.Add(plan);
                await _context.SaveChangesAsync();

                return Ok(new { message = "Plan created successfully", planId = plan.ID });
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = "Error creating plan", error = ex.Message });
            }
        }

        [HttpGet("user")]
        public async Task<IActionResult> GetUserPlans()
        {
            try
            {
                var userIdString = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
                if (string.IsNullOrEmpty(userIdString) || !int.TryParse(userIdString, out int userId))
                {
                    return Unauthorized();
                }

                var plans = await _context.QuitPlans
                    .Where(p => p.UserID == userId)
                    .OrderByDescending(p => p.CreatedAt)
                    .ToListAsync();

                return Ok(plans);
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = "Error fetching plans", error = ex.Message });
            }
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetPlan(int id)
        {
            try
            {
                var userIdString = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
                if (string.IsNullOrEmpty(userIdString) || !int.TryParse(userIdString, out int userId))
                {
                    return Unauthorized();
                }

                var plan = await _context.QuitPlans
                    .FirstOrDefaultAsync(p => p.ID == id && (p.UserID == userId || p.DoctorID == userId));

                if (plan == null)
                {
                    return NotFound(new { message = "Plan not found" });
                }

                return Ok(plan);
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = "Error fetching plan", error = ex.Message });
            }
        }

        [HttpPut("{id}/approve")]
        [Authorize(Roles = "Doctor")]
        public async Task<IActionResult> ApprovePlan(int id, [FromBody] string notes)
        {
            try
            {
                var doctorIdString = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
                if (string.IsNullOrEmpty(doctorIdString) || !int.TryParse(doctorIdString, out int doctorId))
                {
                    return Unauthorized();
                }

                var plan = await _context.QuitPlans.FindAsync(id);
                if (plan == null)
                {
                    return NotFound(new { message = "Plan not found" });
                }

                plan.IsApproved = true;
                plan.DoctorID = doctorId;
                plan.DoctorNotes = notes;
                plan.UpdatedAt = DateTime.Now;

                await _context.SaveChangesAsync();

                return Ok(new { message = "Plan approved successfully" });
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = "Error approving plan", error = ex.Message });
            }
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeletePlan(int id)
        {
            try
            {
                var userIdString = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
                if (string.IsNullOrEmpty(userIdString) || !int.TryParse(userIdString, out int userId))
                {
                    return Unauthorized();
                }

                var plan = await _context.QuitPlans
                    .FirstOrDefaultAsync(p => p.ID == id && p.UserID == userId);

                if (plan == null)
                {
                    return NotFound(new { message = "Plan not found" });
                }

                _context.QuitPlans.Remove(plan);
                await _context.SaveChangesAsync();

                return Ok(new { message = "Plan deleted successfully" });
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = "Error deleting plan", error = ex.Message });
            }
        }
    }
} 
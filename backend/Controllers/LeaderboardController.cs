using BreathingFree.Data;
using BreathingFree.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace BreathingFree.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class LeaderboardController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public LeaderboardController(ApplicationDbContext context)
        {
            _context = context;
        }

        /// <summary>
        /// Get leaderboard data. Sort by "days" (default) or "money".
        /// </summary>
        /// <param name="sortBy">days | money</param>
        /// <returns></returns>
        [HttpGet]
        public async Task<IActionResult> GetLeaderboard([FromQuery] string sortBy = "days")
        {
            // Group quit progress records by user to calculate statistics
            var progressGroups = await _context.QuitProgresses
                .Include(p => p.User) // for user full name
                .GroupBy(p => new { p.UserID, p.User.FullName })
                .Select(g => new LeaderboardEntryDto
                {
                    UserID = g.Key.UserID,
                    FullName = g.Key.FullName ?? "Người dùng",
                    DaysSmokeFree = g.Max(p => p.DaysSmokeFree),
                    MoneySaved = g.Sum(p => p.MoneySaved),
                    LatestHealthNote = g.OrderByDescending(p => p.Date).Select(p => p.HealthNote).FirstOrDefault()
                })
                .ToListAsync();

            // Apply sorting
            progressGroups = sortBy.ToLower() switch
            {
                "money" => progressGroups.OrderByDescending(e => e.MoneySaved).ToList(),
                _ => progressGroups.OrderByDescending(e => e.DaysSmokeFree).ToList()
            };

            return Ok(new { data = progressGroups });
        }
    }
} 
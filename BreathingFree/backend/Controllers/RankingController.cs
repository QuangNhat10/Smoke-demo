using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using BreathingFree.Services;
using BreathingFree.Models;

namespace BreathingFree.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class RankingController : ControllerBase
    {
        private readonly RankingService _rankingService;

        public RankingController(RankingService rankingService)
        {
            _rankingService = rankingService;
        }

        [HttpGet("leaderboard")]
        [Authorize]
        public async Task<ActionResult<object>> GetLeaderboard()
        {
            try
            {
                var rankings = await _rankingService.GetLeaderboardAsync();
                return Ok(new { success = true, data = rankings });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { success = false, message = ex.Message });
            }
        }

        [HttpGet("user-rank/{userId}")]
        [Authorize]
        public async Task<ActionResult<object>> GetUserRank(int userId)
        {
            try
            {
                var userRank = await _rankingService.GetUserRankAsync(userId);
                if (userRank == null)
                {
                    return NotFound(new { success = false, message = "User ranking not found" });
                }
                return Ok(new { success = true, data = userRank });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { success = false, message = ex.Message });
            }
        }

        [HttpGet("leaderboard-with-user/{userId}")]
        [Authorize]
        public async Task<ActionResult<object>> GetLeaderboardWithUser(int userId)
        {
            try
            {
                var result = await _rankingService.GetLeaderboardWithUserRankAsync(userId);
                return Ok(new { success = true, data = result });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { success = false, message = ex.Message });
            }
        }

        // Test endpoint không cần authorization
        [HttpGet("test")]
        public ActionResult<object> Test()
        {
            return Ok(new { 
                success = true, 
                message = "Ranking API is working!", 
                timestamp = DateTime.Now,
                data = new {
                    leaderboard = GetFallbackLeaderboard().Take(3),
                    currentUserRank = GetFallbackUserRank(1)
                }
            });
        }

        private List<object> GetFallbackLeaderboard()
        {
            return new List<object>
            {
                new { userID = 1, fullName = "Nguyễn Văn A", avatar = (string?)null, rank = 1, daysSmokeFree = 365, totalMoneySaved = 1825000, points = 5475 },
                new { userID = 2, fullName = "Trần Thị B", avatar = (string?)null, rank = 2, daysSmokeFree = 287, totalMoneySaved = 1435000, points = 4305 },
                new { userID = 3, fullName = "Phạm Văn C", avatar = (string?)null, rank = 3, daysSmokeFree = 240, totalMoneySaved = 1200000, points = 3600 },
                new { userID = 4, fullName = "Lê Thị D", avatar = (string?)null, rank = 4, daysSmokeFree = 192, totalMoneySaved = 960000, points = 2880 },
                new { userID = 5, fullName = "Hoàng Văn E", avatar = (string?)null, rank = 5, daysSmokeFree = 178, totalMoneySaved = 890000, points = 2670 },
                new { userID = 6, fullName = "Nguyễn Thị F", avatar = (string?)null, rank = 6, daysSmokeFree = 150, totalMoneySaved = 750000, points = 2250 },
                new { userID = 7, fullName = "Vũ Văn G", avatar = (string?)null, rank = 7, daysSmokeFree = 130, totalMoneySaved = 650000, points = 1950 },
                new { userID = 8, fullName = "Đặng Thị H", avatar = (string?)null, rank = 8, daysSmokeFree = 110, totalMoneySaved = 550000, points = 1650 },
                new { userID = 9, fullName = "Bùi Văn I", avatar = (string?)null, rank = 9, daysSmokeFree = 95, totalMoneySaved = 475000, points = 1425 },
                new { userID = 10, fullName = "Trương Thị K", avatar = (string?)null, rank = 10, daysSmokeFree = 82, totalMoneySaved = 410000, points = 1230 }
            };
        }

        private object GetFallbackUserRank(int userId)
        {
            return new { 
                userID = userId, 
                fullName = "Bạn", 
                avatar = (string?)null, 
                rank = 15, 
                daysSmokeFree = 7, 
                totalMoneySaved = 35000, 
                points = 105 
            };
        }
    }
} 
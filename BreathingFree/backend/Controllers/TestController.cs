using Microsoft.AspNetCore.Mvc;

namespace BreathingFree.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class TestController : ControllerBase
    {
        [HttpGet]
        public ActionResult<object> Test()
        {
            return Ok(new { message = "Backend is working!", timestamp = DateTime.Now });
        }

        [HttpGet("ranking-test")]
        public ActionResult<object> RankingTest()
        {
            // Test data without database
            var testRankings = new[]
            {
                new { userID = 1, fullName = "Nguyễn Văn A", daysSmokeFree = 100, totalMoneySaved = 500000, points = 1050, rank = 1 },
                new { userID = 2, fullName = "Trần Thị B", daysSmokeFree = 80, totalMoneySaved = 400000, points = 840, rank = 2 },
                new { userID = 3, fullName = "Lê Văn C", daysSmokeFree = 60, totalMoneySaved = 300000, points = 630, rank = 3 }
            };

            var testUserRank = new { userID = 2, fullName = "Trần Thị B", daysSmokeFree = 80, totalMoneySaved = 400000, points = 840, rank = 2 };

            return Ok(new { 
                success = true, 
                data = new {
                    leaderboard = testRankings,
                    currentUserRank = testUserRank
                }
            });
        }
    }
} 
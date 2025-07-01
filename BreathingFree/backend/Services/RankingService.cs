using Microsoft.EntityFrameworkCore;
using BreathingFree.Data;
using BreathingFree.Models;

namespace BreathingFree.Services
{
    public class RankingService
    {
        private readonly ApplicationDbContext _context;

        public RankingService(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<List<UserRankingDto>> GetLeaderboardAsync(int limit = 50)
        {
            var rankings = await _context.Users
                .Where(u => u.RoleID == 1) // Chỉ lấy members (RoleID = 1)
                .GroupJoin(
                    _context.QuitProgresses,
                    user => user.UserID,
                    progress => progress.UserID,
                    (user, progressGroup) => new { user, progressGroup }
                )
                .Select(x => new UserRankingDto
                {
                    UserID = x.user.UserID,
                    FullName = x.user.FullName ?? "Unknown",
                    Avatar = x.user.Avatar,
                    DaysSmokeFree = x.progressGroup.Any() ? x.progressGroup.Max(p => p.DaysSmokeFree) : 0,
                    TotalMoneySaved = x.progressGroup.Any() ? x.progressGroup.Sum(p => p.MoneySaved) : 0,
                    Points = CalculatePoints(
                        x.progressGroup.Any() ? x.progressGroup.Max(p => p.DaysSmokeFree) : 0,
                        x.progressGroup.Any() ? x.progressGroup.Sum(p => p.MoneySaved) : 0,
                        x.progressGroup.Count(p => !p.SmokedToday)
                    ),
                    ConsecutiveDays = x.progressGroup.Any() ? x.progressGroup.Max(p => p.DaysSmokeFree) : 0,
                    LastActiveDate = x.progressGroup.Any() ? x.progressGroup.Max(p => p.Date) : x.user.CreatedAt
                })
                .OrderByDescending(r => r.DaysSmokeFree) // Ưu tiên theo số ngày không hút thuốc
                .ThenByDescending(r => r.TotalMoneySaved) // Sau đó theo tiền tiết kiệm
                .ThenByDescending(r => r.Points) // Cuối cùng theo điểm
                .Take(limit)
                .ToListAsync();

            // Assign ranks
            for (int i = 0; i < rankings.Count; i++)
            {
                rankings[i].Rank = i + 1;
            }

            return rankings;
        }

        public async Task<UserRankingDto?> GetUserRankAsync(int userId)
        {
            var allRankings = await GetAllUserRankingsAsync();
            return allRankings.FirstOrDefault(r => r.UserID == userId);
        }

        public async Task<LeaderboardWithUserDto> GetLeaderboardWithUserRankAsync(int userId, int leaderboardLimit = 10)
        {
            var leaderboard = await GetLeaderboardAsync(leaderboardLimit);
            var userRank = await GetUserRankAsync(userId);

            return new LeaderboardWithUserDto
            {
                Leaderboard = leaderboard,
                CurrentUserRank = userRank
            };
        }

        private async Task<List<UserRankingDto>> GetAllUserRankingsAsync()
        {
            var rankings = await _context.Users
                .Where(u => u.RoleID == 1) // Chỉ lấy members
                .GroupJoin(
                    _context.QuitProgresses,
                    user => user.UserID,
                    progress => progress.UserID,
                    (user, progressGroup) => new { user, progressGroup }
                )
                .Select(x => new UserRankingDto
                {
                    UserID = x.user.UserID,
                    FullName = x.user.FullName ?? "Unknown",
                    Avatar = x.user.Avatar,
                    DaysSmokeFree = x.progressGroup.Any() ? x.progressGroup.Max(p => p.DaysSmokeFree) : 0,
                    TotalMoneySaved = x.progressGroup.Any() ? x.progressGroup.Sum(p => p.MoneySaved) : 0,
                    Points = CalculatePoints(
                        x.progressGroup.Any() ? x.progressGroup.Max(p => p.DaysSmokeFree) : 0,
                        x.progressGroup.Any() ? x.progressGroup.Sum(p => p.MoneySaved) : 0,
                        x.progressGroup.Count(p => !p.SmokedToday)
                    ),
                    ConsecutiveDays = x.progressGroup.Any() ? x.progressGroup.Max(p => p.DaysSmokeFree) : 0,
                    LastActiveDate = x.progressGroup.Any() ? x.progressGroup.Max(p => p.Date) : x.user.CreatedAt
                })
                .OrderByDescending(r => r.DaysSmokeFree) // Ưu tiên theo số ngày không hút thuốc
                .ThenByDescending(r => r.TotalMoneySaved) // Sau đó theo tiền tiết kiệm
                .ThenByDescending(r => r.Points) // Cuối cùng theo điểm
                .ToListAsync();

            // Assign ranks
            for (int i = 0; i < rankings.Count; i++)
            {
                rankings[i].Rank = i + 1;
            }

            return rankings;
        }

        private static int CalculatePoints(int daysSmokeFree, decimal moneySaved, int smokeFreeStreak)
        {
            // Công thức tính điểm:
            // - Mỗi ngày không hút thuốc: 10 điểm
            // - Mỗi 1000 VND tiết kiệm: 1 điểm
            // - Bonus cho streak dài: thêm 5 điểm cho mỗi 7 ngày liên tiếp
            
            var basePoints = daysSmokeFree * 10;
            var moneyPoints = (int)(moneySaved / 1000);
            var streakBonus = (smokeFreeStreak / 7) * 5;
            
            return basePoints + moneyPoints + streakBonus;
        }
    }

    public class UserRankingDto
    {
        public int UserID { get; set; }
        public string FullName { get; set; } = string.Empty;
        public string? Avatar { get; set; }
        public int Rank { get; set; }
        public int DaysSmokeFree { get; set; }
        public decimal TotalMoneySaved { get; set; }
        public int Points { get; set; }
        public int ConsecutiveDays { get; set; }
        public DateTime LastActiveDate { get; set; }
    }

    public class LeaderboardWithUserDto
    {
        public List<UserRankingDto> Leaderboard { get; set; } = new();
        public UserRankingDto? CurrentUserRank { get; set; }
    }
} 
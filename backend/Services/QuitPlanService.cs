using BreathingFree.Data;
using BreathingFree.Models;
using Microsoft.EntityFrameworkCore;
using System.Text.Json;

namespace BreathingFree.Services
{
    public class QuitPlanService
    {
        private readonly ApplicationDbContext _context;

        public QuitPlanService(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<QuitPlanDto> CreateQuitPlanAsync(int userId, CreateQuitPlanDto createDto)
        {
            // Kiểm tra xem người dùng đã có kế hoạch Active hay chưa
            var existingActivePlan = await _context.QuitPlans
                .FirstOrDefaultAsync(q => q.UserID == userId && q.Status == "Active");
            
            if (existingActivePlan != null)
            {
                throw new ArgumentException("Bạn đã có kế hoạch cai thuốc đang hoạt động. Vui lòng reset kế hoạch cũ trước khi tạo kế hoạch mới.");
            }

            // Tính toán chi phí hàng ngày
            var dailyCost = (createDto.CigarettesPerDay * createDto.PricePerPack) / createDto.CigarettesPerPack;

            // Tạo quit plan
            var quitPlan = new QuitPlan
            {
                UserID = userId,
                CigarettesPerDay = createDto.CigarettesPerDay,
                CigarettesPerPack = createDto.CigarettesPerPack,
                PricePerPack = createDto.PricePerPack,
                YearsSmoked = createDto.YearsSmoked,
                DailyCost = dailyCost,
                QuitDate = createDto.QuitDate,
                Reasons = createDto.Reasons != null ? JsonSerializer.Serialize(createDto.Reasons) : null,
                OtherReason = createDto.OtherReason,
                Difficulty = createDto.Difficulty,
                SupportNeeded = createDto.SupportNeeded != null ? JsonSerializer.Serialize(createDto.SupportNeeded) : null,
                Triggers = createDto.Triggers != null ? JsonSerializer.Serialize(createDto.Triggers) : null,
                OtherTrigger = createDto.OtherTrigger,
                Motivation = createDto.Motivation,
                StartDate = DateTime.Now,
                Status = "Active",
                Source = "self"
            };

            // Tính toán ngày kết thúc dự kiến (3 tháng từ ngày bắt đầu)
            quitPlan.ExpectedEndDate = quitPlan.StartDate.AddMonths(3);

            _context.QuitPlans.Add(quitPlan);
            await _context.SaveChangesAsync();

            // Tạo các stages mặc định
            await CreateDefaultStagesAsync(quitPlan);

            return await GetQuitPlanAsync(quitPlan.QuitPlanID);
        }

        public async Task<QuitPlanDto> GetQuitPlanAsync(int quitPlanId)
        {
            var quitPlan = await _context.QuitPlans
                .Include(q => q.User)
                .Include(q => q.Doctor)
                .Include(q => q.QuitPlanStages)
                .Include(q => q.QuitProgresses)
                .FirstOrDefaultAsync(q => q.QuitPlanID == quitPlanId);

            if (quitPlan == null)
                throw new ArgumentException("Không tìm thấy kế hoạch cai thuốc");

            return MapToDto(quitPlan);
        }

        public async Task<List<QuitPlanDto>> GetUserQuitPlansAsync(int userId)
        {
            var quitPlans = await _context.QuitPlans
                .Include(q => q.User)
                .Include(q => q.Doctor)
                .Include(q => q.QuitPlanStages)
                .Include(q => q.QuitProgresses)
                .Where(q => q.UserID == userId)
                .OrderByDescending(q => q.CreatedAt)
                .ToListAsync();

            return quitPlans.Select(MapToDto).ToList();
        }

        public async Task<QuitPlanDto?> GetActiveQuitPlanAsync(int userId)
        {
            var quitPlan = await _context.QuitPlans
                .Include(q => q.User)
                .Include(q => q.Doctor)
                .Include(q => q.QuitPlanStages)
                .Include(q => q.QuitProgresses)
                .FirstOrDefaultAsync(q => q.UserID == userId && q.Status == "Active");

            if (quitPlan == null)
                return null;

            return MapToDto(quitPlan);
        }

        private async Task CreateDefaultStagesAsync(QuitPlan quitPlan)
        {
            var stages = new List<QuitPlanStage>
            {
                new QuitPlanStage
                {
                    QuitPlanID = quitPlan.QuitPlanID,
                    StageName = "Chuẩn bị (Ngày 1-7)",
                    Description = "Chuẩn bị tinh thần và loại bỏ các vật dụng liên quan đến thuốc lá",
                    TargetDate = quitPlan.StartDate.AddDays(7),
                    TargetCigarettesPerDay = quitPlan.CigarettesPerDay
                },
                new QuitPlanStage
                {
                    QuitPlanID = quitPlan.QuitPlanID,
                    StageName = "Giảm dần (Tuần 2-4)",
                    Description = "Giảm dần số lượng thuốc lá hút mỗi ngày",
                    TargetDate = quitPlan.StartDate.AddDays(28),
                    TargetCigarettesPerDay = quitPlan.CigarettesPerDay / 2
                },
                new QuitPlanStage
                {
                    QuitPlanID = quitPlan.QuitPlanID,
                    StageName = "Giai đoạn khó khăn (Tháng 2)",
                    Description = "Vượt qua giai đoạn khó khăn nhất, tìm kiếm hỗ trợ khi cần",
                    TargetDate = quitPlan.StartDate.AddMonths(2),
                    TargetCigarettesPerDay = 0
                },
                new QuitPlanStage
                {
                    QuitPlanID = quitPlan.QuitPlanID,
                    StageName = "Ổn định (Tháng 3)",
                    Description = "Duy trì không hút thuốc và xây dựng thói quen mới",
                    TargetDate = quitPlan.StartDate.AddMonths(3),
                    TargetCigarettesPerDay = 0
                }
            };

            _context.QuitPlanStages.AddRange(stages);
            await _context.SaveChangesAsync();
        }

        public async Task<QuitProgressDto> AddSmokeFreeDay(int userId)
        {
            // Lấy quit plan đang hoạt động
            var quitPlan = await _context.QuitPlans
                .FirstOrDefaultAsync(q => q.UserID == userId && q.Status == "Active");

            if (quitPlan == null)
                throw new ArgumentException("Không tìm thấy kế hoạch cai thuốc đang hoạt động");

            // Kiểm tra xem hôm nay đã có progress chưa
            var today = DateTime.Today;
            var existingProgress = await _context.QuitProgresses
                .FirstOrDefaultAsync(p => p.QuitPlanID == quitPlan.QuitPlanID && p.Date.Date == today);

            if (existingProgress != null)
                throw new ArgumentException("Hôm nay bạn đã ghi nhận tiến trình rồi");

            // Tính toán số ngày smoke-free hiện tại
            var currentSmokeFreeCount = await _context.QuitProgresses
                .CountAsync(p => p.QuitPlanID == quitPlan.QuitPlanID && !p.SmokedToday);

            // Tạo progress entry mới
            var progress = new QuitProgress
            {
                QuitPlanID = quitPlan.QuitPlanID,
                UserID = userId,
                Date = today,
                SmokedToday = false,
                CigarettesSmoked = 0,
                MoneySaved = quitPlan.DailyCost,
                DaysSmokeFree = currentSmokeFreeCount + 1,
                CreatedAt = DateTime.Now
            };

            _context.QuitProgresses.Add(progress);
            await _context.SaveChangesAsync();

            return new QuitProgressDto
            {
                ProgressID = progress.ProgressID,
                Date = progress.Date,
                SmokedToday = progress.SmokedToday,
                CigarettesSmoked = progress.CigarettesSmoked,
                MoneySaved = progress.MoneySaved,
                DaysSmokeFree = progress.DaysSmokeFree,
                HealthNote = progress.HealthNote,
                MoodRating = progress.MoodRating,
                CravingLevel = progress.CravingLevel,
                Notes = progress.Notes
            };
        }

        public async Task<object> ResetQuitPlanAsync(int userId)
        {
            // Lấy quit plan đang hoạt động
            var quitPlan = await _context.QuitPlans
                .Include(q => q.QuitPlanStages)
                .Include(q => q.QuitProgresses)
                .FirstOrDefaultAsync(q => q.UserID == userId && q.Status == "Active");

            if (quitPlan == null)
                throw new ArgumentException("Không tìm thấy kế hoạch cai thuốc đang hoạt động để reset");

            // Đặt trạng thái kế hoạch hiện tại thành "Reset"
            quitPlan.Status = "Reset";
            quitPlan.UpdatedAt = DateTime.Now;

            // Xóa tất cả progress entries
            if (quitPlan.QuitProgresses != null && quitPlan.QuitProgresses.Any())
            {
                _context.QuitProgresses.RemoveRange(quitPlan.QuitProgresses);
            }

            // Xóa tất cả stages
            if (quitPlan.QuitPlanStages != null && quitPlan.QuitPlanStages.Any())
            {
                _context.QuitPlanStages.RemoveRange(quitPlan.QuitPlanStages);
            }

            await _context.SaveChangesAsync();

            return new
            {
                message = "Đã reset kế hoạch cai thuốc thành công",
                resetDate = DateTime.Now,
                previousPlanId = quitPlan.QuitPlanID
            };
        }

        private QuitPlanDto MapToDto(QuitPlan quitPlan)
        {
            var totalDays = (DateTime.Now - quitPlan.StartDate).Days;
            var progresses = quitPlan.QuitProgresses?.OrderByDescending(p => p.Date).ToList() ?? new List<QuitProgress>();
            var daysSmokeFree = progresses.Count(p => !p.SmokedToday);
            var totalMoneySaved = progresses.Sum(p => p.MoneySaved);
            var completionPercentage = quitPlan.ExpectedEndDate.HasValue ? 
                Math.Max(0, Math.Min(100, (totalDays / (quitPlan.ExpectedEndDate.Value - quitPlan.StartDate).TotalDays) * 100)) : 0;

            return new QuitPlanDto
            {
                QuitPlanID = quitPlan.QuitPlanID,
                UserID = quitPlan.UserID,
                DoctorID = quitPlan.DoctorID,
                DoctorName = quitPlan.Doctor?.FullName,
                CigarettesPerDay = quitPlan.CigarettesPerDay,
                CigarettesPerPack = quitPlan.CigarettesPerPack,
                PricePerPack = quitPlan.PricePerPack,
                YearsSmoked = quitPlan.YearsSmoked,
                DailyCost = quitPlan.DailyCost,
                QuitDate = quitPlan.QuitDate,
                Reasons = !string.IsNullOrEmpty(quitPlan.Reasons) ? JsonSerializer.Deserialize<List<string>>(quitPlan.Reasons) : null,
                OtherReason = quitPlan.OtherReason,
                Difficulty = quitPlan.Difficulty,
                SupportNeeded = !string.IsNullOrEmpty(quitPlan.SupportNeeded) ? JsonSerializer.Deserialize<List<string>>(quitPlan.SupportNeeded) : null,
                Triggers = !string.IsNullOrEmpty(quitPlan.Triggers) ? JsonSerializer.Deserialize<List<string>>(quitPlan.Triggers) : null,
                OtherTrigger = quitPlan.OtherTrigger,
                StartDate = quitPlan.StartDate,
                ExpectedEndDate = quitPlan.ExpectedEndDate,
                Status = quitPlan.Status,
                IsApprovedByDoctor = quitPlan.IsApprovedByDoctor,
                DoctorNotes = quitPlan.DoctorNotes,
                Motivation = quitPlan.Motivation,
                Source = quitPlan.Source,
                CreatedAt = quitPlan.CreatedAt,
                UpdatedAt = quitPlan.UpdatedAt,
                TotalDays = totalDays,
                DaysSmokeFree = daysSmokeFree,
                TotalMoneySaved = totalMoneySaved,
                CompletionPercentage = completionPercentage,
                Stages = quitPlan.QuitPlanStages?.Select(s => new QuitPlanStageDto
                {
                    StageID = s.StageID,
                    StageName = s.StageName,
                    Description = s.Description,
                    TargetDate = s.TargetDate,
                    IsCompleted = s.IsCompleted,
                    CompletedDate = s.CompletedDate,
                    Notes = s.Notes,
                    TargetCigarettesPerDay = s.TargetCigarettesPerDay
                }).ToList(),
                RecentProgress = progresses.Take(7).Select(p => new QuitProgressDto
                {
                    ProgressID = p.ProgressID,
                    Date = p.Date,
                    SmokedToday = p.SmokedToday,
                    CigarettesSmoked = p.CigarettesSmoked,
                    MoneySaved = p.MoneySaved,
                    DaysSmokeFree = p.DaysSmokeFree,
                    HealthNote = p.HealthNote,
                    MoodRating = p.MoodRating,
                    CravingLevel = p.CravingLevel,
                    Notes = p.Notes,
                    SupportUsed = !string.IsNullOrEmpty(p.SupportUsed) ? JsonSerializer.Deserialize<List<string>>(p.SupportUsed) : null,
                    TriggersEncountered = !string.IsNullOrEmpty(p.TriggersEncountered) ? JsonSerializer.Deserialize<List<string>>(p.TriggersEncountered) : null
                }).ToList()
            };
        }
    }
} 
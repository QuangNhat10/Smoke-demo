namespace BreathingFree.Models
{
    public class QuitPlanDto
    {
        public int QuitPlanID { get; set; }
        public int UserID { get; set; }
        public int? DoctorID { get; set; }
        public string? DoctorName { get; set; }
        
        // Thông tin cơ bản về thói quen hút thuốc
        public int CigarettesPerDay { get; set; }
        public int CigarettesPerPack { get; set; }
        public decimal PricePerPack { get; set; }
        public int YearsSmoked { get; set; }
        public decimal DailyCost { get; set; }
        
        // Thông tin kế hoạch cai thuốc
        public DateTime? QuitDate { get; set; }
        public List<string>? Reasons { get; set; }
        public string? OtherReason { get; set; }
        public string Difficulty { get; set; } = "medium";
        public List<string>? SupportNeeded { get; set; }
        public List<string>? Triggers { get; set; }
        public string? OtherTrigger { get; set; }
        
        // Thông tin trạng thái
        public DateTime StartDate { get; set; }
        public DateTime? ExpectedEndDate { get; set; }
        public string Status { get; set; } = "Active";
        public bool IsApprovedByDoctor { get; set; } = false;
        public string? DoctorNotes { get; set; }
        public string? Motivation { get; set; }
        public string Source { get; set; } = "self";
        
        public DateTime CreatedAt { get; set; }
        public DateTime? UpdatedAt { get; set; }
        
        // Thống kê
        public int TotalDays { get; set; }
        public int DaysSmokeFree { get; set; }
        public decimal TotalMoneySaved { get; set; }
        public double CompletionPercentage { get; set; }
        
        // Stages và Progress
        public List<QuitPlanStageDto>? Stages { get; set; }
        public List<QuitProgressDto>? RecentProgress { get; set; }
    }

    public class QuitPlanStageDto
    {
        public int StageID { get; set; }
        public string StageName { get; set; } = string.Empty;
        public string? Description { get; set; }
        public DateTime TargetDate { get; set; }
        public bool IsCompleted { get; set; }
        public DateTime? CompletedDate { get; set; }
        public string? Notes { get; set; }
        public int? TargetCigarettesPerDay { get; set; }
    }

    public class QuitProgressDto
    {
        public int ProgressID { get; set; }
        public DateTime Date { get; set; }
        public bool SmokedToday { get; set; }
        public int CigarettesSmoked { get; set; }
        public decimal MoneySaved { get; set; }
        public int DaysSmokeFree { get; set; }
        public string? HealthNote { get; set; }
        public string? MoodRating { get; set; }
        public string? CravingLevel { get; set; }
        public string? Notes { get; set; }
        public List<string>? SupportUsed { get; set; }
        public List<string>? TriggersEncountered { get; set; }
    }
} 
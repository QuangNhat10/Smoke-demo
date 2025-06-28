using System.ComponentModel.DataAnnotations;

namespace BreathingFree.Models
{
    public class QuitPlan
    {
        [Key]
        public int QuitPlanID { get; set; }
        public int UserID { get; set; }
        public int? DoctorID { get; set; }
        
        // Thông tin cơ bản về thói quen hút thuốc
        public int CigarettesPerDay { get; set; }
        public int CigarettesPerPack { get; set; }
        public decimal PricePerPack { get; set; }
        public int YearsSmoked { get; set; }
        public decimal DailyCost { get; set; }
        
        // Thông tin kế hoạch cai thuốc
        public DateTime? QuitDate { get; set; }
        public string? Reasons { get; set; } // JSON string array
        public string? OtherReason { get; set; }
        public string Difficulty { get; set; } = "medium"; // easy, medium, hard
        public string? SupportNeeded { get; set; } // JSON string array
        public string? Triggers { get; set; } // JSON string array
        public string? OtherTrigger { get; set; }
        
        // Thông tin trạng thái
        public DateTime StartDate { get; set; }
        public DateTime? ExpectedEndDate { get; set; }
        public string Status { get; set; } = "Active"; // Active, Completed, Paused, Cancelled
        public bool IsApprovedByDoctor { get; set; } = false;
        public string? DoctorNotes { get; set; }
        public string? Motivation { get; set; }
        public string Source { get; set; } = "self"; // self, doctor-recommended
        
        public DateTime CreatedAt { get; set; } = DateTime.Now;
        public DateTime? UpdatedAt { get; set; }
        
        // Navigation properties
        public virtual User? User { get; set; }
        public virtual User? Doctor { get; set; }
        public virtual ICollection<QuitPlanStage>? QuitPlanStages { get; set; }
        public virtual ICollection<QuitProgress>? QuitProgresses { get; set; }
    }
} 
using System.ComponentModel.DataAnnotations;

namespace BreathingFree.Models
{
    public class QuitPlanStage
    {
        [Key]
        public int StageID { get; set; }
        public int QuitPlanID { get; set; }
        
        public string StageName { get; set; } = string.Empty;
        public string? Description { get; set; }
        public DateTime TargetDate { get; set; }
        public bool IsCompleted { get; set; } = false;
        public DateTime? CompletedDate { get; set; }
        public string? Notes { get; set; }
        
        // Mức độ giảm cigarettes cho stage này (nếu áp dụng)
        public int? TargetCigarettesPerDay { get; set; }
        
        public DateTime CreatedAt { get; set; } = DateTime.Now;
        
        // Navigation property
        public virtual QuitPlan? QuitPlan { get; set; }
    }
} 
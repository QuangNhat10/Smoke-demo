using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace BreathingFree.Models
{
    [Table("QuitPlans", Schema = "dbo")]
    public class QuitPlan
    {
        public QuitPlan()
        {
            // Initialize required string properties
            QuitReasons = string.Empty;
            SocialTriggers = "[]";
            RoutineTriggers = "[]";
            EmotionalTriggers = "[]";
            WithdrawalTriggers = "[]";
            CopingStrategies = string.Empty;
            SupportMethods = string.Empty;
            ExpertHelpMethods = string.Empty;
            DoctorNotes = string.Empty;
            CreatedAt = DateTime.Now;
        }

        [Key]
        public int ID { get; set; }

        [Required]
        public int UserID { get; set; }
        
        [ForeignKey("UserID")]
        public User? User { get; set; }

        [Required]
        public DateTime QuitDate { get; set; }

        // Smoking habits
        public int CigarettesPerDay { get; set; }
        public decimal CostPerPack { get; set; }

        // Reasons for quitting (stored as comma-separated string)
        [Required]
        public string QuitReasons { get; set; }

        // Triggers (stored as JSON string)
        [Required]
        public string SocialTriggers { get; set; }
        [Required]
        public string RoutineTriggers { get; set; }
        [Required]
        public string EmotionalTriggers { get; set; }
        [Required]
        public string WithdrawalTriggers { get; set; }

        // Coping strategies (stored as comma-separated string)
        [Required]
        public string CopingStrategies { get; set; }

        // Support methods (stored as comma-separated string)
        [Required]
        public string SupportMethods { get; set; }

        // Expert help methods (stored as comma-separated string)
        [Required]
        public string ExpertHelpMethods { get; set; }

        // Plan status
        public bool IsApproved { get; set; }
        public string DoctorNotes { get; set; }
        public int? DoctorID { get; set; }

        [ForeignKey("DoctorID")]
        public User? Doctor { get; set; }

        public DateTime CreatedAt { get; set; }
        public DateTime? UpdatedAt { get; set; }
    }
} 
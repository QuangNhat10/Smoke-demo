using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace BreathingFree.Models
{
    public class Feedback
    {
        [Key]
        public int FeedbackID { get; set; }

        [Required]
        public int UserID { get; set; }

        [Required]
        public int DoctorID { get; set; }

        [Range(1, 5)]
        public int Rating { get; set; }

        [MaxLength(1000)]
        public string? FeedbackText { get; set; }

        public DateTime SubmittedAt { get; set; } = DateTime.Now;

        // Navigation properties
        [ForeignKey("UserID")]
        public virtual User? User { get; set; }

        [ForeignKey("DoctorID")]
        public virtual User? Doctor { get; set; }
    }
}

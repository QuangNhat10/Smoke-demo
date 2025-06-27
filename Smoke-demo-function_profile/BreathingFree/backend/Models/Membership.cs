using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace BreathingFree.Models
{
    public class Membership
    {
        [Key]
        public int MembershipID { get; set; }

        [Required]
        public int UserID { get; set; }

        [Required]
        [StringLength(50)]
        public string PackageName { get; set; } = string.Empty;

        [Required]
        [Range(0, double.MaxValue)]
        [Column(TypeName = "decimal(18,2)")]
        public decimal Price { get; set; }

        [Required]
        [Range(1, int.MaxValue)]
        public int DurationDays { get; set; }

        [Required]
        public DateTime StartDate { get; set; }

        [Required]
        public DateTime EndDate { get; set; }

        [Required]
        [StringLength(50)]
        public string PaymentMethod { get; set; } = string.Empty;

        [Required]
        public DateTime PaymentDate { get; set; }

        [Required]
        public bool IsActive { get; set; }

        // Navigation property
        [ForeignKey("UserID")]
        public virtual User? User { get; set; }
    }
} 
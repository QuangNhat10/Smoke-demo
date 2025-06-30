using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace BreathingFree.Models
{
    [Table("Users", Schema = "dbo")]
    public class User
    {
        [Key]
        public int UserID { get; set; }

        public int RoleID { get; set; }

        [Required]
        [StringLength(100)]
        public string Email { get; set; } = string.Empty;

        [Required]
        public string PasswordHash { get; set; } = string.Empty;

        [StringLength(100)]
        public string FullName { get; set; } = string.Empty;

        [StringLength(10)]
        public string? Gender { get; set; }

        public DateTime? DOB { get; set; }

        public DateTime CreatedAt { get; set; }

        [StringLength(20)]
        public string Status { get; set; } = "Active";

        [StringLength(500)]
        public string? Description { get; set; }

        [StringLength(15)]
        public string? Phone { get; set; }

        [StringLength(200)]
        public string? Address { get; set; }

        [StringLength(500)]
        public string? Avatar { get; set; }

        [StringLength(200)]
        public string? Specialty { get; set; }

        [StringLength(200)]
        public string? Position { get; set; }

        [StringLength(500)]
        public string? ShortBio { get; set; }
    }
}

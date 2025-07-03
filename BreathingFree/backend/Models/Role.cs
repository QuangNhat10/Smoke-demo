using System.ComponentModel.DataAnnotations;

namespace BreathingFree.Models
{
    public class Role
    {
        [Key]
        public int RoleID { get; set; }
        
        [Required]
        [MaxLength(50)]
        public string RoleName { get; set; }
        
        [MaxLength(200)]
        public string Description { get; set; }
        
        public DateTime CreatedAt { get; set; } = DateTime.Now;
        
        public bool IsActive { get; set; } = true;
    }
} 
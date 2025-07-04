using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace BreathingFree.Models
{
    public class PasswordResetToken
    {
        [Key]
        public int Id { get; set; }
        public int UserId { get; set; }
        public string Token { get; set; }
        public DateTime ExpiresAt { get; set; }

        [ForeignKey(nameof(UserId))]
        public User User { get; set; }
    }
} 
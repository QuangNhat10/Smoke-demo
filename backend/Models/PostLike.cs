namespace BreathingFree.Models
{
    public class PostLike
    {
        public int PostLikeID { get; set; }
        public int PostID { get; set; }
        public int UserID { get; set; }
        public DateTime CreatedAt { get; set; } = DateTime.Now;
        
        // Navigation properties
        public CommunityPost? Post { get; set; }
        public User? User { get; set; }
    }
} 
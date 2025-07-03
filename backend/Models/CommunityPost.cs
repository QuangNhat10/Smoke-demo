namespace BreathingFree.Models
{
    public class CommunityPost
    {
        public int PostID { get; set; }
        public int UserID { get; set; }
        public string Title { get; set; } = string.Empty;
        public string Content { get; set; } = string.Empty;
        public string PostType { get; set; } = string.Empty; // "Blog", "FAQ", "Comment"
        public int? ParentPostID { get; set; }
        public DateTime CreatedAt { get; set; } = DateTime.Now;
        public DateTime? UpdatedAt { get; set; }
        public string Category { get; set; } = string.Empty; // "Kinh nghiệm", "Sức khỏe", "Phương pháp", etc.
        public string Tags { get; set; } = string.Empty; // JSON string để lưu tags
        public int Likes { get; set; } = 0;
        public int Views { get; set; } = 0;
        public bool IsApproved { get; set; } = false; // Duyệt bài cho FAQ
        public bool IsFeatured { get; set; } = false; // Bài viết nổi bật
        
        // Navigation properties
        public User? User { get; set; }
        public CommunityPost? ParentPost { get; set; }
        public ICollection<CommunityPost> Comments { get; set; } = new List<CommunityPost>();
        public ICollection<PostLike> PostLikes { get; set; } = new List<PostLike>();
    }
} 
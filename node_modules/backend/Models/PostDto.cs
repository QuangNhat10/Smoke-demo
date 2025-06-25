namespace BreathingFree.Models
{
    public class CreatePostDto
    {
        public string Title { get; set; } = string.Empty;
        public string Content { get; set; } = string.Empty;
        public string PostType { get; set; } = string.Empty; // "Blog", "FAQ"
        public string Category { get; set; } = string.Empty;
        public List<string> Tags { get; set; } = new List<string>();
    }

    public class UpdatePostDto
    {
        public string Title { get; set; } = string.Empty;
        public string Content { get; set; } = string.Empty;
        public string Category { get; set; } = string.Empty;
        public List<string> Tags { get; set; } = new List<string>();
    }

    public class PostResponseDto
    {
        public int PostID { get; set; }
        public int UserID { get; set; }
        public string UserName { get; set; } = string.Empty;
        public string UserAvatar { get; set; } = string.Empty;
        public string Title { get; set; } = string.Empty;
        public string Content { get; set; } = string.Empty;
        public string PostType { get; set; } = string.Empty;
        public string Category { get; set; } = string.Empty;
        public List<string> Tags { get; set; } = new List<string>();
        public int Likes { get; set; }
        public int Views { get; set; }
        public bool IsLiked { get; set; }
        public DateTime CreatedAt { get; set; }
        public DateTime? UpdatedAt { get; set; }
        public bool IsFeatured { get; set; }
        public List<CommentResponseDto> Comments { get; set; } = new List<CommentResponseDto>();
    }

    public class CommentResponseDto
    {
        public int PostID { get; set; }
        public int UserID { get; set; }
        public string UserName { get; set; } = string.Empty;
        public string UserAvatar { get; set; } = string.Empty;
        public string Content { get; set; } = string.Empty;
        public DateTime CreatedAt { get; set; }
    }

    public class CreateCommentDto
    {
        public int ParentPostID { get; set; }
        public string Content { get; set; } = string.Empty;
    }
} 
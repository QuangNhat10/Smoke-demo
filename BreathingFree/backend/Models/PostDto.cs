namespace BreathingFree.Models
{
    /// <summary>
    /// DTO cho việc tạo bài viết mới
    /// </summary>
    public class CreatePostDto
    {
        /// <summary>
        /// Tiêu đề bài viết
        /// </summary>
        public string Title { get; set; } = string.Empty;
        
        /// <summary>
        /// Nội dung bài viết
        /// </summary>
        public string Content { get; set; } = string.Empty;
        
        /// <summary>
        /// Loại bài viết: "Blog" hoặc "FAQ"
        /// </summary>
        public string PostType { get; set; } = string.Empty; // "Blog", "FAQ"
        
        /// <summary>
        /// Danh mục bài viết
        /// </summary>
        public string Category { get; set; } = string.Empty;
        
        /// <summary>
        /// Danh sách thẻ tag của bài viết
        /// </summary>
        public List<string> Tags { get; set; } = new List<string>();
    }

    /// <summary>
    /// DTO cho việc cập nhật bài viết
    /// </summary>
    public class UpdatePostDto
    {
        /// <summary>
        /// Tiêu đề bài viết cần cập nhật
        /// </summary>
        public string Title { get; set; } = string.Empty;
        
        /// <summary>
        /// Nội dung bài viết cần cập nhật
        /// </summary>
        public string Content { get; set; } = string.Empty;
        
        /// <summary>
        /// Danh mục bài viết cần cập nhật
        /// </summary>
        public string Category { get; set; } = string.Empty;
        
        /// <summary>
        /// Danh sách thẻ tag cần cập nhật
        /// </summary>
        public List<string> Tags { get; set; } = new List<string>();
    }

    /// <summary>
    /// DTO cho response trả về thông tin bài viết
    /// </summary>
    public class PostResponseDto
    {
        /// <summary>
        /// ID của bài viết
        /// </summary>
        public int PostID { get; set; }
        
        /// <summary>
        /// ID của người dùng tạo bài viết
        /// </summary>
        public int UserID { get; set; }
        
        /// <summary>
        /// Tên người dùng tạo bài viết
        /// </summary>
        public string UserName { get; set; } = string.Empty;
        
        /// <summary>
        /// Avatar của người dùng tạo bài viết
        /// </summary>
        public string UserAvatar { get; set; } = string.Empty;
        
        /// <summary>
        /// Tiêu đề bài viết
        /// </summary>
        public string Title { get; set; } = string.Empty;
        
        /// <summary>
        /// Nội dung bài viết
        /// </summary>
        public string Content { get; set; } = string.Empty;
        
        /// <summary>
        /// Loại bài viết
        /// </summary>
        public string PostType { get; set; } = string.Empty;
        
        /// <summary>
        /// Danh mục bài viết
        /// </summary>
        public string Category { get; set; } = string.Empty;
        
        /// <summary>
        /// Danh sách thẻ tag
        /// </summary>
        public List<string> Tags { get; set; } = new List<string>();
        
        /// <summary>
        /// Số lượt thích
        /// </summary>
        public int Likes { get; set; }
        
        /// <summary>
        /// Số lượt xem
        /// </summary>
        public int Views { get; set; }
        
        /// <summary>
        /// Người dùng hiện tại đã thích bài viết này chưa
        /// </summary>
        public bool IsLiked { get; set; }
        
        /// <summary>
        /// Thời gian tạo bài viết
        /// </summary>
        public DateTime CreatedAt { get; set; }
        
        /// <summary>
        /// Thời gian cập nhật bài viết (có thể null)
        /// </summary>
        public DateTime? UpdatedAt { get; set; }
        
        /// <summary>
        /// Bài viết có được đánh dấu nổi bật không
        /// </summary>
        public bool IsFeatured { get; set; }
        
        /// <summary>
        /// Danh sách bình luận của bài viết
        /// </summary>
        public List<CommentResponseDto> Comments { get; set; } = new List<CommentResponseDto>();
    }

    /// <summary>
    /// DTO cho response trả về thông tin bình luận
    /// </summary>
    public class CommentResponseDto
    {
        /// <summary>
        /// ID của bài viết được bình luận
        /// </summary>
        public int PostID { get; set; }
        
        /// <summary>
        /// ID của người dùng bình luận
        /// </summary>
        public int UserID { get; set; }
        
        /// <summary>
        /// Tên người dùng bình luận
        /// </summary>
        public string UserName { get; set; } = string.Empty;
        
        /// <summary>
        /// Avatar của người dùng bình luận
        /// </summary>
        public string UserAvatar { get; set; } = string.Empty;
        
        /// <summary>
        /// Nội dung bình luận
        /// </summary>
        public string Content { get; set; } = string.Empty;
        
        /// <summary>
        /// Thời gian tạo bình luận
        /// </summary>
        public DateTime CreatedAt { get; set; }
    }

    /// <summary>
    /// DTO cho việc tạo bình luận mới
    /// </summary>
    public class CreateCommentDto
    {
        /// <summary>
        /// ID của bài viết cha (bài viết được bình luận)
        /// </summary>
        public int ParentPostID { get; set; }
        
        /// <summary>
        /// Nội dung bình luận
        /// </summary>
        public string Content { get; set; } = string.Empty;
    }
} 
using BreathingFree.Services;
using BreathingFree.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using System.Security.Claims;

namespace BreathingFree.Controllers
{
    /// <summary>
    /// Controller để quản lý các bài viết (blog/FAQ) và bình luận
    /// </summary>
    [ApiController]
    [Route("api/[controller]")]
    public class PostController : ControllerBase
    {
        private readonly PostService _postService;

        /// <summary>
        /// Khởi tạo PostController với dependency injection
        /// </summary>
        /// <param name="postService">Service xử lý logic nghiệp vụ cho bài viết</param>
        public PostController(PostService postService)
        {
            _postService = postService;
        }

        /// <summary>
        /// Lấy danh sách bài viết với phân trang và bộ lọc
        /// </summary>
        /// <param name="postType">Loại bài viết (Blog/FAQ)</param>
        /// <param name="category">Danh mục bài viết (tùy chọn)</param>
        /// <param name="search">Từ khóa tìm kiếm (tùy chọn)</param>
        /// <param name="page">Số trang (mặc định: 1)</param>
        /// <param name="pageSize">Số bài viết mỗi trang (mặc định: 10)</param>
        /// <returns>Danh sách bài viết theo điều kiện lọc</returns>
        [HttpGet]
        [Produces("application/json")]
        public async Task<IActionResult> GetPosts(
            [FromQuery] string postType = "Blog",
            [FromQuery] string? category = null,
            [FromQuery] string? search = null,
            [FromQuery] int page = 1,
            [FromQuery] int pageSize = 10)
        {
            try
            {
                var userId = GetCurrentUserId();
                var posts = await _postService.GetPostsAsync(postType, category, search, page, pageSize, userId);
                return Ok(posts);
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = "Lỗi khi lấy danh sách bài viết", error = ex.Message });
            }
        }

        /// <summary>
        /// Lấy chi tiết một bài viết theo ID
        /// </summary>
        /// <param name="id">ID của bài viết</param>
        /// <returns>Thông tin chi tiết bài viết bao gồm bình luận</returns>
        [HttpGet("{id}")]
        public async Task<IActionResult> GetPost(int id)
        {
            try
            {
                var userId = GetCurrentUserId();
                var post = await _postService.GetPostByIdAsync(id, userId);
                
                if (post == null)
                    return NotFound(new { message = "Không tìm thấy bài viết" });

                return Ok(post);
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = "Lỗi khi lấy bài viết", error = ex.Message });
            }
        }

        /// <summary>
        /// Tạo bài viết mới (yêu cầu đăng nhập)
        /// </summary>
        /// <param name="createPostDto">Dữ liệu tạo bài viết mới</param>
        /// <returns>Thông tin bài viết vừa tạo</returns>
        [HttpPost]
        [Authorize]
        [Consumes("application/json")]
        [Produces("application/json")]
        public async Task<IActionResult> CreatePost([FromBody] CreatePostDto createPostDto)
        {
            try
            {
                var userId = GetCurrentUserId();
                if (!userId.HasValue)
                    return Unauthorized(new { message = "Vui lòng đăng nhập để tạo bài viết" });

                var post = await _postService.CreatePostAsync(userId.Value, createPostDto);
                return Ok(post);
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = "Lỗi khi tạo bài viết", error = ex.Message });
            }
        }

        /// <summary>
        /// Cập nhật bài viết (chỉ tác giả mới có quyền)
        /// </summary>
        /// <param name="id">ID của bài viết cần cập nhật</param>
        /// <param name="updatePostDto">Dữ liệu cập nhật bài viết</param>
        /// <returns>Kết quả cập nhật</returns>
        [HttpPut("{id}")]
        [Authorize]
        public async Task<IActionResult> UpdatePost(int id, [FromBody] UpdatePostDto updatePostDto)
        {
            try
            {
                var userId = GetCurrentUserId();
                if (!userId.HasValue)
                    return Unauthorized(new { message = "Vui lòng đăng nhập để cập nhật bài viết" });

                var success = await _postService.UpdatePostAsync(id, userId.Value, updatePostDto);
                
                if (!success)
                    return NotFound(new { message = "Không tìm thấy bài viết hoặc bạn không có quyền chỉnh sửa" });

                return Ok(new { message = "Cập nhật bài viết thành công" });
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = "Lỗi khi cập nhật bài viết", error = ex.Message });
            }
        }

        /// <summary>
        /// Xóa bài viết (chỉ tác giả mới có quyền)
        /// </summary>
        /// <param name="id">ID của bài viết cần xóa</param>
        /// <returns>Kết quả xóa bài viết</returns>
        [HttpDelete("{id}")]
        [Authorize]
        public async Task<IActionResult> DeletePost(int id)
        {
            try
            {
                var userId = GetCurrentUserId();
                if (!userId.HasValue)
                    return Unauthorized(new { message = "Vui lòng đăng nhập để xóa bài viết" });

                var success = await _postService.DeletePostAsync(id, userId.Value);
                
                if (!success)
                    return NotFound(new { message = "Không tìm thấy bài viết hoặc bạn không có quyền xóa" });

                return Ok(new { message = "Xóa bài viết thành công" });
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = "Lỗi khi xóa bài viết", error = ex.Message });
            }
        }

        /// <summary>
        /// Thích/bỏ thích bài viết (yêu cầu đăng nhập)
        /// </summary>
        /// <param name="id">ID của bài viết</param>
        /// <returns>Trạng thái thích/bỏ thích</returns>
        [HttpPost("{id}/like")]
        [Authorize]
        public async Task<IActionResult> LikePost(int id)
        {
            try
            {
                var userId = GetCurrentUserId();
                if (!userId.HasValue)
                    return Unauthorized(new { message = "Vui lòng đăng nhập để thích bài viết" });

                var isLiked = await _postService.LikePostAsync(id, userId.Value);
                return Ok(new { 
                    message = isLiked ? "Đã thích bài viết" : "Đã bỏ thích bài viết", 
                    isLiked = isLiked 
                });
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = "Lỗi khi thích bài viết", error = ex.Message });
            }
        }

        /// <summary>
        /// Thêm bình luận cho bài viết (yêu cầu đăng nhập)
        /// </summary>
        /// <param name="id">ID của bài viết được bình luận</param>
        /// <param name="createCommentDto">Dữ liệu tạo bình luận</param>
        /// <returns>Thông tin bình luận vừa tạo</returns>
        [HttpPost("{id}/comments")]
        [Authorize]
        public async Task<IActionResult> AddComment(int id, [FromBody] CreateCommentDto createCommentDto)
        {
            try
            {
                var userId = GetCurrentUserId();
                if (!userId.HasValue)
                    return Unauthorized(new { message = "Vui lòng đăng nhập để bình luận" });

                createCommentDto.ParentPostID = id;
                var comment = await _postService.AddCommentAsync(userId.Value, createCommentDto);
                return Ok(comment);
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = "Lỗi khi thêm bình luận", error = ex.Message });
            }
        }

        /// <summary>
        /// Tăng số lượt xem cho bài viết
        /// </summary>
        /// <param name="id">ID của bài viết</param>
        /// <returns>Kết quả cập nhật lượt xem</returns>
        [HttpPost("{id}/view")]
        public async Task<IActionResult> IncrementView(int id)
        {
            try
            {
                var success = await _postService.IncrementViewAsync(id);
                if (!success)
                    return NotFound(new { message = "Không tìm thấy bài viết" });

                return Ok(new { message = "Đã cập nhật lượt xem" });
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = "Lỗi khi cập nhật lượt xem", error = ex.Message });
            }
        }

        /// <summary>
        /// Lấy danh sách các danh mục bài viết
        /// </summary>
        /// <param name="postType">Loại bài viết (Blog/FAQ)</param>
        /// <returns>Danh sách các danh mục có sẵn</returns>
        [HttpGet("categories")]
        public async Task<IActionResult> GetCategories([FromQuery] string postType = "Blog")
        {
            try
            {
                var categories = await _postService.GetCategoriesAsync(postType);
                return Ok(categories);
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = "Lỗi khi lấy danh mục", error = ex.Message });
            }
        }

        /// <summary>
        /// Lấy ID của người dùng hiện tại từ JWT token
        /// </summary>
        /// <returns>ID người dùng hoặc null nếu chưa đăng nhập</returns>
        private int? GetCurrentUserId()
        {
            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            return int.TryParse(userIdClaim, out var userId) ? userId : null;
        }
    }
} 
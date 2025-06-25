using BreathingFree.Services;
using BreathingFree.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using System.Security.Claims;

namespace BreathingFree.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class PostController : ControllerBase
    {
        private readonly PostService _postService;

        public PostController(PostService postService)
        {
            _postService = postService;
        }

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

        private int? GetCurrentUserId()
        {
            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            return int.TryParse(userIdClaim, out var userId) ? userId : null;
        }
    }
} 
using BreathingFree.Data;
using BreathingFree.Models;
using Microsoft.EntityFrameworkCore;
using System.Text.Json;

namespace BreathingFree.Services
{
    public class PostService
    {
        private readonly ApplicationDbContext _context;

        public PostService(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<List<PostResponseDto>> GetPostsAsync(string postType, string? category = null, string? search = null, int page = 1, int pageSize = 10, int? userId = null)
        {
            var query = _context.CommunityPosts
                .Include(p => p.User)
                .Include(p => p.PostLikes)
                .Where(p => p.PostType == postType && p.ParentPostID == null);

            if (!string.IsNullOrEmpty(category))
            {
                query = query.Where(p => p.Category == category);
            }

            if (!string.IsNullOrEmpty(search))
            {
                query = query.Where(p => p.Title.Contains(search) || p.Content.Contains(search));
            }

            if (postType == "FAQ")
            {
                query = query.Where(p => p.IsApproved);
            }

            var posts = await query
                .OrderByDescending(p => p.IsFeatured)
                .ThenByDescending(p => p.CreatedAt)
                .Skip((page - 1) * pageSize)
                .Take(pageSize)
                .ToListAsync();

            var result = new List<PostResponseDto>();

            foreach (var post in posts)
            {
                var postDto = new PostResponseDto
                {
                    PostID = post.PostID,
                    UserID = post.UserID,
                    UserName = post.User?.FullName ?? "Ẩn danh",
                    UserAvatar = post.User?.Avatar ?? "",
                    Title = post.Title,
                    Content = post.Content,
                    PostType = post.PostType,
                    Category = post.Category,
                    Tags = string.IsNullOrEmpty(post.Tags) ? new List<string>() : JsonSerializer.Deserialize<List<string>>(post.Tags) ?? new List<string>(),
                    Likes = post.Likes,
                    Views = post.Views,
                    IsLiked = userId.HasValue ? post.PostLikes.Any(pl => pl.UserID == userId.Value) : false,
                    CreatedAt = post.CreatedAt,
                    UpdatedAt = post.UpdatedAt,
                    IsFeatured = post.IsFeatured
                };

                // Lấy comments cho bài viết
                var comments = await GetCommentsAsync(post.PostID);
                postDto.Comments = comments;

                result.Add(postDto);
            }

            return result;
        }

        public async Task<PostResponseDto?> GetPostByIdAsync(int postId, int? userId = null)
        {
            var post = await _context.CommunityPosts
                .Include(p => p.User)
                .Include(p => p.PostLikes)
                .FirstOrDefaultAsync(p => p.PostID == postId);

            if (post == null) return null;

            // Tăng view count
            post.Views++;
            await _context.SaveChangesAsync();

            var comments = await GetCommentsAsync(postId);

            return new PostResponseDto
            {
                PostID = post.PostID,
                UserID = post.UserID,
                UserName = post.User?.FullName ?? "Ẩn danh",
                UserAvatar = post.User?.Avatar ?? "",
                Title = post.Title,
                Content = post.Content,
                PostType = post.PostType,
                Category = post.Category,
                Tags = string.IsNullOrEmpty(post.Tags) ? new List<string>() : JsonSerializer.Deserialize<List<string>>(post.Tags) ?? new List<string>(),
                Likes = post.Likes,
                Views = post.Views,
                IsLiked = userId.HasValue ? post.PostLikes.Any(pl => pl.UserID == userId.Value) : false,
                CreatedAt = post.CreatedAt,
                UpdatedAt = post.UpdatedAt,
                IsFeatured = post.IsFeatured,
                Comments = comments
            };
        }

        public async Task<PostResponseDto> CreatePostAsync(int userId, CreatePostDto createPostDto)
        {
            var post = new CommunityPost
            {
                UserID = userId,
                Title = createPostDto.Title,
                Content = createPostDto.Content,
                PostType = createPostDto.PostType,
                Category = createPostDto.Category,
                Tags = JsonSerializer.Serialize(createPostDto.Tags),
                IsApproved = createPostDto.PostType == "Blog" // Blog tự động duyệt, FAQ cần admin duyệt
            };

            _context.CommunityPosts.Add(post);
            await _context.SaveChangesAsync();

            return await GetPostByIdAsync(post.PostID, userId) ?? new PostResponseDto();
        }

        public async Task<bool> UpdatePostAsync(int postId, int userId, UpdatePostDto updatePostDto)
        {
            var post = await _context.CommunityPosts.FirstOrDefaultAsync(p => p.PostID == postId && p.UserID == userId);
            if (post == null) return false;

            post.Title = updatePostDto.Title;
            post.Content = updatePostDto.Content;
            post.Category = updatePostDto.Category;
            post.Tags = JsonSerializer.Serialize(updatePostDto.Tags);
            post.UpdatedAt = DateTime.Now;

            await _context.SaveChangesAsync();
            return true;
        }

        public async Task<bool> DeletePostAsync(int postId, int userId)
        {
            var post = await _context.CommunityPosts.FirstOrDefaultAsync(p => p.PostID == postId && p.UserID == userId);
            if (post == null) return false;

            _context.CommunityPosts.Remove(post);
            await _context.SaveChangesAsync();
            return true;
        }

        public async Task<bool> LikePostAsync(int postId, int userId)
        {
            var existingLike = await _context.PostLikes.FirstOrDefaultAsync(pl => pl.PostID == postId && pl.UserID == userId);
            
            if (existingLike != null)
            {
                // Unlike
                _context.PostLikes.Remove(existingLike);
                
                var post = await _context.CommunityPosts.FirstOrDefaultAsync(p => p.PostID == postId);
                if (post != null)
                {
                    post.Likes = Math.Max(0, post.Likes - 1);
                }
            }
            else
            {
                // Like
                _context.PostLikes.Add(new PostLike
                {
                    PostID = postId,
                    UserID = userId
                });

                var post = await _context.CommunityPosts.FirstOrDefaultAsync(p => p.PostID == postId);
                if (post != null)
                {
                    post.Likes++;
                }
            }

            await _context.SaveChangesAsync();
            return existingLike == null; // Return true if liked, false if unliked
        }

        public async Task<CommentResponseDto> AddCommentAsync(int userId, CreateCommentDto createCommentDto)
        {
            var comment = new CommunityPost
            {
                UserID = userId,
                Content = createCommentDto.Content,
                PostType = "Comment",
                ParentPostID = createCommentDto.ParentPostID,
                IsApproved = true
            };

            _context.CommunityPosts.Add(comment);
            await _context.SaveChangesAsync();

            var user = await _context.Users.FindAsync(userId);

            return new CommentResponseDto
            {
                PostID = comment.PostID,
                UserID = userId,
                UserName = user?.FullName ?? "Ẩn danh",
                UserAvatar = user?.Avatar ?? "",
                Content = comment.Content,
                CreatedAt = comment.CreatedAt
            };
        }

        private async Task<List<CommentResponseDto>> GetCommentsAsync(int parentPostId)
        {
            var comments = await _context.CommunityPosts
                .Include(c => c.User)
                .Where(c => c.ParentPostID == parentPostId && c.PostType == "Comment")
                .OrderBy(c => c.CreatedAt)
                .ToListAsync();

            return comments.Select(c => new CommentResponseDto
            {
                PostID = c.PostID,
                UserID = c.UserID,
                UserName = c.User?.FullName ?? "Ẩn danh",
                UserAvatar = c.User?.Avatar ?? "",
                Content = c.Content,
                CreatedAt = c.CreatedAt
            }).ToList();
        }

        public async Task<bool> IncrementViewAsync(int postId)
        {
            var post = await _context.CommunityPosts.FirstOrDefaultAsync(p => p.PostID == postId);
            if (post == null) return false;

            post.Views++;
            await _context.SaveChangesAsync();
            return true;
        }

        public async Task<List<string>> GetCategoriesAsync(string postType)
        {
            return await _context.CommunityPosts
                .Where(p => p.PostType == postType && !string.IsNullOrEmpty(p.Category))
                .Select(p => p.Category)
                .Distinct()
                .ToListAsync();
        }
    }
} 
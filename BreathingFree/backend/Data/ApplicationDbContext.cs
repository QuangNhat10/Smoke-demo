using BreathingFree.Models;
using System.Collections.Generic;
using Microsoft.EntityFrameworkCore;


namespace BreathingFree.Data
{
    public class ApplicationDbContext : DbContext
    {
        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options)
            : base(options) { }

        public DbSet<User> Users { get; set; }
        public DbSet<CommunityPost> CommunityPosts { get; set; }
        public DbSet<PostLike> PostLikes { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);
            
            // Cấu hình bảng Users
            modelBuilder.Entity<User>(entity =>
            {
                entity.ToTable("Users");
                entity.HasKey(e => e.UserID);
                
                // Các trường đã tồn tại
                entity.Property(e => e.UserID).ValueGeneratedOnAdd();
                entity.Property(e => e.RoleID).IsRequired();
                entity.Property(e => e.FullName);
                entity.Property(e => e.Email);
                entity.Property(e => e.PasswordHash);
                entity.Property(e => e.Gender);
                entity.Property(e => e.DOB);
                entity.Property(e => e.CreatedAt).IsRequired().HasDefaultValueSql("GETDATE()");
                entity.Property(e => e.Status).IsRequired();
                
                // Các trường mới cần thêm vào
                entity.Property(e => e.Phone);
                entity.Property(e => e.Address);
                entity.Property(e => e.Avatar);
            });

            // Cấu hình bảng CommunityPosts
            modelBuilder.Entity<CommunityPost>(entity =>
            {
                entity.ToTable("CommunityPosts");
                entity.HasKey(e => e.PostID);
                
                entity.Property(e => e.PostID).ValueGeneratedOnAdd();
                entity.Property(e => e.UserID).IsRequired();
                entity.Property(e => e.Title).HasMaxLength(500);
                entity.Property(e => e.Content).IsRequired();
                entity.Property(e => e.PostType).HasMaxLength(50).IsRequired();
                entity.Property(e => e.Category).HasMaxLength(100);
                entity.Property(e => e.Tags).HasMaxLength(1000);
                entity.Property(e => e.CreatedAt).IsRequired().HasDefaultValueSql("GETDATE()");

                // Thiết lập quan hệ
                entity.HasOne(e => e.User)
                    .WithMany()
                    .HasForeignKey(e => e.UserID)
                    .OnDelete(DeleteBehavior.Restrict);

                entity.HasOne(e => e.ParentPost)
                    .WithMany(e => e.Comments)
                    .HasForeignKey(e => e.ParentPostID)
                    .OnDelete(DeleteBehavior.Restrict);
            });

            // Cấu hình bảng PostLikes
            modelBuilder.Entity<PostLike>(entity =>
            {
                entity.ToTable("PostLikes");
                entity.HasKey(e => e.PostLikeID);
                
                entity.Property(e => e.PostLikeID).ValueGeneratedOnAdd();
                entity.Property(e => e.PostID).IsRequired();
                entity.Property(e => e.UserID).IsRequired();
                entity.Property(e => e.CreatedAt).IsRequired().HasDefaultValueSql("GETDATE()");

                // Thiết lập quan hệ
                entity.HasOne(e => e.Post)
                    .WithMany(e => e.PostLikes)
                    .HasForeignKey(e => e.PostID)
                    .OnDelete(DeleteBehavior.Cascade);

                entity.HasOne(e => e.User)
                    .WithMany()
                    .HasForeignKey(e => e.UserID)
                    .OnDelete(DeleteBehavior.Restrict);

                // Đảm bảo một user chỉ like một post một lần
                entity.HasIndex(e => new { e.PostID, e.UserID }).IsUnique();
            });
        }
    }
}

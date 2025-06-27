using BreathingFree.Models;
using System.Collections.Generic;
using Microsoft.EntityFrameworkCore;
using BCrypt.Net;

namespace BreathingFree.Data
{
    public class ApplicationDbContext : DbContext
    {
        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options)
            : base(options) { }

        public DbSet<User> Users { get; set; }
        public DbSet<CommunityPost> CommunityPosts { get; set; }
        public DbSet<PostLike> PostLikes { get; set; }
         public DbSet<Message> Messages { get; set; }

        
        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);
             modelBuilder.Entity<Message>(entity =>
 {
     entity.ToTable("Chat"); // Tên bảng trong SQL

     entity.HasKey(m => m.ChatID);

     entity.Property(m => m.ChatID).HasColumnName("ChatID");
     entity.Property(m => m.FromUserID).HasColumnName("FromUserID");
     entity.Property(m => m.ToUserID).HasColumnName("ToUserID");
     entity.Property(m => m.MessageContent).HasColumnName("Message");
     entity.Property(m => m.SentAt).HasColumnName("SentAt");

     entity.HasOne(m => m.Sender)
         .WithMany()
         .HasForeignKey(m => m.FromUserID)
         .OnDelete(DeleteBehavior.Restrict);

     entity.HasOne(m => m.Receiver)
         .WithMany()
         .HasForeignKey(m => m.ToUserID)
         .OnDelete(DeleteBehavior.Restrict);
 });
            
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
                
                // Các trường đặc biệt dành cho bác sĩ
                entity.Property(e => e.Specialty);
                entity.Property(e => e.Degrees);
                entity.Property(e => e.Workplace);
                entity.Property(e => e.TreatmentMethods);
                entity.Property(e => e.SuccessRate).HasColumnType("decimal(5,2)");
                entity.Property(e => e.PatientCount);
                entity.Property(e => e.ResearchPublications);
                entity.Property(e => e.ResponseTimes);
                entity.Property(e => e.Biography);
                entity.Property(e => e.WorkingHours);
                entity.Property(e => e.Languages);
            });
            modelBuilder.Entity<User>().HasData(
                // Doctor với RoleID = 1
                new User
                {
                    UserID = 1001,
                    RoleID = 1,
                    FullName = "Bác sĩ Nguyễn Văn A",
                    Email = "doctor@gmail.com",
                    PasswordHash = "$2a$11$P1C72FaN0SYvvh2aj0t1.OAVdzDvxBL.xoNGb.94D5PDM.piUAQiy", // password: "Doctor123!"
                    Phone = "0123456789",
                    Address = "Hà Nội",
                    Gender = "Nam",
                    DOB = new DateTime(1980, 1, 1),
                    Avatar = null,
                    CreatedAt = new DateTime(2024, 6, 22, 12, 0, 0),
                    Status = "Active"
                },
                // Member với RoleID = 2
                new User
                {
                    UserID = 1011,
                    RoleID = 2,
                    FullName = "Thành viên Nguyễn Văn B",
                    Email = "tantantan123@gmail.com",
                    PasswordHash = "$2a$11$P1C72FaN0SYvvh2aj0t1.OAVdzDvxBL.xoNGb.94D5PDM.piUAQiy",
                    Phone = "0123456789",
                    Address = "Hà Nội",
                    Gender = "Nam",
                    DOB = new DateTime(1990, 1, 1),
                    Avatar = null,
                    CreatedAt = new DateTime(2024, 6, 22, 12, 0, 0),
                    Status = "Active"
                },
                // Staff với RoleID = 3
                new User
                {
                    UserID = 1002,
                    RoleID = 3,
                    FullName = "Nhân viên Trần Thị C",
                    Email = "staff@gmail.com",
                    PasswordHash = "$2a$11$u1QwQwQwQwQwQwQwQwQwQeQwQwQwQwQwQwQwQwQwQwQwQwQwQwQ", // password: "Staff123!"
                    Phone = "0987654321",
                    Address = "Hồ Chí Minh",
                    Gender = "Nữ",
                    DOB = new DateTime(1985, 5, 5),
                    Avatar = null,
                    CreatedAt = new DateTime(2024, 6, 22, 12, 0, 0),
                    Status = "Active"
                },
                // Admin với RoleID = 4
                new User
                {
                    UserID = 1003,
                    RoleID = 4,
                    FullName = "Quản trị viên Lê Văn D",
                    Email = "admin@gmail.com",
                    PasswordHash = "$2a$11$P1C72FaN0SYvvh2aj0t1.OAVdzDvxBL.xoNGb.94D5PDM.piUAQiy", // password: "Admin123!"
                    Phone = "0111222333",
                    Address = "Đà Nẵng",
                    Gender = "Nam",
                    DOB = new DateTime(1975, 3, 15),
                    Avatar = null,
                    CreatedAt = new DateTime(2024, 6, 22, 12, 0, 0),
                    Status = "Active"
                }
            );

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

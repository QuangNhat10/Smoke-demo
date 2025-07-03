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

        public DbSet<Role> Roles { get; set; }
        public DbSet<User> Users { get; set; }
        public DbSet<CommunityPost> CommunityPosts { get; set; }
        public DbSet<PostLike> PostLikes { get; set; }
        public DbSet<Message> Messages { get; set; }
        public DbSet<QuitPlan> QuitPlans { get; set; }
        public DbSet<QuitPlanStage> QuitPlanStages { get; set; }
        public DbSet<QuitProgress> QuitProgresses { get; set; }

        
        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);
            
            // Cấu hình bảng Roles
            modelBuilder.Entity<Role>(entity =>
            {
                entity.ToTable("Roles");
                entity.HasKey(e => e.RoleID);
                
                entity.Property(e => e.RoleID).ValueGeneratedOnAdd();
                entity.Property(e => e.RoleName).IsRequired().HasMaxLength(50);
                entity.Property(e => e.Description).HasMaxLength(200);
                entity.Property(e => e.CreatedAt).IsRequired().HasDefaultValueSql("GETDATE()");
                entity.Property(e => e.IsActive).IsRequired().HasDefaultValue(true);
            });
            
            // Seed dữ liệu ban đầu cho bảng Roles
            modelBuilder.Entity<Role>().HasData(
                new Role { RoleID = 1, RoleName = "Doctor", Description = "Bác sĩ", IsActive = true },
                new Role { RoleID = 2, RoleName = "Member", Description = "Thành viên", IsActive = true },
                new Role { RoleID = 3, RoleName = "Admin", Description = "Quản trị viên", IsActive = true }
            );

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
                
                // Foreign key relationship with Roles table
                entity.HasOne<Role>()
                    .WithMany()
                    .HasForeignKey(e => e.RoleID)
                    .OnDelete(DeleteBehavior.Restrict);
            });
        }
    }
} 
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
        public DbSet<QuitPlan> QuitPlans { get; set; }
        public DbSet<QuitPlanStage> QuitPlanStages { get; set; }
        public DbSet<QuitProgress> QuitProgresses { get; set; }

        
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
            // Tạm thời bỏ seeded data để tránh lỗi datetime
            // modelBuilder.Entity<User>().HasData(...);

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

            // Cấu hình bảng QuitPlans
            modelBuilder.Entity<QuitPlan>(entity =>
            {
                entity.ToTable("QuitPlans");
                entity.HasKey(e => e.QuitPlanID);
                
                entity.Property(e => e.QuitPlanID).ValueGeneratedOnAdd();
                entity.Property(e => e.UserID).IsRequired();
                entity.Property(e => e.CigarettesPerDay).IsRequired();
                entity.Property(e => e.CigarettesPerPack).IsRequired();
                entity.Property(e => e.PricePerPack).HasColumnType("decimal(10,2)").IsRequired();
                entity.Property(e => e.YearsSmoked).IsRequired();
                entity.Property(e => e.DailyCost).HasColumnType("decimal(10,2)").IsRequired();
                entity.Property(e => e.Difficulty).HasMaxLength(20).IsRequired();
                entity.Property(e => e.Status).HasMaxLength(20).IsRequired();
                entity.Property(e => e.Source).HasMaxLength(50).IsRequired();
                entity.Property(e => e.StartDate).IsRequired();
                entity.Property(e => e.CreatedAt).IsRequired().HasDefaultValueSql("GETDATE()");

                // Thiết lập quan hệ
                entity.HasOne(e => e.User)
                    .WithMany()
                    .HasForeignKey(e => e.UserID)
                    .OnDelete(DeleteBehavior.NoAction);

                entity.HasOne(e => e.Doctor)
                    .WithMany()
                    .HasForeignKey(e => e.DoctorID)
                    .OnDelete(DeleteBehavior.SetNull);
            });

            // Cấu hình bảng QuitPlanStages
            modelBuilder.Entity<QuitPlanStage>(entity =>
            {
                entity.ToTable("QuitPlanStages");
                entity.HasKey(e => e.StageID);
                
                entity.Property(e => e.StageID).ValueGeneratedOnAdd();
                entity.Property(e => e.QuitPlanID).IsRequired();
                entity.Property(e => e.StageName).HasMaxLength(200).IsRequired();
                entity.Property(e => e.TargetDate).IsRequired();
                entity.Property(e => e.CreatedAt).IsRequired().HasDefaultValueSql("GETDATE()");

                // Thiết lập quan hệ
                entity.HasOne(e => e.QuitPlan)
                    .WithMany(e => e.QuitPlanStages)
                    .HasForeignKey(e => e.QuitPlanID)
                    .OnDelete(DeleteBehavior.Cascade);
            });

            // Cấu hình bảng QuitProgresses
            modelBuilder.Entity<QuitProgress>(entity =>
            {
                entity.ToTable("QuitProgresses");
                entity.HasKey(e => e.ProgressID);
                
                entity.Property(e => e.ProgressID).ValueGeneratedOnAdd();
                entity.Property(e => e.QuitPlanID).IsRequired();
                entity.Property(e => e.UserID).IsRequired();
                entity.Property(e => e.Date).IsRequired();
                entity.Property(e => e.MoneySaved).HasColumnType("decimal(10,2)");
                entity.Property(e => e.MoodRating).HasMaxLength(20);
                entity.Property(e => e.CravingLevel).HasMaxLength(20);
                entity.Property(e => e.CreatedAt).IsRequired().HasDefaultValueSql("GETDATE()");

                // Thiết lập quan hệ
                entity.HasOne(e => e.QuitPlan)
                    .WithMany(e => e.QuitProgresses)
                    .HasForeignKey(e => e.QuitPlanID)
                    .OnDelete(DeleteBehavior.Cascade);

                entity.HasOne(e => e.User)
                    .WithMany()
                    .HasForeignKey(e => e.UserID)
                    .OnDelete(DeleteBehavior.Restrict);

                // Đảm bảo một user chỉ có một progress record cho mỗi ngày trong một plan
                entity.HasIndex(e => new { e.QuitPlanID, e.UserID, e.Date }).IsUnique();
            });
        }
    }
}

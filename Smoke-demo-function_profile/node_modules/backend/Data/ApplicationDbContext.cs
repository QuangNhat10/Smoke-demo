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
        public DbSet<Feedback> Feedbacks { get; set; }

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
                entity.Property(e => e.FullName).HasMaxLength(100);
                entity.Property(e => e.Email).HasMaxLength(100);
                entity.Property(e => e.PasswordHash);
                entity.Property(e => e.Gender).HasMaxLength(10);
                entity.Property(e => e.DOB);
                entity.Property(e => e.CreatedAt).IsRequired().HasDefaultValueSql("GETDATE()");
                entity.Property(e => e.Status).IsRequired().HasMaxLength(20);
                
                // Các trường cho thông tin liên hệ
                entity.Property(e => e.Phone).HasMaxLength(15);
                entity.Property(e => e.Address).HasMaxLength(200);
                entity.Property(e => e.Avatar).HasMaxLength(500);

                // Các trường cho thông tin bác sĩ
                entity.Property(e => e.Specialty).HasMaxLength(200);
                entity.Property(e => e.Position).HasMaxLength(200);
                entity.Property(e => e.ShortBio).HasMaxLength(500);
            });

            // Cấu hình bảng Feedbacks
            modelBuilder.Entity<Feedback>(entity =>
            {
                entity.ToTable("Feedbacks");
                entity.HasKey(e => e.FeedbackID);

                entity.Property(e => e.FeedbackID).ValueGeneratedOnAdd();
                entity.Property(e => e.UserID).IsRequired();
                entity.Property(e => e.DoctorID).IsRequired();
                entity.Property(e => e.Rating).IsRequired();
                entity.Property(e => e.FeedbackText).HasMaxLength(1000);
                entity.Property(e => e.SubmittedAt).IsRequired().HasDefaultValueSql("GETDATE()");

                // Tạo foreign key đến bảng Users cho DoctorID
                entity.HasOne<User>()
                    .WithMany()
                    .HasForeignKey(f => f.DoctorID)
                    .OnDelete(DeleteBehavior.Restrict);

                // Tạo foreign key đến bảng Users cho UserID
                entity.HasOne<User>()
                    .WithMany()
                    .HasForeignKey(f => f.UserID)
                    .OnDelete(DeleteBehavior.Restrict);
            });
        }
    }
}

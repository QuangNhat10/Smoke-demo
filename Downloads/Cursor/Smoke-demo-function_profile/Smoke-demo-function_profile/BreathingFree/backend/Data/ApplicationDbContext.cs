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
            });

            modelBuilder.Entity<User>().HasData(
                new User
                {
                    UserID = 1011,
                    RoleID = 2,
                    FullName = "Bác sĩ Nguyễn Văn A",
                    Email = "tantantan123@gmail.com",
                    PasswordHash = "$2a$11$P1C72FaN0SYvvh2aj0t1.OAVdzDvxBL.xoNGb.94D5PDM.piUAQiy",
                    Phone = "0123456789",
                    Address = "Hà Nội",
                    Gender = "Nam",
                    DOB = new DateTime(1980, 1, 1),
                    Avatar = null,
                    CreatedAt = new DateTime(2024, 6, 22, 12, 0, 0),
                    Status = "Active"
                },
                new User
                {
                    UserID = 1002,
                    RoleID = 3,
                    FullName = "Bác sĩ Trần Thị B",
                    Email = "doctorB@example.com",
                    PasswordHash = "$2a$11$u1QwQwQwQwQwQwQwQwQwQeQwQwQwQwQwQwQwQwQwQwQwQwQwQwQ",
                    Phone = "0987654321",
                    Address = "Hồ Chí Minh",
                    Gender = "Nữ",
                    DOB = new DateTime(1985, 5, 5),
                    Avatar = null,
                    CreatedAt = new DateTime(2024, 6, 22, 12, 0, 0),
                    Status = "Active"
                }
            );
        }
    }
}

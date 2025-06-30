using Microsoft.EntityFrameworkCore;
using BreathingFree.Models;

namespace BreathingFree.Data
{
    public class ApplicationDbContext : DbContext
    {
        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options)
            : base(options)
        {
        }

        public DbSet<User> Users { get; set; }
        public DbSet<Membership> Memberships { get; set; }
        public DbSet<Feedback> Feedbacks { get; set; }
        public DbSet<QuitPlan> QuitPlans { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);
            
            // Configure User entity
            modelBuilder.Entity<User>(entity =>
            {
                entity.ToTable("Users", "dbo");
                entity.HasKey(e => e.UserID);
                entity.Property(e => e.Email).IsRequired().HasMaxLength(100);
                entity.Property(e => e.PasswordHash).IsRequired();
                entity.Property(e => e.FullName).HasMaxLength(100);
                entity.Property(e => e.Gender).HasMaxLength(10);
                entity.Property(e => e.Status).HasMaxLength(20);
                entity.Property(e => e.Description).HasMaxLength(500);
                entity.Property(e => e.Phone).HasMaxLength(15);
                entity.Property(e => e.Address).HasMaxLength(200);
                entity.Property(e => e.Avatar).HasMaxLength(500);
                entity.Property(e => e.Specialty).HasMaxLength(200);
                entity.Property(e => e.Position).HasMaxLength(200);
                entity.Property(e => e.ShortBio).HasMaxLength(500);
                entity.HasIndex(e => e.Email).IsUnique();
            });

            // Configure Membership entity
            modelBuilder.Entity<Membership>(entity =>
            {
                entity.ToTable("Memberships", "dbo");
                entity.HasKey(e => e.MembershipID);
                entity.HasOne(e => e.User)
                      .WithMany()
                      .HasForeignKey(e => e.UserID)
                      .OnDelete(DeleteBehavior.Cascade);
            });

            // Configure Feedback entity
            modelBuilder.Entity<Feedback>(entity =>
            {
                entity.ToTable("Feedback", "dbo");
                entity.HasKey(e => e.FeedbackID);
                entity.Property(e => e.FeedbackText)
                      .HasColumnType("nvarchar(1000)")
                      .IsUnicode(true);
                entity.HasOne(e => e.User)
                      .WithMany()
                      .HasForeignKey(e => e.UserID)
                      .OnDelete(DeleteBehavior.Cascade);
            });

            // Configure QuitPlan entity
            modelBuilder.Entity<QuitPlan>(entity =>
            {
                entity.ToTable("QuitPlans", "dbo");
                entity.HasKey(e => e.ID);
                entity.HasOne(e => e.User)
                    .WithMany()
                      .HasForeignKey(e => e.UserID)
                      .OnDelete(DeleteBehavior.Cascade);
                entity.HasOne(e => e.Doctor)
                    .WithMany()
                      .HasForeignKey(e => e.DoctorID)
                      .OnDelete(DeleteBehavior.SetNull);
            });

            // Add test user with known password
            var testPassword = BCrypt.Net.BCrypt.HashPassword("Test@123");
            modelBuilder.Entity<User>().HasData(
                new User
                {
                    UserID = 999,
                    Email = "test@example.com",
                    PasswordHash = testPassword,
                    FullName = "Test User",
                    RoleID = 2, // Member role
                    CreatedAt = DateTime.Now,
                    Status = "Active"
                }
            );

            // Add some seed data for testing
            modelBuilder.Entity<User>().HasData(
                new User
                {
                    UserID = 1,
                    Email = "admin@example.com",
                    PasswordHash = BCrypt.Net.BCrypt.HashPassword("admin123"),
                    FullName = "Admin User",
                    RoleID = 1, // Admin role
                    CreatedAt = DateTime.Now,
                    Status = "Active"
                }
            );
        }
    }
}

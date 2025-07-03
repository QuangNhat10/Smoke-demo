using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace BreathingFree.Migrations
{
    /// <inheritdoc />
    public partial class InitialCreate : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "Users",
                columns: table => new
                {
                    UserID = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    RoleID = table.Column<int>(type: "int", nullable: false),
                    FullName = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    Email = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    PasswordHash = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    Phone = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    Address = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    Gender = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    DOB = table.Column<DateTime>(type: "datetime2", nullable: true),
                    Avatar = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    CreatedAt = table.Column<DateTime>(type: "datetime2", nullable: false, defaultValueSql: "GETDATE()"),
                    Status = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Specialty = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    Degrees = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    Workplace = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    TreatmentMethods = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    SuccessRate = table.Column<decimal>(type: "decimal(5,2)", nullable: true),
                    PatientCount = table.Column<int>(type: "int", nullable: true),
                    ResearchPublications = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    ResponseTimes = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    Biography = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    WorkingHours = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    Languages = table.Column<string>(type: "nvarchar(max)", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Users", x => x.UserID);
                });

            migrationBuilder.CreateTable(
                name: "Chat",
                columns: table => new
                {
                    ChatID = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    FromUserID = table.Column<int>(type: "int", nullable: false),
                    ToUserID = table.Column<int>(type: "int", nullable: false),
                    Message = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    SentAt = table.Column<DateTime>(type: "datetime2", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Chat", x => x.ChatID);
                    table.ForeignKey(
                        name: "FK_Chat_Users_FromUserID",
                        column: x => x.FromUserID,
                        principalTable: "Users",
                        principalColumn: "UserID",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_Chat_Users_ToUserID",
                        column: x => x.ToUserID,
                        principalTable: "Users",
                        principalColumn: "UserID",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "CommunityPosts",
                columns: table => new
                {
                    PostID = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    UserID = table.Column<int>(type: "int", nullable: false),
                    Title = table.Column<string>(type: "nvarchar(500)", maxLength: 500, nullable: false),
                    Content = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    PostType = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: false),
                    ParentPostID = table.Column<int>(type: "int", nullable: true),
                    CreatedAt = table.Column<DateTime>(type: "datetime2", nullable: false, defaultValueSql: "GETDATE()"),
                    UpdatedAt = table.Column<DateTime>(type: "datetime2", nullable: true),
                    Category = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: false),
                    Tags = table.Column<string>(type: "nvarchar(1000)", maxLength: 1000, nullable: false),
                    Likes = table.Column<int>(type: "int", nullable: false),
                    Views = table.Column<int>(type: "int", nullable: false),
                    IsApproved = table.Column<bool>(type: "bit", nullable: false),
                    IsFeatured = table.Column<bool>(type: "bit", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_CommunityPosts", x => x.PostID);
                    table.ForeignKey(
                        name: "FK_CommunityPosts_CommunityPosts_ParentPostID",
                        column: x => x.ParentPostID,
                        principalTable: "CommunityPosts",
                        principalColumn: "PostID",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_CommunityPosts_Users_UserID",
                        column: x => x.UserID,
                        principalTable: "Users",
                        principalColumn: "UserID",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "QuitPlans",
                columns: table => new
                {
                    QuitPlanID = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    UserID = table.Column<int>(type: "int", nullable: false),
                    DoctorID = table.Column<int>(type: "int", nullable: true),
                    CigarettesPerDay = table.Column<int>(type: "int", nullable: false),
                    CigarettesPerPack = table.Column<int>(type: "int", nullable: false),
                    PricePerPack = table.Column<decimal>(type: "decimal(10,2)", nullable: false),
                    YearsSmoked = table.Column<int>(type: "int", nullable: false),
                    DailyCost = table.Column<decimal>(type: "decimal(10,2)", nullable: false),
                    QuitDate = table.Column<DateTime>(type: "datetime2", nullable: true),
                    Reasons = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    OtherReason = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    Difficulty = table.Column<string>(type: "nvarchar(20)", maxLength: 20, nullable: false),
                    SupportNeeded = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    Triggers = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    OtherTrigger = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    StartDate = table.Column<DateTime>(type: "datetime2", nullable: false),
                    ExpectedEndDate = table.Column<DateTime>(type: "datetime2", nullable: true),
                    Status = table.Column<string>(type: "nvarchar(20)", maxLength: 20, nullable: false),
                    IsApprovedByDoctor = table.Column<bool>(type: "bit", nullable: false),
                    DoctorNotes = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    Motivation = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    Source = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "datetime2", nullable: false, defaultValueSql: "GETDATE()"),
                    UpdatedAt = table.Column<DateTime>(type: "datetime2", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_QuitPlans", x => x.QuitPlanID);
                    table.ForeignKey(
                        name: "FK_QuitPlans_Users_DoctorID",
                        column: x => x.DoctorID,
                        principalTable: "Users",
                        principalColumn: "UserID",
                        onDelete: ReferentialAction.SetNull);
                    table.ForeignKey(
                        name: "FK_QuitPlans_Users_UserID",
                        column: x => x.UserID,
                        principalTable: "Users",
                        principalColumn: "UserID");
                });

            migrationBuilder.CreateTable(
                name: "PostLikes",
                columns: table => new
                {
                    PostLikeID = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    PostID = table.Column<int>(type: "int", nullable: false),
                    UserID = table.Column<int>(type: "int", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "datetime2", nullable: false, defaultValueSql: "GETDATE()")
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_PostLikes", x => x.PostLikeID);
                    table.ForeignKey(
                        name: "FK_PostLikes_CommunityPosts_PostID",
                        column: x => x.PostID,
                        principalTable: "CommunityPosts",
                        principalColumn: "PostID",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_PostLikes_Users_UserID",
                        column: x => x.UserID,
                        principalTable: "Users",
                        principalColumn: "UserID",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "QuitPlanStages",
                columns: table => new
                {
                    StageID = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    QuitPlanID = table.Column<int>(type: "int", nullable: false),
                    StageName = table.Column<string>(type: "nvarchar(200)", maxLength: 200, nullable: false),
                    Description = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    TargetDate = table.Column<DateTime>(type: "datetime2", nullable: false),
                    IsCompleted = table.Column<bool>(type: "bit", nullable: false),
                    CompletedDate = table.Column<DateTime>(type: "datetime2", nullable: true),
                    Notes = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    TargetCigarettesPerDay = table.Column<int>(type: "int", nullable: true),
                    CreatedAt = table.Column<DateTime>(type: "datetime2", nullable: false, defaultValueSql: "GETDATE()")
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_QuitPlanStages", x => x.StageID);
                    table.ForeignKey(
                        name: "FK_QuitPlanStages_QuitPlans_QuitPlanID",
                        column: x => x.QuitPlanID,
                        principalTable: "QuitPlans",
                        principalColumn: "QuitPlanID",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "QuitProgresses",
                columns: table => new
                {
                    ProgressID = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    QuitPlanID = table.Column<int>(type: "int", nullable: false),
                    UserID = table.Column<int>(type: "int", nullable: false),
                    Date = table.Column<DateTime>(type: "datetime2", nullable: false),
                    SmokedToday = table.Column<bool>(type: "bit", nullable: false),
                    CigarettesSmoked = table.Column<int>(type: "int", nullable: false),
                    MoneySaved = table.Column<decimal>(type: "decimal(10,2)", nullable: false),
                    DaysSmokeFree = table.Column<int>(type: "int", nullable: false),
                    HealthNote = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    MoodRating = table.Column<string>(type: "nvarchar(20)", maxLength: 20, nullable: true),
                    CravingLevel = table.Column<string>(type: "nvarchar(20)", maxLength: 20, nullable: true),
                    Notes = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    SupportUsed = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    TriggersEncountered = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    CreatedAt = table.Column<DateTime>(type: "datetime2", nullable: false, defaultValueSql: "GETDATE()"),
                    UpdatedAt = table.Column<DateTime>(type: "datetime2", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_QuitProgresses", x => x.ProgressID);
                    table.ForeignKey(
                        name: "FK_QuitProgresses_QuitPlans_QuitPlanID",
                        column: x => x.QuitPlanID,
                        principalTable: "QuitPlans",
                        principalColumn: "QuitPlanID",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_QuitProgresses_Users_UserID",
                        column: x => x.UserID,
                        principalTable: "Users",
                        principalColumn: "UserID",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateIndex(
                name: "IX_Chat_FromUserID",
                table: "Chat",
                column: "FromUserID");

            migrationBuilder.CreateIndex(
                name: "IX_Chat_ToUserID",
                table: "Chat",
                column: "ToUserID");

            migrationBuilder.CreateIndex(
                name: "IX_CommunityPosts_ParentPostID",
                table: "CommunityPosts",
                column: "ParentPostID");

            migrationBuilder.CreateIndex(
                name: "IX_CommunityPosts_UserID",
                table: "CommunityPosts",
                column: "UserID");

            migrationBuilder.CreateIndex(
                name: "IX_PostLikes_PostID_UserID",
                table: "PostLikes",
                columns: new[] { "PostID", "UserID" },
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_PostLikes_UserID",
                table: "PostLikes",
                column: "UserID");

            migrationBuilder.CreateIndex(
                name: "IX_QuitPlans_DoctorID",
                table: "QuitPlans",
                column: "DoctorID");

            migrationBuilder.CreateIndex(
                name: "IX_QuitPlans_UserID",
                table: "QuitPlans",
                column: "UserID");

            migrationBuilder.CreateIndex(
                name: "IX_QuitPlanStages_QuitPlanID",
                table: "QuitPlanStages",
                column: "QuitPlanID");

            migrationBuilder.CreateIndex(
                name: "IX_QuitProgresses_QuitPlanID_UserID_Date",
                table: "QuitProgresses",
                columns: new[] { "QuitPlanID", "UserID", "Date" },
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_QuitProgresses_UserID",
                table: "QuitProgresses",
                column: "UserID");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "Chat");

            migrationBuilder.DropTable(
                name: "PostLikes");

            migrationBuilder.DropTable(
                name: "QuitPlanStages");

            migrationBuilder.DropTable(
                name: "QuitProgresses");

            migrationBuilder.DropTable(
                name: "CommunityPosts");

            migrationBuilder.DropTable(
                name: "QuitPlans");

            migrationBuilder.DropTable(
                name: "Users");
        }
    }
}

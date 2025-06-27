using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

#pragma warning disable CA1814 // Prefer jagged arrays over multidimensional

namespace BreathingFree.Migrations
{
    /// <inheritdoc />
    public partial class InitUsers : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
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

            migrationBuilder.InsertData(
                table: "Users",
                columns: new[] { "UserID", "Address", "Avatar", "CreatedAt", "DOB", "Email", "FullName", "Gender", "PasswordHash", "Phone", "RoleID", "Status" },
                values: new object[,]
                {
                    { 1001, "Hà Nội", null, new DateTime(2025, 6, 24, 23, 57, 19, 74, DateTimeKind.Local).AddTicks(1429), new DateTime(1980, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified), "doctorA@example.com", "Bác sĩ Nguyễn Văn A", "Nam", "$2a$11$MVGM3Y8w.T8qCOgSfNr/V.EBRJx5jkWEUqGGr0q/xIc8gqSR8.BjS", "0123456789", 3, "Active" },
                    { 1002, "Hồ Chí Minh", null, new DateTime(2025, 6, 24, 23, 57, 19, 179, DateTimeKind.Local).AddTicks(8759), new DateTime(1985, 5, 5, 0, 0, 0, 0, DateTimeKind.Unspecified), "doctorB@example.com", "Bác sĩ Trần Thị B", "Nữ", "$2a$11$i7ZYgMI3Hn2r.ujH5FrM9.r2EU9sI6WKCHtWiVtc4hHkg9M9f4u36", "0987654321", 3, "Active" }
                });

            migrationBuilder.CreateIndex(
                name: "IX_Chat_FromUserID",
                table: "Chat",
                column: "FromUserID");

            migrationBuilder.CreateIndex(
                name: "IX_Chat_ToUserID",
                table: "Chat",
                column: "ToUserID");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "Chat");

            migrationBuilder.DeleteData(
                table: "Users",
                keyColumn: "UserID",
                keyValue: 1001);

            migrationBuilder.DeleteData(
                table: "Users",
                keyColumn: "UserID",
                keyValue: 1002);
        }
    }
}

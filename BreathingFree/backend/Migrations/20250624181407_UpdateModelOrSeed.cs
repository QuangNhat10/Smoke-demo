using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace BreathingFree.Migrations
{
    /// <inheritdoc />
    public partial class UpdateModelOrSeed : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DeleteData(
                table: "Users",
                keyColumn: "UserID",
                keyValue: 1001);

            migrationBuilder.InsertData(
                table: "Users",
                columns: new[] { "UserID", "Address", "Avatar", "CreatedAt", "DOB", "Email", "FullName", "Gender", "PasswordHash", "Phone", "RoleID", "Status" },
                values: new object[] { 1011, "Hà Nội", null, new DateTime(2024, 6, 22, 12, 0, 0, 0, DateTimeKind.Unspecified), new DateTime(1980, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified), "tantantan123@gmail.com", "Bác sĩ Nguyễn Văn A", "Nam", "$2a$11$P1C72FaN0SYvvh2aj0t1.OAVdzDvxBL.xoNGb.94D5PDM.piUAQiy", "0123456789", 2, "Active" });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DeleteData(
                table: "Users",
                keyColumn: "UserID",
                keyValue: 1011);

            migrationBuilder.InsertData(
                table: "Users",
                columns: new[] { "UserID", "Address", "Avatar", "CreatedAt", "DOB", "Email", "FullName", "Gender", "PasswordHash", "Phone", "RoleID", "Status" },
                values: new object[] { 1001, "Hà Nội", null, new DateTime(2024, 6, 22, 12, 0, 0, 0, DateTimeKind.Unspecified), new DateTime(1980, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified), "doctorA@example.com", "Bác sĩ Nguyễn Văn A", "Nam", "$2a$11$u1QwQwQwQwQwQwQwQwQwQeQwQwQwQwQwQwQwQwQwQwQwQwQwQwQ", "0123456789", 3, "Active" });
        }
    }
}

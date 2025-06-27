using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace BreathingFree.Migrations
{
    /// <inheritdoc />
    public partial class SeedDoctors : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.UpdateData(
                table: "Users",
                keyColumn: "UserID",
                keyValue: 1001,
                columns: new[] { "CreatedAt", "PasswordHash" },
                values: new object[] { new DateTime(2024, 6, 22, 12, 0, 0, 0, DateTimeKind.Unspecified), "$2a$11$u1QwQwQwQwQwQwQwQwQwQeQwQwQwQwQwQwQwQwQwQwQwQwQwQwQ" });

            migrationBuilder.UpdateData(
                table: "Users",
                keyColumn: "UserID",
                keyValue: 1002,
                columns: new[] { "CreatedAt", "PasswordHash" },
                values: new object[] { new DateTime(2024, 6, 22, 12, 0, 0, 0, DateTimeKind.Unspecified), "$2a$11$u1QwQwQwQwQwQwQwQwQwQeQwQwQwQwQwQwQwQwQwQwQwQwQwQwQ" });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.UpdateData(
                table: "Users",
                keyColumn: "UserID",
                keyValue: 1001,
                columns: new[] { "CreatedAt", "PasswordHash" },
                values: new object[] { new DateTime(2025, 6, 24, 23, 57, 19, 74, DateTimeKind.Local).AddTicks(1429), "$2a$11$MVGM3Y8w.T8qCOgSfNr/V.EBRJx5jkWEUqGGr0q/xIc8gqSR8.BjS" });

            migrationBuilder.UpdateData(
                table: "Users",
                keyColumn: "UserID",
                keyValue: 1002,
                columns: new[] { "CreatedAt", "PasswordHash" },
                values: new object[] { new DateTime(2025, 6, 24, 23, 57, 19, 179, DateTimeKind.Local).AddTicks(8759), "$2a$11$i7ZYgMI3Hn2r.ujH5FrM9.r2EU9sI6WKCHtWiVtc4hHkg9M9f4u36" });
        }
    }
}

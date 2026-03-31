using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

#pragma warning disable CA1814 // Prefer jagged arrays over multidimensional

namespace RamApi.Migrations
{
    /// <inheritdoc />
    public partial class InitialCreate : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "Rams",
                columns: table => new
                {
                    Id = table.Column<int>(type: "INTEGER", nullable: false)
                        .Annotation("Sqlite:Autoincrement", true),
                    Name = table.Column<string>(type: "TEXT", nullable: false),
                    Brand = table.Column<string>(type: "TEXT", nullable: false),
                    Warranty = table.Column<string>(type: "TEXT", nullable: false),
                    DdrType = table.Column<string>(type: "TEXT", nullable: false),
                    SpeedMhz = table.Column<int>(type: "INTEGER", nullable: false),
                    CapacityGb = table.Column<int>(type: "INTEGER", nullable: false),
                    Price = table.Column<decimal>(type: "TEXT", precision: 18, scale: 2, nullable: false),
                    Stock = table.Column<int>(type: "INTEGER", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Rams", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "Orders",
                columns: table => new
                {
                    Id = table.Column<int>(type: "INTEGER", nullable: false)
                        .Annotation("Sqlite:Autoincrement", true),
                    CustomerName = table.Column<string>(type: "TEXT", nullable: false),
                    RamId = table.Column<int>(type: "INTEGER", nullable: false),
                    Quantity = table.Column<int>(type: "INTEGER", nullable: false),
                    Status = table.Column<string>(type: "TEXT", nullable: false),
                    OrderedAt = table.Column<DateTime>(type: "TEXT", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Orders", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Orders_Rams_RamId",
                        column: x => x.RamId,
                        principalTable: "Rams",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.InsertData(
                table: "Rams",
                columns: new[] { "Id", "Brand", "CapacityGb", "DdrType", "Name", "Price", "SpeedMhz", "Stock", "Warranty" },
                values: new object[,]
                {
                    { 1, "Kingston", 8, "DDR4", "Fury Beast DDR4", 2499m, 3200, 10, "Lifetime" },
                    { 2, "Kingston", 16, "DDR4", "Fury Beast DDR4", 4599m, 3200, 8, "Lifetime" },
                    { 3, "Corsair", 8, "DDR4", "Vengeance LPX", 2299m, 3000, 5, "Lifetime" },
                    { 4, "Corsair", 16, "DDR4", "Vengeance LPX", 4299m, 3000, 0, "Lifetime" },
                    { 5, "G.Skill", 16, "DDR4", "Trident Z RGB", 5499m, 3600, 6, "Lifetime" },
                    { 6, "G.Skill", 32, "DDR5", "Trident Z5 RGB", 12999m, 6000, 4, "Lifetime" },
                    { 7, "G.Skill", 8, "DDR4", "Ripjaws V", 2199m, 3200, 12, "Lifetime" },
                    { 8, "G.Skill", 16, "DDR4", "Ripjaws V", 4099m, 3200, 7, "Lifetime" },
                    { 9, "Crucial", 8, "DDR4", "Ballistix Sport", 1999m, 2666, 0, "Lifetime" },
                    { 10, "Crucial", 16, "DDR5", "Pro DDR5", 7499m, 5600, 3, "5 Years" },
                    { 11, "ADATA", 16, "DDR5", "XPG Lancer", 6999m, 5200, 5, "Lifetime" },
                    { 12, "ADATA", 16, "DDR4", "XPG Spectrix D50", 5199m, 3600, 9, "Lifetime" },
                    { 13, "Corsair", 32, "DDR5", "Dominator Platinum", 14999m, 5600, 2, "Lifetime" },
                    { 14, "TeamGroup", 8, "DDR4", "T-Force Vulcan Z", 1899m, 3200, 15, "Lifetime" },
                    { 15, "TeamGroup", 16, "DDR4", "T-Force Delta RGB", 3999m, 3200, 0, "Lifetime" }
                });

            migrationBuilder.CreateIndex(
                name: "IX_Orders_RamId",
                table: "Orders",
                column: "RamId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "Orders");

            migrationBuilder.DropTable(
                name: "Rams");
        }
    }
}

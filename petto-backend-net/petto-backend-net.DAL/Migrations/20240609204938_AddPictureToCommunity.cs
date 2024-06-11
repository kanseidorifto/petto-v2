using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace petto_backend_net.DAL.Migrations
{
    /// <inheritdoc />
    public partial class AddPictureToCommunity : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_UserPosts_PetProfiles_PetProfileId",
                table: "UserPosts");

            migrationBuilder.DropIndex(
                name: "IX_UserPosts_PetProfileId",
                table: "UserPosts");

            migrationBuilder.DropColumn(
                name: "PetProfileId",
                table: "UserPosts");

            migrationBuilder.AlterColumn<int>(
                name: "Age",
                table: "PetProfiles",
                type: "integer",
                nullable: true,
                oldClrType: typeof(int),
                oldType: "integer");

            migrationBuilder.AddColumn<string>(
                name: "PictureUrl",
                table: "Communities",
                type: "text",
                nullable: true);

            migrationBuilder.AddColumn<Guid>(
                name: "CommunityId",
                table: "AspNetUsers",
                type: "uuid",
                nullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_AspNetUsers_CommunityId",
                table: "AspNetUsers",
                column: "CommunityId");

            migrationBuilder.AddForeignKey(
                name: "FK_AspNetUsers_Communities_CommunityId",
                table: "AspNetUsers",
                column: "CommunityId",
                principalTable: "Communities",
                principalColumn: "Id");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_AspNetUsers_Communities_CommunityId",
                table: "AspNetUsers");

            migrationBuilder.DropIndex(
                name: "IX_AspNetUsers_CommunityId",
                table: "AspNetUsers");

            migrationBuilder.DropColumn(
                name: "PictureUrl",
                table: "Communities");

            migrationBuilder.DropColumn(
                name: "CommunityId",
                table: "AspNetUsers");

            migrationBuilder.AddColumn<Guid>(
                name: "PetProfileId",
                table: "UserPosts",
                type: "uuid",
                nullable: true);

            migrationBuilder.AlterColumn<int>(
                name: "Age",
                table: "PetProfiles",
                type: "integer",
                nullable: false,
                defaultValue: 0,
                oldClrType: typeof(int),
                oldType: "integer",
                oldNullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_UserPosts_PetProfileId",
                table: "UserPosts",
                column: "PetProfileId");

            migrationBuilder.AddForeignKey(
                name: "FK_UserPosts_PetProfiles_PetProfileId",
                table: "UserPosts",
                column: "PetProfileId",
                principalTable: "PetProfiles",
                principalColumn: "Id");
        }
    }
}

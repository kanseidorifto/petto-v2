using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace petto_backend_net.DAL.Migrations
{
    /// <inheritdoc />
    public partial class RefactorChats : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "LastMessageAt",
                table: "ChatRooms");

            migrationBuilder.AddColumn<string>(
                name: "IconUrl",
                table: "ChatRooms",
                type: "text",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "Type",
                table: "ChatRooms",
                type: "integer",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<Guid>(
                name: "LastReadedMessageId",
                table: "ChatParticipants",
                type: "uuid",
                nullable: true);

            migrationBuilder.AlterColumn<string>(
                name: "MessageText",
                table: "ChatMessages",
                type: "text",
                nullable: true,
                oldClrType: typeof(string),
                oldType: "text");

            migrationBuilder.AddColumn<string>(
                name: "MessageMediaUrls",
                table: "ChatMessages",
                type: "text",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "MessageType",
                table: "ChatMessages",
                type: "integer",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.CreateIndex(
                name: "IX_ChatParticipants_LastReadedMessageId",
                table: "ChatParticipants",
                column: "LastReadedMessageId");

            migrationBuilder.AddForeignKey(
                name: "FK_ChatParticipants_ChatMessages_LastReadedMessageId",
                table: "ChatParticipants",
                column: "LastReadedMessageId",
                principalTable: "ChatMessages",
                principalColumn: "Id");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_ChatParticipants_ChatMessages_LastReadedMessageId",
                table: "ChatParticipants");

            migrationBuilder.DropIndex(
                name: "IX_ChatParticipants_LastReadedMessageId",
                table: "ChatParticipants");

            migrationBuilder.DropColumn(
                name: "IconUrl",
                table: "ChatRooms");

            migrationBuilder.DropColumn(
                name: "Type",
                table: "ChatRooms");

            migrationBuilder.DropColumn(
                name: "LastReadedMessageId",
                table: "ChatParticipants");

            migrationBuilder.DropColumn(
                name: "MessageMediaUrls",
                table: "ChatMessages");

            migrationBuilder.DropColumn(
                name: "MessageType",
                table: "ChatMessages");

            migrationBuilder.AddColumn<DateTime>(
                name: "LastMessageAt",
                table: "ChatRooms",
                type: "timestamp with time zone",
                nullable: false,
                defaultValue: new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified));

            migrationBuilder.AlterColumn<string>(
                name: "MessageText",
                table: "ChatMessages",
                type: "text",
                nullable: false,
                defaultValue: "",
                oldClrType: typeof(string),
                oldType: "text",
                oldNullable: true);
        }
    }
}

using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Microsoft.EntityFrameworkCore;
using petto_backend_net.DAL.Entities;

namespace petto_backend_net.DAL.Configurations;

public class ChatRoomConfiguration : IEntityTypeConfiguration<ChatRoom>
{
    public void Configure(EntityTypeBuilder<ChatRoom> builder)
    {
        builder
        .HasKey(cr => cr.Id);

        builder
            .HasMany(cr => cr.Participants)
            .WithOne(cp => cp.ChatRoom)
            .HasForeignKey(cp => cp.ChatRoomId);

        builder
            .HasMany(cr => cr.Messages)
            .WithOne(cm => cm.ChatRoom)
            .HasForeignKey(cm => cm.ChatRoomId);
    }
}

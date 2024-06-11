using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Microsoft.EntityFrameworkCore;
using petto_backend_net.DAL.Entities;

namespace petto_backend_net.DAL.Configurations;

public class ChatMessageConfiguration : IEntityTypeConfiguration<ChatMessage>
{
    public void Configure(EntityTypeBuilder<ChatMessage> builder)
    {
        builder
            .HasKey(cm => cm.Id);

        builder
            .HasOne(cm => cm.SenderProfile)
            .WithMany(p => p.ChatMessages)
            .HasForeignKey(cm => cm.SenderProfileId);
    }
}

using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using petto_backend_net.DAL.Entities;

namespace petto_backend_net.DAL.Configurations;

public class ChatParticipantConfiguration : IEntityTypeConfiguration<ChatParticipant>
{
    public void Configure(EntityTypeBuilder<ChatParticipant> builder)
    {
        builder
            .HasKey(cp => new { cp.ChatRoomId, cp.ProfileId });

        builder
            .HasOne(cp => cp.Profile)
            .WithMany(p => p.ChatParticipants)
            .HasForeignKey(cp => cp.ProfileId);
    }
}

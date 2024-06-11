using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using petto_backend_net.DAL.Entities;

namespace petto_backend_net.DAL.Configurations;

public class CommunityMemberConfiguration : IEntityTypeConfiguration<CommunityMember>
{
    public void Configure(EntityTypeBuilder<CommunityMember> builder)
    {
        builder
            .HasKey(cm => new { cm.CommunityId, cm.ProfileId });

        builder
            .HasOne(cm => cm.Community)
            .WithMany(c => c.CommunityMembers)
            .HasForeignKey(cm => cm.CommunityId);

        builder
            .HasOne(cm => cm.Profile)
            .WithMany(p => p.Communities)
            .HasForeignKey(cm => cm.ProfileId);
    }
}

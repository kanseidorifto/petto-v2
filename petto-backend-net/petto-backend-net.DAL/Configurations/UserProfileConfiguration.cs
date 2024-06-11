using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Microsoft.EntityFrameworkCore;
using petto_backend_net.DAL.Entities;

namespace petto_backend_net.DAL.Configurations;

public class UserProfileConfiguration : IEntityTypeConfiguration<UserProfile>
{
    public void Configure(EntityTypeBuilder<UserProfile> builder)
    {
        builder
            .HasMany(up => up.Friends)
            .WithMany(up => up.FriendOf)
            .UsingEntity<UserFriendship>(
                u => u.HasOne(uf => uf.ProfileRequest)
                    .WithMany(up => up.FriendRequests)
                    .HasForeignKey(uf => uf.ProfileRequestId),
                u => u.HasOne(uf => uf.ProfileAccept)
                    .WithMany(up => up.FriendResponses)
                    .HasForeignKey(uf => uf.ProfileAcceptId)
            );
    }
}

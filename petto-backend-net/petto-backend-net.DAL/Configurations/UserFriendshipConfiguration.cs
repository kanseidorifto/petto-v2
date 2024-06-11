using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using petto_backend_net.DAL.Entities;

namespace petto_backend_net.DAL.Configurations;

public class UserFriendshipConfiguration: IEntityTypeConfiguration<UserFriendship>
{
    public void Configure(EntityTypeBuilder<UserFriendship> builder)
    {
        builder
            .HasKey(uf => new { uf.ProfileRequestId, uf.ProfileAcceptId });

        builder
            .HasOne(uf => uf.ProfileRequest)
            .WithMany(u => u.FriendRequests)
            .HasForeignKey(uf => uf.ProfileRequestId)
            .OnDelete(DeleteBehavior.Cascade);

        builder
            .HasOne(uf => uf.ProfileAccept)
            .WithMany(u => u.FriendResponses)
            .HasForeignKey(uf => uf.ProfileAcceptId)
            .OnDelete(DeleteBehavior.Cascade);
    }
}

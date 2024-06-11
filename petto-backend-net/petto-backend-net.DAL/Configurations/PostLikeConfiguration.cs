using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using petto_backend_net.DAL.Entities;

namespace petto_backend_net.DAL.Configurations;

public class PostLikeConfiguration : IEntityTypeConfiguration<PostLike>
{
    public void Configure(EntityTypeBuilder<PostLike> builder)
    {
        builder
           .HasKey(pl => new { pl.PostId, pl.ProfileId });

        builder
            .HasOne(pl => pl.Post)
            .WithMany(p => p.Likes)
            .HasForeignKey(pl => pl.PostId);

        builder
            .HasOne(pl => pl.Profile)
            .WithMany(p => p.Likes)
            .HasForeignKey(pl => pl.ProfileId);
    }
}

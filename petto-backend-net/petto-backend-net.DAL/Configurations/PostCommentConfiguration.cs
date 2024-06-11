using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Microsoft.EntityFrameworkCore;
using petto_backend_net.DAL.Entities;

namespace petto_backend_net.DAL.Configurations;

public class PostCommentConfiguration : IEntityTypeConfiguration<PostComment>
{
    public void Configure(EntityTypeBuilder<PostComment> builder)
    {
        builder
            .HasKey(pc => pc.Id);

        builder
            .HasOne(pc => pc.Post)
            .WithMany(p => p.Comments)
            .HasForeignKey(pc => pc.PostId);

        builder
            .HasOne(pc => pc.Profile)
            .WithMany(p => p.Comments)
            .HasForeignKey(pc => pc.ProfileId);
    }
}

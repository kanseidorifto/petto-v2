using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Microsoft.EntityFrameworkCore;
using petto_backend_net.DAL.Entities;

namespace petto_backend_net.DAL.Configurations;

public class UserPostConfiguration : IEntityTypeConfiguration<UserPost>
{
    public void Configure(EntityTypeBuilder<UserPost> builder)
    {
        builder
            .HasKey(up => up.Id);

        builder
            .HasOne(up => up.Profile)
            .WithMany(p => p.Posts)
            .HasForeignKey(up => up.ProfileId);

        builder
            .HasOne(up => up.Community)
            .WithMany(c => c.Posts)
            .HasForeignKey(up => up.CommunityId);

        builder
            .HasMany(up => up.TaggedPets)
            .WithMany(pp => pp.Posts)
            .UsingEntity<PostTaggedPet>();
    }
}

using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using petto_backend_net.DAL.Entities;

namespace petto_backend_net.DAL.Configurations;

public class PostTaggedPetConfiguration : IEntityTypeConfiguration<PostTaggedPet>
{
    public void Configure(EntityTypeBuilder<PostTaggedPet> builder)
    {
        builder
           .HasKey(ptp => new { ptp.PostId, ptp.PetProfileId });

        builder
            .HasOne(ptp => ptp.Post)
            .WithMany(p => p.PostTaggedPets)
            .HasForeignKey(ptp => ptp.PostId);

        builder
            .HasOne(ptp => ptp.PetProfile)
            .WithMany(p => p.TaggedPosts)
            .HasForeignKey(ptp => ptp.PetProfileId);
    }
}

using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Microsoft.EntityFrameworkCore;
using petto_backend_net.DAL.Entities;

namespace petto_backend_net.DAL.Configurations;

public class PetProfileConfiguration : IEntityTypeConfiguration<PetProfile>
{
    public void Configure(EntityTypeBuilder<PetProfile> builder)
    {
        builder
            .HasKey(pp => pp.Id);

        builder
            .HasOne(pp => pp.Owner)
            .WithMany(u => u.Pets)
            .HasForeignKey(pp => pp.OwnerId);

        builder
            .HasMany(pp => pp.Posts)
            .WithMany(up => up.TaggedPets)
            .UsingEntity<PostTaggedPet>();
    }
}

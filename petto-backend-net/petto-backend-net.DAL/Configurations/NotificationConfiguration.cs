using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Microsoft.EntityFrameworkCore;
using petto_backend_net.DAL.Entities;

namespace petto_backend_net.DAL.Configurations;

public class NotificationConfiguration : IEntityTypeConfiguration<Notification>
{
    public void Configure(EntityTypeBuilder<Notification> builder)
    {
        builder
        .HasKey(cm => cm.Id);

        builder
            .HasIndex(n => new { n.ProfileId, n.IsRead });

        builder
            .HasOne(n => n.Profile)
            .WithMany(p => p.Notifications)
            .HasForeignKey(n => n.ProfileId);
    }
}

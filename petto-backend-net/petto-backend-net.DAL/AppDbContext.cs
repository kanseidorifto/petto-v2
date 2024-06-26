using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using petto_backend_net.DAL.Entities;

namespace petto_backend_net.DAL;

public class AppDbContext : IdentityDbContext<UserProfile, IdentityRole<Guid>, Guid>
{
    public AppDbContext(DbContextOptions options) : base(options)
    {
        RelationalDatabaseFacadeExtensions.Migrate(Database);
    }

    public DbSet<UserProfile> UserProfiles { get; set; }
    public DbSet<UserFriendship> UserFriendships { get; set; }
    public DbSet<UserPost> UserPosts { get; set; }
    public DbSet<PostLike> PostLikes { get; set; }
    public DbSet<PostComment> PostComments { get; set; }
    public DbSet<PostTaggedPet> PostTaggedPets { get; set; }
    public DbSet<PetProfile> PetProfiles { get; set; }
    public DbSet<Community> Communities { get; set; }
    public DbSet<CommunityMember> CommunityMembers { get; set; }
    public DbSet<ChatRoom> ChatRooms { get; set; }
    public DbSet<ChatParticipant> ChatParticipants { get; set; }
    public DbSet<ChatMessage> ChatMessages { get; set; }
    public DbSet<Notification> Notifications { get; set; }

    protected override void OnModelCreating(ModelBuilder builder)
    {
        base.OnModelCreating(builder);
        builder.ApplyConfigurationsFromAssembly(typeof(AppDbContext).Assembly);
    }
}

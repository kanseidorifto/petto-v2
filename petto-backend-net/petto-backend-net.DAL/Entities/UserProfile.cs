using Microsoft.AspNetCore.Identity;

namespace petto_backend_net.DAL.Entities;

public class UserProfile: IdentityUser<Guid>
{
    public string GivenName { get; set; }
    public string Surname { get; set; }
    public string? AvatarUrl { get; set; }
    public string? CoverUrl { get; set; }
    public string? Bio { get; set; }
    
    public ICollection<UserFriendship> FriendRequests { get; set; }
    public ICollection<UserFriendship> FriendResponses { get; set; }
    public ICollection<UserProfile> Friends { get; set; }
    public ICollection<UserProfile> FriendOf { get; set; }
    public ICollection<UserPost> Posts { get; set; }
    public ICollection<PostLike> Likes { get; set; }
    public ICollection<PostComment> Comments { get; set; }
    public ICollection<PetProfile> Pets { get; set; }
    public ICollection<Community> OwnedCommunities { get; set; }
    public ICollection<CommunityMember> Communities { get; set; }
    public ICollection<ChatParticipant> ChatsParticipations { get; set; }
    public ICollection<ChatMessage> ChatMessages { get; set; }
    public ICollection<Notification> Notifications { get; set; }
}

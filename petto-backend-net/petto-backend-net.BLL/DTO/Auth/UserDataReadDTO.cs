namespace petto_backend_net.BLL.DTO.Auth;

public class UserDataReadDTO
{
    public Guid Id { get; set; }
    public string Token { get; set; }
    public string Email { get; set; }
    public string GivenName { get; set; }
    public string Surname { get; set; }
    public string AvatarUrl { get; set; }
    public string CoverUrl { get; set; }
    public string Bio { get; set; }
    //public ICollection<UserFriendshipDTO> FriendRequests { get; set; }
    //public ICollection<UserFriendshipDTO> Friends { get; set; }
    //public ICollection<UserPostDTO> Posts { get; set; }
    //public ICollection<PostLikeDTO> Likes { get; set; }
    //public ICollection<PostCommentDTO> Comments { get; set; }
    //public ICollection<PetProfileDTO> Pets { get; set; }
    //public ICollection<CommunityDTO> OwnedCommunities { get; set; }
    //public ICollection<CommunityMemberDTO> Communities { get; set; }
    //public ICollection<ChatParticipantDTO> ChatParticipants { get; set; }
    //public ICollection<ChatMessageDTO> ChatMessages { get; set; }
    //public ICollection<NotificationDTO> Notifications { get; set; }
}

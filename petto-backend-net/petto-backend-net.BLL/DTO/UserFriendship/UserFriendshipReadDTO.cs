using petto_backend_net.BLL.DTO.UserProfile;

namespace petto_backend_net.BLL.DTO.UserFriendship;

public class UserFriendshipReadDTO
{
    public UserProfileReadDTO ProfileRequest { get; set; }
    public UserProfileReadDTO ProfileAccept { get; set; }
    public bool Status { get; set; }
    public DateTime CreatedAt { get; set; }
    public DateTime EditedAt { get; set; }
}

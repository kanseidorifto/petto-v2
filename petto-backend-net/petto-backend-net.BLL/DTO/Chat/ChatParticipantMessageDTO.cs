using petto_backend_net.BLL.DTO.UserProfile;

namespace petto_backend_net.BLL.DTO.Chat;

public class ChatParticipantMessageDTO
{
    public Guid ChatRoomId { get; set; }
    public UserProfileReadDTO Profile { get; set; }
    public DateTime CreatedAt { get; set; }
}

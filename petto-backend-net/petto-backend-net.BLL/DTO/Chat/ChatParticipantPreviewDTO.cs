using petto_backend_net.BLL.DTO.UserProfile;

namespace petto_backend_net.BLL.DTO.Chat;

public class ChatParticipantPreviewDTO
{
    public Guid ChatRoomId { get; set; }
    public UserProfileReadDTO Profile { get; set; }
    public ChatMessageReadDTO LastReadedMessage { get; set; }
    public DateTime CreatedAt { get; set; }
}

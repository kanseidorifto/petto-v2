using petto_backend_net.BLL.DTO.UserProfile;
using petto_backend_net.DAL.Enums;

namespace petto_backend_net.BLL.DTO.Chat;

public class ChatMessageReadDTO
{
    public Guid Id { get; set; }
    public Guid ChatRoomId { get; set; }
    public UserProfileReadDTO SenderProfile { get; set; }
    public MessageType MessageType { get; set; }
    public string? MessageText { get; set; }
    public ICollection<string>? MessageMediaUrls { get; set; }
    public DateTime CreatedAt { get; set; }
    public ICollection<ChatParticipantMessageDTO> LastReadedBy { get; set; }
}

using petto_backend_net.BLL.DTO.UserProfile;
using petto_backend_net.DAL.Enums;

namespace petto_backend_net.BLL.DTO.Chat;

public class ChatRoomDetailsDTO
{
    public Guid Id { get; set; }
    public string? Title { get; set; }
    public string? IconUrl { get; set; }
    public ChatType Type { get; set; }

    public UserProfileReadDTO Profile { get; set; }
    public ChatMessageReadDTO LastMessage { get; set; }
    public ICollection<ChatParticipantPreviewDTO> Participants { get; set; }
    public DateTime CreatedAt { get; set; }
}

using petto_backend_net.DAL.Enums;

namespace petto_backend_net.BLL.DTO.Chat;

public class ChatRoomPreviewDTO
{
    public Guid Id { get; set; }
    public string? Title { get; set; }
    public string? IconUrl { get; set; }
    public ChatType Type { get; set; }
    public Guid ProfileId { get; set; }

    public ChatMessageReadDTO LastMessage { get; set; }
    public ICollection<ChatParticipantPreviewDTO> Participants { get; set; }
}

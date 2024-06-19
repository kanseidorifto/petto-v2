using Microsoft.AspNetCore.Http;

using petto_backend_net.DAL.Enums;

namespace petto_backend_net.BLL.DTO.Chat;

public class ChatMessageCreateDTO
{
    public MessageType MessageType { get; set; } = MessageType.Text;
    public string? MessageText { get; set; }
    public IFormFileCollection? MessageMediaList { get; set; }
}

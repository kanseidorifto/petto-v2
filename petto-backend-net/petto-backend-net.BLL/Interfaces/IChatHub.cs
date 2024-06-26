using petto_backend_net.BLL.DTO.Chat;

namespace petto_backend_net.BLL.Interfaces;

public interface IChatHub
{
    Task ReceivedChatMessage(ChatMessageReadDTO message);
}

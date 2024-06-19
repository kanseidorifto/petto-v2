using Microsoft.AspNetCore.Http;

namespace petto_backend_net.BLL.DTO.Chat;

public class ChatRoomGroupCreateDTO
{
    public string? Title { get; set; }
    public IFormFile? IconMedia { get; set; }
    public ICollection<Guid> Participants { get; set; }
}

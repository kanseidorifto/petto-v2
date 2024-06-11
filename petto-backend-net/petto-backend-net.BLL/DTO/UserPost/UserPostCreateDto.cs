using Microsoft.AspNetCore.Http;

namespace petto_backend_net.BLL.DTO.UserPost;

public class UserPostCreateDto
{
    public Guid? CommunityId { get; set; }
    public string? WrittenText { get; set; }
    public IFormFileCollection? MediaList { get; set; }
    public IList<Guid>? TaggedPetsIds { get; set; }
}

namespace petto_backend_net.BLL.DTO.Community;

public class CommunityReadDto
{
    public Guid Id { get; set; }
    public string Name { get; set; }
    public string Description { get; set; }
    public string? PictureUrl { get; set; }
}

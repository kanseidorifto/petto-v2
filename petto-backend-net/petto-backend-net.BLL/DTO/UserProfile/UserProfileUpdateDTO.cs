using Microsoft.AspNetCore.Http;

namespace petto_backend_net.BLL.DTO.UserProfile;

public class UserProfileUpdateDTO
{
    public string? GivenName { get; set; }
    public string? Surname { get; set; }
    public IFormFile? AvatarMedia { get; set; }
    public IFormFile? CoverMedia { get; set; }
    public string? Bio { get; set; }
}

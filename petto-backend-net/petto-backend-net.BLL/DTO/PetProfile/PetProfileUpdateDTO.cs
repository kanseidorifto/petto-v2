using Microsoft.AspNetCore.Http;

namespace petto_backend_net.BLL.DTO.PetProfile;

public class PetProfileUpdateDTO
{
    public string? GivenName { get; set; }
    public IFormFile? AvatarMedia { get; set; }
    public string? Breed { get; set; }
    public int? Age { get; set; }
    public string? Bio { get; set; }
}

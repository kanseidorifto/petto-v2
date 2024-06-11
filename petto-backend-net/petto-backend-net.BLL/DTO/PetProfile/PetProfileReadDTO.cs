using petto_backend_net.BLL.DTO.UserProfile;

namespace petto_backend_net.BLL.DTO.PetProfile;

public class PetProfileReadDTO
{
    public Guid Id { get; set; }
    public UserProfileReadDTO Owner { get; set; }
    public string GivenName { get; set; }
    public string? AvatarUrl { get; set; }
    public string Breed { get; set; }
    public int Age { get; set; }
    public string? Bio { get; set; }
}

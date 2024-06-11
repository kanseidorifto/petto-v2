using petto_backend_net.BLL.DTO.Community;
using petto_backend_net.BLL.DTO.PetProfile;

namespace petto_backend_net.BLL.DTO.UserProfile;

public class UserProfileDetailsDTO
{
    public Guid Id { get; set; }
    public string Email { get; set; }
    public string GivenName { get; set; }
    public string Surname { get; set; }
    public string AvatarUrl { get; set; }
    public string CoverUrl { get; set; }
    public string Bio { get; set; }
    public ICollection<UserProfileReadDTO> Friends { get; set; }
    public ICollection<PetProfileReadDTO> Pets { get; set; }
    public ICollection<CommunityReadDto> Communities { get; set; }
}

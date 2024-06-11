using petto_backend_net.BLL.DTO.Community;
using petto_backend_net.BLL.DTO.PetProfile;
using petto_backend_net.BLL.DTO.UserProfile;

namespace petto_backend_net.BLL.DTO.UserPost;

public class UserPostReadDto
{
    public Guid Id { get; set; }
    public UserProfileReadDTO Profile { get; set; }
    public CommunityReadDto? Community { get; set; }
    public string? WrittenText { get; set; }
    public ICollection<string>? MediaLocations { get; set; }
    public DateTime CreatedAt { get; set; }
    public DateTime EditedAt { get; set; }
    public int ViewsCount { get; set; } = 0;
    public ICollection<LikeReadDTO> Likes { get; set; } 
    public ICollection<PostCommentReadDto>? Comments { get; set; }
    public ICollection<PetProfileReadDTO>? TaggedPets { get; set; }

}

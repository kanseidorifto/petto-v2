using petto_backend_net.BLL.DTO.UserProfile;

namespace petto_backend_net.BLL.DTO.UserPost;

public class LikeReadDTO
{
    public Guid PostId { get; set; }
    public Guid ProfileId { get; set; }
    public UserProfileReadDTO Profile { get; set; }
    public DateTime CreatedAt { get; set; }
    public DateTime EditedAt { get; set; }
}

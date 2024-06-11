using petto_backend_net.BLL.DTO.UserProfile;

namespace petto_backend_net.BLL.DTO.UserPost;

public class PostCommentReadDto
{
    public Guid Id { get; set; }
    public UserProfileReadDTO Profile { get; set; }
    public string? WrittenText { get; set; }
    public DateTime CreatedAt { get; set; }
    public DateTime EditedAt { get; set; }
    //public int LikesCount { get; set; }
    //public int RepliesCount { get; set; }
    //public ICollection<PostCommentReadDto>? Replies { get; set; }
}

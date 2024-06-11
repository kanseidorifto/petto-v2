using petto_backend_net.BLL.DTO;
using petto_backend_net.BLL.DTO.UserPost;
using petto_backend_net.BLL.Filtering;

namespace petto_backend_net.BLL.Interfaces;

public interface IUserPostService
{
    Task<EntitiesWithTotalCount<UserPostReadDto>> GetPosts(UserPostFilteringModel model);
    Task<EntitiesWithTotalCount<UserPostReadDto>> GetFeed(Guid userId, UserPostFeedFilteringModel model);
    Task<UserPostReadDto> GetById(Guid postId);
    Task<UserPostReadDto> Create(Guid userId, UserPostCreateDto model);
    Task<bool> Delete(Guid userId, Guid postId);
    Task<bool> ToggleLike(Guid userId, Guid postId, bool isLike);
    Task<PostCommentReadDto> CreateComment(Guid userId, Guid postId, PostCommentCreateDto model);
    Task<bool> DeleteComment(Guid commentId);
}

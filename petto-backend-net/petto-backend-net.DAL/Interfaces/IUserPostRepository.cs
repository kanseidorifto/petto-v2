using petto_backend_net.DAL.Entities;

namespace petto_backend_net.DAL.Interfaces;

public interface IUserPostRepository : IGenericRepository<UserPost, Guid>
{
    Task AddLike(UserPost userPost, UserProfile userProfile);
    Task RemoveLike(UserPost userPost, UserProfile userProfile);

    Task AddComment(UserPost userPost, PostComment postComment);
    Task<PostComment> GetCommentById(Guid id);
    Task RemoveComment(UserPost userPost, PostComment postComment);
}

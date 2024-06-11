using Microsoft.EntityFrameworkCore;

using petto_backend_net.DAL.Entities;
using petto_backend_net.DAL.Interfaces;

namespace petto_backend_net.DAL.Repositories;
public class UserPostRepository(AppDbContext dbContext) : GenericRepository<UserPost, Guid>(dbContext), IUserPostRepository
{
    public async Task AddLike(UserPost userPost, UserProfile userProfile)
    {
        var userPostLike = new PostLike
        {
            PostId = userPost.Id,
            ProfileId = userProfile.Id,
            CreatedAt = DateTime.UtcNow,
            EditedAt = DateTime.UtcNow
        };

        await DbContext.PostLikes.AddAsync(userPostLike);
        await DbContext.SaveChangesAsync();
    }

    public async Task RemoveLike(UserPost userPost, UserProfile userProfile)
    {
        var userPostLike = await DbContext.PostLikes.FirstOrDefaultAsync(pl => pl.PostId == userPost.Id && pl.ProfileId == userProfile.Id);

        if (userPostLike == null)
        {
            return;
        }

        DbContext.PostLikes.Remove(userPostLike);
        await DbContext.SaveChangesAsync();
    }

    public async Task AddComment(UserPost userPost, PostComment postComment)
    {
        postComment.PostId = userPost.Id;

        await DbContext.PostComments.AddAsync(postComment);
        await DbContext.SaveChangesAsync();
    }

    public async Task<PostComment> GetCommentById(Guid id)
    {
        var comment = await DbContext.PostComments
                                        .Include(pc=>pc.Profile)
                                        .Include(pc=>pc.Post)
                                        .FirstOrDefaultAsync(pc => pc.Id == id);
        return comment!;
    }

    public async Task RemoveComment(UserPost userPost, PostComment postComment)
    {
        var postCommentToRemove = await DbContext.PostComments.FirstOrDefaultAsync(pc => pc.PostId == userPost.Id && pc.Id == postComment.Id);

        if (postCommentToRemove == null)
        {
            return;
        }

        DbContext.PostComments.Remove(postCommentToRemove);
        await DbContext.SaveChangesAsync();
    }
}

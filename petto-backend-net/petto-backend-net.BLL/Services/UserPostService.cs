using AutoMapper;

using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;

using Newtonsoft.Json;

using petto_backend_net.BLL.DTO;
using petto_backend_net.BLL.DTO.UserPost;
using petto_backend_net.BLL.Exceptions;
using petto_backend_net.BLL.Extensions;
using petto_backend_net.BLL.Filtering;
using petto_backend_net.BLL.Interfaces;
using petto_backend_net.DAL.Entities;
using petto_backend_net.DAL.Interfaces;

namespace petto_backend_net.BLL.Services;

public class UserPostService : IUserPostService
{
    private readonly IUserPostRepository _userPostRepository;
    private readonly IPetProfileRepository _petProfileRepository;
    private readonly IPostTaggedPetRepository _postTaggedPetRepository;
    private readonly UserManager<UserProfile> _userManager;
    private readonly IFileService _fileService;
    private readonly IMapper _mapper;

    public UserPostService(
        IUserPostRepository userPostRepository,
        IPetProfileRepository petProfileRepository,
        IPostTaggedPetRepository postTaggedPetRepository,
        UserManager<UserProfile> userManager,
        IFileService fileService,
        IMapper mapper)
    {
        _userPostRepository = userPostRepository;
        _petProfileRepository = petProfileRepository;
        _postTaggedPetRepository = postTaggedPetRepository;
        _userManager = userManager;
        _fileService = fileService;
        _mapper = mapper;
    }

    public async Task<EntitiesWithTotalCount<UserPostReadDto>> GetPosts(UserPostFilteringModel model)
    {
        var query = _userPostRepository
            .GetQuery()
            .OrderByDescending(up => up.CreatedAt)
            .Filter(model);

        var totalCount = query.Count();

        query = query.SortByField(model).Paginate(model);

        var mappedUserPosts = await _mapper.ProjectTo<UserPostReadDto>(query).ToListAsync();

        var result = new EntitiesWithTotalCount<UserPostReadDto>
        {
            Items = mappedUserPosts,
            TotalCount = totalCount
        };
        return result;
    }

    public async Task<UserPostReadDto> GetById(Guid id)
    {
        var userPost = await _userPostRepository.GetByIdWithInclude(
                                       id: id,
                                       include: q => q
                                                     .Include(up => up.Profile)
                                                     .Include(up => up.Comments)
                                                     .Include(up => up.TaggedPets)
                                                     );

        if (userPost == null)
        {
            throw new NotFoundException("Post", id);
        }

        return _mapper.Map<UserPostReadDto>(userPost);
    }

    public async Task<UserPostReadDto> Create(Guid userId, UserPostCreateDto model)
    {
        var user = await _userManager.FindByIdAsync(userId.ToString());
        if (user == null)
        {
            throw new NotFoundException("User", userId);
        }

        // save media files
        var mediaLocations = new List<string>();
        if (model.MediaList != null)
        {
            foreach (var mediaFile in model.MediaList)
            {
                var mediaLocation = await _fileService.SaveFileAsync(mediaFile);
                mediaLocations.Add(mediaLocation);
            }
        }

        // to be able to create post, user must provide at least one of the following: written text, media files
        if (string.IsNullOrWhiteSpace(model.WrittenText) && mediaLocations.Count == 0)
        {
            throw new BadRequestException("You must provide at least one of the following: written text, media files");
        }

        // TODO: check if community exists

        var mediaLocationsJson = JsonConvert.SerializeObject(mediaLocations);

        var userPost = new UserPost
        {
            ProfileId = userId,
            WrittenText = model.WrittenText,
            MediaLocations = mediaLocationsJson,
            CreatedAt = DateTime.UtcNow,
            EditedAt = DateTime.UtcNow
        };

        await _userPostRepository.Add(userPost);


        if (model.TaggedPetsIds != null)
        {
            foreach (var petId in model.TaggedPetsIds)
            {
                var pet = await _petProfileRepository.GetById(petId);
                if (pet == null)
                {
                    throw new NotFoundException("Pet", petId);
                }

                if (pet.OwnerId != userId)
                {
                    throw new BadRequestException("You can tag only your pets");
                }

                var postTaggedPet = new PostTaggedPet
                {
                    PostId = userPost.Id,
                    PetProfileId = petId
                };

                await _postTaggedPetRepository.Add(postTaggedPet);
            }
        }

        userPost = await _userPostRepository.GetByIdWithInclude(
                                                id: userPost.Id,
                                                include: q => q
                                                            .Include(up => up.Profile)
                                                            .Include(up => up.Comments)
                                                            .Include(up => up.TaggedPets)
                                                            );

        return _mapper.Map<UserPostReadDto>(userPost);
    }

    public async Task<EntitiesWithTotalCount<UserPostReadDto>> GetFeed(Guid userId, UserPostFeedFilteringModel model)
    {
        var query = _userPostRepository
            .GetQuery()
            .Include(up => up.Profile)
            .OrderByDescending(up => up.CreatedAt)
            .Where(up => up.Profile.Friends.Any(f => f.Id == userId) || up.ProfileId == userId)
            .Where(up => up.Profile.FriendRequests.Any(frp => 
                                frp.ProfileRequestId == userId || frp.Status == true) || 
                                up.ProfileId == userId);

        var totalCount = query.Count();

        query = query.SortByField(model).Paginate(model);

        var mappedUserPosts = await _mapper.ProjectTo<UserPostReadDto>(query).ToListAsync();

        var result = new EntitiesWithTotalCount<UserPostReadDto>
        {
            Items = mappedUserPosts,
            TotalCount = totalCount
        };
        return result;
    }

    public async Task<bool> Delete(Guid userId, Guid postId)
    {
        var post = await _userPostRepository.GetById(postId);
        if (post == null)
        {
            throw new NotFoundException("Post", postId);
        }

        if (post.ProfileId != userId)
        {
            throw new ForbiddenException("You have no rights for deleting that post!");
        }

        await _userPostRepository.Delete(post);

        return true;
    }

    public async Task<bool> ToggleLike(Guid userId, Guid postId, bool isLike)
    {
        var post = await _userPostRepository.GetByIdWithInclude(
                                            id: postId,
                                            include: q => q
                                                        .Include(up => up.Likes));
        if (post == null)
        {
            throw new NotFoundException("Post", postId);
        }

        var user = await _userManager.FindByIdAsync(userId.ToString());

        var alreadyLiked = post.Likes.Any(l => l.ProfileId == userId);

        if (isLike)
        {
            if (alreadyLiked)
            {
                throw new BadRequestException("You have already liked that post");
            }
            await _userPostRepository.AddLike(post, user);
        }
        else
        {
            if (!alreadyLiked)
            {
                throw new BadRequestException("You have not liked that post yet");
            }
            await _userPostRepository.RemoveLike(post, user);
        }

        return true;
    }

    public async Task<PostCommentReadDto> CreateComment(Guid userId, Guid postId, PostCommentCreateDto model)
    {
        var user = await _userManager.FindByIdAsync(userId.ToString());
        if (user == null)
        {
            throw new NotFoundException("User", userId);
        }

        var post = await _userPostRepository.GetById(postId);
        if (post == null)
        {
            throw new NotFoundException("Post", postId);
        }

        var postComment = new PostComment
        {
            ProfileId = userId,
            PostId = postId,
            WrittenText = model.WrittenText,
            CreatedAt = DateTime.UtcNow,
            EditedAt = DateTime.UtcNow
        };

        await _userPostRepository.AddComment(post, postComment);

        postComment = await _userPostRepository.GetCommentById(postComment.Id);

        return _mapper.Map<PostCommentReadDto>(postComment);
    }

    public async Task<bool> DeleteComment(Guid commentId)
    {
        var comment = await _userPostRepository.GetCommentById(commentId);
        if (comment == null)
        {
            throw new NotFoundException("Comment", commentId);
        }

        await _userPostRepository.RemoveComment(comment.Post, comment);

        return true;
    }
}

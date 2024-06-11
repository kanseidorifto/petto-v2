using AutoMapper;
using Microsoft.EntityFrameworkCore;
using petto_backend_net.BLL.DTO;
using petto_backend_net.BLL.DTO.UserProfile;
using petto_backend_net.BLL.Exceptions;
using petto_backend_net.BLL.Extensions;
using petto_backend_net.BLL.Filtering;
using petto_backend_net.BLL.Interfaces;
using petto_backend_net.DAL.Interfaces;

namespace petto_backend_net.BLL.Services;

public class UserService: IUserService
{
    private readonly IUserProfileRepository _userProfileRepository;
    private readonly IFileService _fileService;
    private readonly IMapper _mapper;

    public UserService(IUserProfileRepository userProfileRepository, IFileService fileService, IMapper mapper)
    {
        _userProfileRepository = userProfileRepository;
        _fileService = fileService;
        _mapper = mapper;
    }

    public async Task<EntitiesWithTotalCount<UserProfileReadDTO>> Get(UserProfileFilteringModel model)
    {
        var query= _userProfileRepository.GetQuery().Filter(model);

        var totalCount = query.Count();

        query = query.SortByField(model).Paginate(model);

        var mapperUserProfiles = await _mapper.ProjectTo<UserProfileReadDTO>(query).ToListAsync();

        var result = new EntitiesWithTotalCount<UserProfileReadDTO>
        {
            Items = mapperUserProfiles,
            TotalCount = totalCount
        };

        return result;
    }

    public async Task<UserProfileDetailsDTO> GetById(Guid id)
    {
        var user = await _userProfileRepository.GetByIdWithInclude(
                                                id:id,
                                                include: q => q
                                                               .Include(up=>up.Friends)
                                                               .Include(up => up.Pets)
                                                               .Include(up => up.Communities)
                                                               );

        if (user == null)
        {
            throw new NotFoundException("User", id);
        }

        return _mapper.Map<UserProfileDetailsDTO>(user);
    }

    public async Task<UserProfileReadDTO> Update(Guid id, UserProfileUpdateDTO model)
    {
        var user = await _userProfileRepository.GetById(id);
        if (user == null)
        {
            throw new NotFoundException("User", id);
        }

        if (model.AvatarMedia != null)
        {
            if (!model.AvatarMedia.ContentType.StartsWith("image/"))
            {
                throw new BadRequestException("Invalid file type. Only images are allowed.");
            }
            if (model.AvatarMedia.Length == 0)
            {
                throw new BadRequestException("Avatar file is empty");
            }
            var avatarUrl = await _fileService.SaveFileAsync(model.AvatarMedia);
            user.AvatarUrl = avatarUrl;
        }

        if (model.CoverMedia != null)
        {
            if (!model.CoverMedia.ContentType.StartsWith("image/"))
            {
                throw new BadRequestException("Invalid file type. Only images are allowed.");
            }
            if (model.CoverMedia.Length == 0)
            {
                throw new BadRequestException("Cover file is empty");
            }
            var coverUrl = await _fileService.SaveFileAsync(model.CoverMedia);
            user.CoverUrl = coverUrl;
        }

        _mapper.Map(model, user);

        user = await _userProfileRepository.Update(user);

        return _mapper.Map<UserProfileReadDTO>(user);
    }
}

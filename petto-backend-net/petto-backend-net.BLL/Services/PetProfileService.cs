using AutoMapper;
using Microsoft.EntityFrameworkCore;
using petto_backend_net.BLL.DTO;
using petto_backend_net.BLL.DTO.PetProfile;
using petto_backend_net.BLL.Exceptions;
using petto_backend_net.BLL.Extensions;
using petto_backend_net.BLL.Filtering;
using petto_backend_net.BLL.Interfaces;
using petto_backend_net.DAL.Entities;
using petto_backend_net.DAL.Interfaces;

namespace petto_backend_net.BLL.Services;

public class PetProfileService : IPetProfileService
{
    private readonly IPetProfileRepository _petProfileRepository;
    private readonly IUserProfileRepository _userProfileRepository;
    private readonly IFileService _fileService;
    private readonly IMapper _mapper;

    public PetProfileService(IPetProfileRepository petProfileRepository, IUserProfileRepository userProfileRepository, IFileService fileService, IMapper mapper)
    {
        _petProfileRepository = petProfileRepository;
        _userProfileRepository = userProfileRepository;
        _fileService = fileService;
        _mapper = mapper;
    }

    public async Task<EntitiesWithTotalCount<PetProfileReadDTO>> GetUserPets(Guid ownerId, PetProfileFilteringModel model)
    {
        var query = _petProfileRepository
                .GetQuery(
                       filter: pp => pp.OwnerId == ownerId,
                       include: q => q
                                      .Include(pp => pp.Owner))
                .OrderByDescending(up => up.CreatedAt)
                .AsQueryable();
                
        var totalCount = query.Count();

        query = query.SortByField(model).Paginate(model);

        var mappedUserPets = await _mapper.ProjectTo<PetProfileReadDTO>(query).ToListAsync();

        var result = new EntitiesWithTotalCount<PetProfileReadDTO>
        {
            Items = mappedUserPets,
            TotalCount = totalCount
        };

        return result;
    }

    public async Task<PetProfileReadDTO> GetById(Guid id)
    {
        var petProfile = await _petProfileRepository.GetByIdWithInclude(
                       id,
                       include: q => q
                                      .Include(pp => pp.Owner));

        if (petProfile == null)
        {
            throw new NotFoundException("Pet", id);
        }

        return _mapper.Map<PetProfileReadDTO>(petProfile);
    }

    public async Task<PetProfileReadDTO> Create(Guid ownerId, PetProfileCreateDTO model)
    {
        var owner = await _userProfileRepository.GetById(ownerId);

        if (owner == null)
        {
            throw new NotFoundException("User", ownerId);
        }

        var petProfile = _mapper.Map<PetProfile>(model);
        
        petProfile.OwnerId = ownerId;
        
        
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
            petProfile.AvatarUrl = avatarUrl;
        }

        petProfile.CreatedAt = DateTime.UtcNow;
        petProfile.EditedAt = DateTime.UtcNow;

        await _petProfileRepository.Add(petProfile);

        petProfile = await _petProfileRepository.GetByIdWithInclude(
                                             petProfile.Id,
                                             include: q => q
                                                            .Include(pp => pp.Owner));

        return _mapper.Map<PetProfileReadDTO>(petProfile);
    }

    public async Task<PetProfileReadDTO> Update(Guid ownerId, Guid id, PetProfileUpdateDTO model)
    {
        var petProfile = await _petProfileRepository.GetById(id);

        if (petProfile == null)
        {
            throw new NotFoundException("Pet", id);
        }

        if (petProfile.OwnerId != ownerId)
        {
            throw new ForbiddenException("You have no rights for editing that pet!");
        }

        _mapper.Map(model, petProfile);

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
            petProfile.AvatarUrl = avatarUrl;
        }

        petProfile.EditedAt = DateTime.UtcNow;

        await _petProfileRepository.Update(petProfile);

        petProfile = await _petProfileRepository.GetByIdWithInclude(
                                  id,
                                  include: q => q
                                                 .Include(pp => pp.Owner));

        return _mapper.Map<PetProfileReadDTO>(petProfile);
    }
    public async Task<bool> Delete(Guid ownerId, Guid id)
    {
        var petProfile = await _petProfileRepository.GetById(id);

        if (petProfile == null)
        {
            throw new NotFoundException("Pet", id);
        }

        if (petProfile.OwnerId != ownerId)
        {
            throw new ForbiddenException("You have no rights for deleting that pet!");
        }

        await _petProfileRepository.Delete(petProfile);

        return true;
    }
}

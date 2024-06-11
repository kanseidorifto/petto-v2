using AutoMapper;

using Microsoft.EntityFrameworkCore;

using petto_backend_net.BLL.DTO;
using petto_backend_net.BLL.DTO.UserFriendship;
using petto_backend_net.BLL.Exceptions;
using petto_backend_net.BLL.Extensions;
using petto_backend_net.BLL.Filtering;
using petto_backend_net.BLL.Interfaces;
using petto_backend_net.DAL.Entities;
using petto_backend_net.DAL.Interfaces;

namespace petto_backend_net.BLL.Services;

public class UserFriendshipService : IUserFriendshipService
{
    private readonly IUserFriendshipRepository _userFriendshipRepository;
    private readonly IUserProfileRepository _userProfileRepository;
    private readonly IMapper _mapper;

    public UserFriendshipService(IUserFriendshipRepository userFriendshipRepository, IUserProfileRepository userProfileRepository, IMapper mapper)
    {
        _userFriendshipRepository = userFriendshipRepository;
        _userProfileRepository = userProfileRepository;
        _mapper = mapper;
    }

    public async Task<EntitiesWithTotalCount<UserFriendshipReadDTO>> GetUserFriends(Guid profileId, UserFriendshipFilteringModel model)
    {
        var query = _userFriendshipRepository.GetQuery(
            filter: uf => (uf.ProfileRequestId == profileId || uf.ProfileAcceptId == profileId) && uf.Status == true,
            include: q => q
                .Include(uf => uf.ProfileAccept)
                .Include(uf => uf.ProfileRequest))
            .OrderByDescending(up => up.CreatedAt)
            .AsQueryable();

        var totalCount = query.Count();

        query = query.SortByField(model).Paginate(model);

        var mappedUserFriendships = await _mapper.ProjectTo<UserFriendshipReadDTO>(query).ToListAsync();

        var result = new EntitiesWithTotalCount<UserFriendshipReadDTO>
        {
            Items = mappedUserFriendships,
            TotalCount = totalCount
        };

        return result;
    }

    public async Task<EntitiesWithTotalCount<UserFriendshipReadDTO>> GetUserFriendshipRequests(Guid profileId, UserFriendshipRequestsFilteringModel model)
    {
        var query = _userFriendshipRepository.GetQuery(
            filter: uf =>
                        (model.Direction && uf.ProfileRequestId == profileId ||
                        !model.Direction && uf.ProfileAcceptId == profileId) &&
                        uf.Status == false,
            include: q => q
                .Include(uf => uf.ProfileAccept)
                .Include(uf => uf.ProfileRequest))
            .OrderByDescending(up => up.CreatedAt)
            .AsQueryable();

        var totalCount = query.Count();

        query = query.SortByField(model).Paginate(model);

        var mappedUserFriendships = await _mapper.ProjectTo<UserFriendshipReadDTO>(query).ToListAsync();

        var result = new EntitiesWithTotalCount<UserFriendshipReadDTO>
        {
            Items = mappedUserFriendships,
            TotalCount = totalCount
        };

        return result;
    }

    public async Task<UserFriendshipReadDTO> CreateUserFriendship(UserFriendshipCreateDTO model)
    {
        var userRequest = await _userProfileRepository.GetById(model.ProfileRequestId);
        var userAccept = await _userProfileRepository.GetById(model.ProfileAcceptId);

        if (userRequest == null)
        {
            throw new NotFoundException("User", model.ProfileRequestId);
        }

        if (userAccept == null)
        {
            throw new NotFoundException("User", model.ProfileAcceptId);
        }

        var userFriendship = _mapper.Map<UserFriendship>(model);

        var existingUserFriendship = await _userFriendshipRepository.GetQuery(
                       filter: uf => (uf.ProfileRequestId == userFriendship.ProfileRequestId && uf.ProfileAcceptId == userFriendship.ProfileAcceptId) ||
                                     (uf.ProfileRequestId == userFriendship.ProfileAcceptId && uf.ProfileAcceptId == userFriendship.ProfileRequestId))
            .FirstOrDefaultAsync();

        if (existingUserFriendship != null)
        {
            if (existingUserFriendship.Status)
            {
                throw new BadRequestException("Friendship already exists");
            }
            else
            {
                if (existingUserFriendship.ProfileAcceptId == userFriendship.ProfileRequestId)
                {
                    existingUserFriendship.Status = true;
                    await _userFriendshipRepository.Update(existingUserFriendship);

                    existingUserFriendship = await _userFriendshipRepository.GetByIdWithInclude(
                                                                     [existingUserFriendship.ProfileRequestId, existingUserFriendship.ProfileAcceptId],
                                                                     include: q => q
                                                                                    .Include(uf => uf.ProfileAccept)
                                                                                    .Include(uf => uf.ProfileRequest));

                    return _mapper.Map<UserFriendshipReadDTO>(existingUserFriendship);
                }
            }
        }

        userFriendship.Status = false;
        userFriendship.CreatedAt = DateTime.UtcNow;
        userFriendship.EditedAt = DateTime.UtcNow;

        await _userFriendshipRepository.Add(userFriendship);

        userFriendship = await _userFriendshipRepository.GetByIdWithInclude(
                                  [model.ProfileRequestId, model.ProfileAcceptId],
                                  include: q => q
                                                 .Include(uf => uf.ProfileAccept)
                                                 .Include(uf => uf.ProfileRequest));

        return _mapper.Map<UserFriendshipReadDTO>(userFriendship);
    }

    public async Task<UserFriendshipReadDTO> UpdateUserFriendship(UserFriendshipUpdateDTO model)
    {
        var userFriendship = await _userFriendshipRepository.GetById(
                       [model.ProfileRequestId, model.ProfileAcceptId]);

        if (userFriendship == null)
        {
            throw new NotFoundException("UserFriendship", $"{model.ProfileRequestId}, {model.ProfileAcceptId}");
        }

        userFriendship.Status = model.Status;
        userFriendship.EditedAt = DateTime.UtcNow;

        await _userFriendshipRepository.Update(userFriendship);

        userFriendship = await _userFriendshipRepository.GetByIdWithInclude(
                       [model.ProfileRequestId, model.ProfileAcceptId],
                       include: q => q
                                     .Include(uf => uf.ProfileAccept)
                                     .Include(uf => uf.ProfileRequest));

        return _mapper.Map<UserFriendshipReadDTO>(userFriendship);
    }

    public async Task<bool> DeleteUserFriendship(UserFriendshipDeleteDTO model)
    {
        var userFriendship = await _userFriendshipRepository.GetQuery(
                                  filter: uf => (uf.ProfileRequestId == model.Profile1Id && uf.ProfileAcceptId == model.Profile2Id) ||
                                                (uf.ProfileRequestId == model.Profile2Id && uf.ProfileAcceptId == model.Profile1Id))
            .FirstOrDefaultAsync();

        if (userFriendship == null)
        {
            throw new NotFoundException("UserFriendship", $"({model.Profile1Id}, {model.Profile2Id})");
        }

        await _userFriendshipRepository.Delete(userFriendship);

        return true;
    }
}

using petto_backend_net.BLL.DTO.UserFriendship;
using petto_backend_net.BLL.DTO;
using petto_backend_net.BLL.Filtering;

namespace petto_backend_net.BLL.Interfaces;

public interface IUserFriendshipService
{
    Task<EntitiesWithTotalCount<UserFriendshipReadDTO>> GetUserFriends(Guid profileId, UserFriendshipFilteringModel model);
    Task<EntitiesWithTotalCount<UserFriendshipReadDTO>> GetUserFriendshipRequests(Guid profileId, UserFriendshipRequestsFilteringModel model);
    Task<UserFriendshipReadDTO> CreateUserFriendship(UserFriendshipCreateDTO model);
    Task<UserFriendshipReadDTO> UpdateUserFriendship(UserFriendshipUpdateDTO model);
    Task<bool> DeleteUserFriendship(UserFriendshipDeleteDTO model);
}

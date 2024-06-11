using petto_backend_net.BLL.DTO;
using petto_backend_net.BLL.DTO.UserProfile;
using petto_backend_net.BLL.Filtering;

namespace petto_backend_net.BLL.Interfaces;

public interface IUserService
{
    Task<EntitiesWithTotalCount<UserProfileReadDTO>> Get(UserProfileFilteringModel model);
    Task<UserProfileDetailsDTO> GetById(Guid id);
    Task<UserProfileReadDTO> Update(Guid id, UserProfileUpdateDTO model);
}

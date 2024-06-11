using petto_backend_net.BLL.DTO;
using petto_backend_net.BLL.Filtering;
using petto_backend_net.BLL.DTO.PetProfile;

namespace petto_backend_net.BLL.Interfaces;

public interface IPetProfileService
{
    Task<EntitiesWithTotalCount<PetProfileReadDTO>> GetUserPets(Guid ownerId, PetProfileFilteringModel model);
    Task<PetProfileReadDTO> GetById(Guid id);
    Task<PetProfileReadDTO> Create(Guid ownerId, PetProfileCreateDTO model);
    Task<PetProfileReadDTO> Update(Guid ownerId, Guid id, PetProfileUpdateDTO model);
    Task<bool> Delete(Guid ownerId, Guid id);
}

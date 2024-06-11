using petto_backend_net.DAL.Entities;
using petto_backend_net.DAL.Interfaces;

namespace petto_backend_net.DAL.Repositories;

public class PetProfileRepository(AppDbContext dbContext): GenericRepository<PetProfile, Guid>(dbContext), IPetProfileRepository
{
}

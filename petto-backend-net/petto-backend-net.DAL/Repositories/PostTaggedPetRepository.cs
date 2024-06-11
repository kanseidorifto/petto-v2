using petto_backend_net.DAL.Entities;
using petto_backend_net.DAL.Interfaces;

namespace petto_backend_net.DAL.Repositories;

public class PostTaggedPetRepository(AppDbContext dbContext) : GenericRepository<PostTaggedPet, Guid>(dbContext), IPostTaggedPetRepository
{
}

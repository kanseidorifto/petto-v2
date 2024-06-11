using petto_backend_net.BLL.Interfaces;
using petto_backend_net.DAL.Entities;

namespace petto_backend_net.BLL.Filtering;

public class UserPostFilteringModel : BaseFilteringModel<UserPost>, IFilter<UserPost>
{
    public Guid? ProfileId { get; set; }
    public Guid? PetProfileId { get; set; }

    public IQueryable<UserPost> Filter(IQueryable<UserPost> source)
    {
        if (ProfileId.HasValue)
        {
            source = source.Where(up => up.ProfileId == ProfileId);
        }

        if (PetProfileId.HasValue)
        {
            source = source.Where(up => up.TaggedPets.Any(tp => tp.Id == PetProfileId));
        }

        return source;
    }
}
using petto_backend_net.BLL.Interfaces;
using petto_backend_net.DAL.Entities;

namespace petto_backend_net.BLL.Filtering;

public class PetProfileFilteringModel : BaseFilteringModel<PetProfile>, IFilter<PetProfile>
{
    public string? Search { get; set; }

    public IQueryable<PetProfile> Filter(IQueryable<PetProfile> source)
    {
        if (!string.IsNullOrEmpty(Search))
        {
            var _search = Search.ToLower();
            source = source.Where(
                x => x.GivenName.ToLower().Contains(_search));
        }

        return source;
    }
}

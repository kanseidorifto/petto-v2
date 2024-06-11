using petto_backend_net.BLL.Interfaces;
using petto_backend_net.DAL.Entities;

namespace petto_backend_net.BLL.Filtering;

public class UserProfileFilteringModel : BaseFilteringModel<UserProfile>, IFilter<UserProfile>
{
    public string? Search { get; set; }

    public IQueryable<UserProfile> Filter(IQueryable<UserProfile> source)
    {
        if (!string.IsNullOrEmpty(Search))
        {
            var _search = Search.ToLower();
            source = source.Where(
                x => x.GivenName.ToLower().Contains(_search) || 
                x.Surname.ToLower().Contains(_search) || 
                (x.GivenName.ToLower() + ' ' + x.Surname.ToLower()).Contains(_search));
        }

        return source;
    }
}

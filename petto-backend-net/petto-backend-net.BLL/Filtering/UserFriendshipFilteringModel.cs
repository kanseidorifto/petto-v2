using petto_backend_net.BLL.Interfaces;
using petto_backend_net.DAL.Entities;

namespace petto_backend_net.BLL.Filtering;

public class UserFriendshipFilteringModel : BaseFilteringModel<UserFriendship>, IFilter<UserFriendship>
{
    public string? Search { get; set; }

    public IQueryable<UserFriendship> Filter(IQueryable<UserFriendship> source)
    {
        if (!string.IsNullOrEmpty(Search))
        {
            var _search = Search.ToLower();
            source = source.Where(
                x => (x.ProfileRequest.GivenName.ToLower().Contains(_search) ||
                x.ProfileRequest.Surname.ToLower().Contains(_search) ||
                (x.ProfileRequest.GivenName.ToLower() + ' ' + x.ProfileRequest.Surname.ToLower()).Contains(_search))
                ||
                x.ProfileAccept.GivenName.ToLower().Contains(_search) ||
                x.ProfileAccept.Surname.ToLower().Contains(_search) ||
                (x.ProfileAccept.GivenName.ToLower() + ' ' + x.ProfileAccept.Surname.ToLower()).Contains(_search));
        }

        return source;
    }
}

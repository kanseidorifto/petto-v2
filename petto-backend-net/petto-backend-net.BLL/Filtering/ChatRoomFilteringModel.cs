using petto_backend_net.BLL.Interfaces;
using petto_backend_net.DAL.Entities;

namespace petto_backend_net.BLL.Filtering;

public class ChatRoomFilteringModel : BaseFilteringModel<ChatRoom>, IFilter<ChatRoom>
{
    public string? Search { get; set; }

    public IQueryable<ChatRoom> Filter(IQueryable<ChatRoom> source)
    {
        if (!string.IsNullOrWhiteSpace(Search))
        {
            source = source.Where(cr => 
                        cr.Title != null && cr.Title.Contains(Search) 
                        || cr.Participants.Any(p => $"{p.Profile.GivenName} {p.Profile.Surname}".Contains(Search)));
        }

        return source;
    }
}

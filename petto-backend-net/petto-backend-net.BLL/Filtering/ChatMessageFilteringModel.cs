
using petto_backend_net.BLL.Interfaces;
using petto_backend_net.DAL.Entities;

namespace petto_backend_net.BLL.Filtering;

public class ChatMessageFilteringModel : BaseFilteringModel<ChatMessage>, IFilter<ChatMessage>
{
    public string? Search { get; set; }

    public IQueryable<ChatMessage> Filter(IQueryable<ChatMessage> source)
    {
        if (!string.IsNullOrWhiteSpace(Search))
        {
            source = source.Where(cm => cm.MessageText != null && cm.MessageText.Contains(Search));
        }

        return source;
    }
}

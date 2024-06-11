namespace petto_backend_net.BLL.DTO;

public class EntitiesWithTotalCount<T> where T : class
{
    public IEnumerable<T> Items { get; set; } = null!;
    public int TotalCount { get; set; }
}

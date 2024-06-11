namespace petto_backend_net.BLL.Interfaces;

public interface IFilter<T> where T : class
{
    IQueryable<T> Filter(IQueryable<T> source);
}

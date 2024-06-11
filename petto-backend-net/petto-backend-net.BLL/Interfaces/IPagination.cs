namespace petto_backend_net.BLL.Interfaces;

public interface IPaginate<T> where T : class
{
    IQueryable<T> Paginate(IQueryable<T> source);
}

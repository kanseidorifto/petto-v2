namespace petto_backend_net.BLL.Interfaces;

public interface ISort<T> where T : class
{
    IQueryable<T> Sort(IQueryable<T> source);
}

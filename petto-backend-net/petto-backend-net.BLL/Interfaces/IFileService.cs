using Microsoft.AspNetCore.Http;

namespace petto_backend_net.BLL.Interfaces;

public interface IFileService
{
    Task<string> SaveFileAsync(IFormFile file);

}
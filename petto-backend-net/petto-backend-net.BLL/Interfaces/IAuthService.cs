using petto_backend_net.BLL.DTO.Auth;

namespace petto_backend_net.BLL.Interfaces;

public interface IAuthService
{
    Task<UserDataReadDTO> Login(LoginDTO model);
    Task<UserDataReadDTO> Register(RegisterDTO model);
}

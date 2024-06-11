using Microsoft.AspNetCore.Mvc;
using petto_backend_net.BLL.DTO.Auth;
using petto_backend_net.BLL.Exceptions;
using petto_backend_net.BLL.Interfaces;

namespace petto_backend_net.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AuthController : ControllerBase
    {
        private readonly IAuthService _authService;

        public AuthController(IAuthService authService)
        {
            _authService = authService;
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] LoginDTO model)
        {
            try
            {
                var user = await _authService.Login(model);
                return Ok(user);
            }
            catch (BadRequestException err)
            {
                return BadRequest(err.Message);
            }

        }

        [HttpPost("register")]
        public async Task<IActionResult> Register([FromBody] RegisterDTO model)
        {
            try
            {
                var user = await _authService.Register(model);
                return Ok(user);
            }
            catch (BadRequestException err)
            {
                return BadRequest(err.Message);
            }
        }
    }
}

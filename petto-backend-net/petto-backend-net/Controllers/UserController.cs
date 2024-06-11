using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using petto_backend_net.Helpers;
using petto_backend_net.BLL.DTO.UserProfile;
using petto_backend_net.BLL.Exceptions;
using petto_backend_net.BLL.Filtering;
using petto_backend_net.BLL.Interfaces;
using petto_backend_net.BLL.DTO;

namespace petto_backend_net.Controllers
{
    [Route("api/[controller]")]
    [Authorize]
    [ApiController]
    public class UserController : ControllerBase
    {
        private readonly IUserService _userService;

        public UserController(IUserService userService)
        {
            _userService = userService;
        }

        [HttpGet]
        public async Task<IActionResult> Get([FromQuery] UserProfileFilteringModel model)
        {
            try
            {
                var users = await _userService.Get(model);
                return Ok(users);
            }
            catch (BadRequestException err)
            {
                return BadRequest(err.Message);
            }
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(Guid id)
        {
            try
            {
                var user = await _userService.GetById(id);
                return Ok(user);
            }
            catch (BadRequestException err)
            {
                return BadRequest(err.Message);
            }
            catch (NotFoundException err)
            {
                return NotFound(err.Message);
            }
        }

        [HttpGet("me")]
        public async Task<IActionResult> GetMe()
        {
            try
            {
                var currentUserId = GetUserId.GetUserIdFromClaims(User);

                var user = await _userService.GetById(currentUserId);
                return Ok(user);
            }
            catch (BadRequestException err)
            {
                return BadRequest(err.Message);
            }
            catch (NotFoundException err)
            {
                return NotFound(err.Message);
            }
            catch (ForbiddenException err)
            {
                return Forbid(err.Message);
            }
        }

        [HttpPut("me")]
        [Consumes("multipart/form-data")]
        public async Task<IActionResult> UpdateMe([FromForm] UserProfileUpdateDTO model)
        {
            try
            {
                var currentUserId = GetUserId.GetUserIdFromClaims(User);

                var user = await _userService.Update(currentUserId, model);
                return Ok(user);
            }
            catch (BadRequestException err)
            {
                return BadRequest(err.Message);
            }
            catch (NotFoundException err)
            {
                return NotFound(err.Message);
            }
            catch (ForbiddenException err)
            {
                return Forbid(err.Message);
            }
        }
    }
}

using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using petto_backend_net.BLL.DTO.UserFriendship;
using petto_backend_net.BLL.Exceptions;
using petto_backend_net.BLL.Filtering;
using petto_backend_net.BLL.Interfaces;
using petto_backend_net.Helpers;

namespace petto_backend_net.Controllers
{
    [Route("api/[controller]")]
    [Authorize]
    [ApiController]
    public class UserFriendshipController : ControllerBase
    {
        private readonly IUserFriendshipService _userFriendshipService;

        public UserFriendshipController(IUserFriendshipService userFriendshipService)
        {
            _userFriendshipService = userFriendshipService;
        }

        [HttpGet]
        public async Task<IActionResult> GetUserFriends([FromQuery] UserFriendshipFilteringModel model)
        {
            try
            {
                var currentUserId = GetUserId.GetUserIdFromClaims(User);

                var userFriends = await _userFriendshipService.GetUserFriends(currentUserId, model);
                return Ok(userFriends);
            }
            catch (NotFoundException err)
            {
                return NotFound(err.Message);
            }
        }

        [HttpGet("requests")]
        public async Task<IActionResult> GetUserFriendshipRequests([FromQuery] UserFriendshipRequestsFilteringModel model)
        {
            try
            {
                var currentUserId = GetUserId.GetUserIdFromClaims(User);

                var userFriendshipRequests = await _userFriendshipService.GetUserFriendshipRequests(currentUserId, model);
                return Ok(userFriendshipRequests);
            }
            catch (NotFoundException err)
            {
                return NotFound(err.Message);
            }
        }

        [HttpPost("requests")]
        public async Task<IActionResult> SendUserFriendship([FromQuery] Guid profileAcceptId)
        {
            try
            {
                var currentUserId = GetUserId.GetUserIdFromClaims(User);

                var model = new UserFriendshipCreateDTO
                {
                    ProfileRequestId = currentUserId,
                    ProfileAcceptId = profileAcceptId
                };

                var userFriendship = await _userFriendshipService.CreateUserFriendship(model);
                return Ok(userFriendship);
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

        [HttpPatch("requests")]
        public async Task<IActionResult> AcceptUserFriendship([FromQuery] Guid profileRequestId)
        {
            try
            {
                var currentUserId = GetUserId.GetUserIdFromClaims(User);

                var model = new UserFriendshipUpdateDTO
                {
                    ProfileRequestId = profileRequestId,
                    ProfileAcceptId = currentUserId,
                    Status = true
                };

                var userFriendship = await _userFriendshipService.UpdateUserFriendship(model);
                return Ok(userFriendship);
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

        [HttpDelete("requests")]
        public async Task<IActionResult> DeleteUserFriendship([FromQuery] Guid profileId)
        {
            try
            {
                var currentUserId = GetUserId.GetUserIdFromClaims(User);

                var model = new UserFriendshipDeleteDTO
                {
                    Profile1Id = currentUserId,
                    Profile2Id = profileId
                };

                var result = await _userFriendshipService.DeleteUserFriendship(model);
                return Ok(result);
            }
            catch (NotFoundException err)
            {
                return NotFound(err.Message);
            }
        }
    }
}

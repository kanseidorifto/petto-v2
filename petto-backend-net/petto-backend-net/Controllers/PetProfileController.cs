using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using petto_backend_net.BLL.DTO.PetProfile;
using petto_backend_net.BLL.Exceptions;
using petto_backend_net.BLL.Filtering;
using petto_backend_net.BLL.Interfaces;
using petto_backend_net.Helpers;


namespace petto_backend_net.Controllers
{
    [Route("api/[controller]")]
    [Authorize]
    [ApiController]
    public class PetProfileController : ControllerBase
    {
        private readonly IPetProfileService _petProfileService;

        public PetProfileController(IPetProfileService petProfileService)
        {
            _petProfileService = petProfileService;
        }

        [HttpGet]
        public async Task<IActionResult> GetUserPets(Guid ownerId, [FromQuery] PetProfileFilteringModel model)
        {
            try
            {
                var userPets = await _petProfileService.GetUserPets(ownerId, model);

                return Ok(userPets);
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
        public async Task<IActionResult> GetMyPets([FromQuery] PetProfileFilteringModel model)
        {
            try
            {
                var currentUserId = GetUserId.GetUserIdFromClaims(User);

                var userPets = await _petProfileService.GetUserPets(currentUserId, model);

                return Ok(userPets);
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

        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(Guid id)
        {
            try
            {
                var petProfile = await _petProfileService.GetById(id);

                return Ok(petProfile);
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

        [HttpPost]
        public async Task<IActionResult> Create([FromForm] PetProfileCreateDTO model)
        {
            try
            {
                var currentUserId = GetUserId.GetUserIdFromClaims(User);

                var petProfile = await _petProfileService.Create(currentUserId, model);

                return Ok(petProfile);
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

        [HttpPatch("{id}")]
        public async Task<IActionResult> Update(Guid id, [FromForm] PetProfileUpdateDTO model)
        {
            try
            {
                var currentUserId = GetUserId.GetUserIdFromClaims(User);

                var petProfile = await _petProfileService.Update(currentUserId, id, model);

                return Ok(petProfile);
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

        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(Guid id)
        {
            try
            {
                var currentUserId = GetUserId.GetUserIdFromClaims(User);

                var result = await _petProfileService.Delete(currentUserId, id);

                return Ok(result);
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

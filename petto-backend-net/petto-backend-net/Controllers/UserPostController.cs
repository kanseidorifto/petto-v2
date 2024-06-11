using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

using petto_backend_net.BLL.DTO.UserPost;
using petto_backend_net.BLL.Filtering;
using petto_backend_net.BLL.Interfaces;
using petto_backend_net.Helpers;

namespace petto_backend_net.Controllers;
[Route("api/[controller]")]
[Authorize]
[ApiController]
public class UserPostController : ControllerBase
{
    private readonly IUserPostService _userPostService;

    public UserPostController(IUserPostService userPostService)
    {
        _userPostService = userPostService;
    }

    [HttpGet]
    public async Task<IActionResult> GetPosts([FromQuery] UserPostFilteringModel model)
    {
        var posts = await _userPostService.GetPosts(model);
        return Ok(posts);
    }

    [HttpGet("feed")]
    public async Task<IActionResult> GetFeed([FromQuery] UserPostFeedFilteringModel model)
    {
        var currentUserId = GetUserId.GetUserIdFromClaims(User);

        var posts = await _userPostService.GetFeed(currentUserId, model);
        return Ok(posts);
    }

    [HttpGet("{id}")]
    public async Task<IActionResult> GetById(Guid id)
    {
        var post = await _userPostService.GetById(id);
        return Ok(post);
    }

    [HttpPost]
    public async Task<IActionResult> Create([FromForm] UserPostCreateDto model)
    {
        var currentUserId = GetUserId.GetUserIdFromClaims(User);

        var post = await _userPostService.Create(currentUserId, model);
        return Ok(post);
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(Guid id)
    {
        var currentUserId = GetUserId.GetUserIdFromClaims(User);

        var isDeleted = await _userPostService.Delete(currentUserId, id);
        return Ok(isDeleted);
    }

    [HttpPost("{id}/like")]
    public async Task<IActionResult> ToggleLike(Guid id)
    {
        var currentUserId = GetUserId.GetUserIdFromClaims(User);

        var isToggled = await _userPostService.ToggleLike(currentUserId, id, true);
        return Ok(isToggled);
    }

    [HttpDelete("{id}/like")]
    public async Task<IActionResult> ToggleDislike(Guid id)
    {
        var currentUserId = GetUserId.GetUserIdFromClaims(User);

        var isToggled = await _userPostService.ToggleLike(currentUserId, id, false);
        return Ok(isToggled);
    }

    [HttpPost("{id}/comment")]
    public async Task<IActionResult> CreateComment(Guid id, [FromBody] PostCommentCreateDto model)
    {
        var currentUserId = GetUserId.GetUserIdFromClaims(User);

        var comment = await _userPostService.CreateComment(currentUserId, id, model);
        return Ok(comment);
    }

    [HttpDelete("comment/{id}")]
    public async Task<IActionResult> DeleteComment(Guid id)
    {
        var isDeleted = await _userPostService.DeleteComment(id);
        return Ok(isDeleted);
    }
}

using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.SignalR;

using petto_backend_net.BLL.DTO;
using petto_backend_net.BLL.DTO.Chat;
using petto_backend_net.BLL.Filtering;
using petto_backend_net.BLL.Interfaces;
using petto_backend_net.Helpers;
using petto_backend_net.Hubs;

namespace petto_backend_net.Controllers;

[Route("api/[controller]")]
[Authorize]
[ApiController]
public class ChatController : ControllerBase
{
    private readonly IChatService _chatService;
    private readonly IHubContext<ChatHub, IChatHub> _chatHubContext;

    public ChatController(
        IChatService chatService,
        IHubContext<ChatHub, IChatHub> chatHubContext)
    {
        _chatService = chatService;
        _chatHubContext = chatHubContext;
    }

    [HttpGet]
    public async Task<ActionResult<EntitiesWithTotalCount<ChatRoomPreviewDTO>>> GetChatRooms([FromQuery] ChatRoomFilteringModel model)
    {
        var currentUserId = GetUserId.GetUserIdFromClaims(User);

        var chatRooms = await _chatService.GetChatRooms(currentUserId, model);
        return Ok(chatRooms);
    }

    [HttpGet("{chatRoomId}")]
    public async Task<ActionResult<ChatRoomDetailsDTO>> GetChatRoom(Guid chatRoomId)
    {
        var currentUserId = GetUserId.GetUserIdFromClaims(User);

        var chatRoom = await _chatService.GetChatRoom(currentUserId, chatRoomId);
        return Ok(chatRoom);
    }

    [HttpGet("{chatRoomId}/messages")]
    public async Task<ActionResult<EntitiesWithTotalCount<ChatMessageReadDTO>>> GetChatRoomMessages(Guid chatRoomId, [FromQuery] ChatMessageFilteringModel model)
    {
        var currentUserId = GetUserId.GetUserIdFromClaims(User);

        var messages = await _chatService.GetChatRoomMessages(currentUserId, chatRoomId, model);
        return Ok(messages);
    }

    [HttpDelete("{chatRoomId}")]
    public async Task<ActionResult<bool>> DeleteChatRoom(Guid chatRoomId)
    {
        var currentUserId = GetUserId.GetUserIdFromClaims(User);

        var isDeleted = await _chatService.DeleteChatRoom(currentUserId, chatRoomId);
        return Ok(isDeleted);
    }

    [HttpPost("{chatRoomId}/participants")]
    public async Task<ActionResult<bool>> AddParticipant(Guid chatRoomId, [FromQuery] Guid participantId)
    {
        var currentUserId = GetUserId.GetUserIdFromClaims(User);

        var isAdded = await _chatService.AddParticipant(currentUserId, chatRoomId, participantId);
        return Ok(isAdded);
    }

    [HttpDelete("{chatRoomId}/participants")]
    public async Task<ActionResult<bool>> RemoveParticipant(Guid chatRoomId, [FromQuery] Guid participantId)
    {
        var currentUserId = GetUserId.GetUserIdFromClaims(User);

        var isRemoved = await _chatService.RemoveParticipant(currentUserId, chatRoomId, participantId);
        return Ok(isRemoved);
    }

    [HttpDelete("{chatRoomId}/leave")]
    public async Task<ActionResult<bool>> LeaveChatRoom(Guid chatRoomId)
    {
        var currentUserId = GetUserId.GetUserIdFromClaims(User);

        var isLeft = await _chatService.LeaveChatRoom(currentUserId, chatRoomId);
        return Ok(isLeft);
    }

    [HttpPost("group")]
    public async Task<ActionResult<ChatRoomDetailsDTO>> CreateGroupChatRoom([FromForm] ChatRoomGroupCreateDTO model)
    {
        var currentUserId = GetUserId.GetUserIdFromClaims(User);

        var chatRoom = await _chatService.CreateGroupChatRoom(currentUserId, model);
        return Ok(chatRoom);
    }

    [HttpPut("group/{chatRoomId}")]
    public async Task<ActionResult<ChatRoomDetailsDTO>> UpdateGroupChatRoom(Guid chatRoomId, [FromForm] ChatRoomGroupUpdateDTO model)
    {
        var currentUserId = GetUserId.GetUserIdFromClaims(User);

        var chatRoom = await _chatService.UpdateGroupChatRoom(currentUserId, chatRoomId, model);
        return Ok(chatRoom);
    }

    [HttpPost("private/{recipientId}/messages")]
    public async Task<ActionResult<ChatMessageReadDTO>> SendPrivateMessage(Guid recipientId, [FromForm] ChatMessageCreateDTO model)
    {
        var currentUserId = GetUserId.GetUserIdFromClaims(User);

        var message = await _chatService.SendPrivateMessage(currentUserId, recipientId, model);

        _ = _chatHubContext.Clients.User(recipientId.ToString()).ReceivedChatMessage(message);

        return Ok(message);
    }

    [HttpPost("{chatRoomId}/messages")]
    public async Task<ActionResult<ChatMessageReadDTO>> SendGroupMessage(Guid chatRoomId, [FromForm] ChatMessageCreateDTO model)
    {
        var currentUserId = GetUserId.GetUserIdFromClaims(User);

        var message = await _chatService.SendRoomMessage(currentUserId, chatRoomId, model);

        _ = _chatHubContext.Clients.Group(chatRoomId.ToString()).ReceivedChatMessage(message);

        return Ok(message);
    }

    [HttpDelete("message/{messageId}")]
    public async Task<ActionResult<bool>> DeleteMessage(Guid messageId)
    {
        var currentUserId = GetUserId.GetUserIdFromClaims(User);

        var isDeleted = await _chatService.DeleteMessage(currentUserId, messageId);
        return Ok(isDeleted);
    }

    [HttpPost("message/{messageId}/read")]
    public async Task<ActionResult<bool>> MarkMessageAsRead(Guid messageId)
    {
        var currentUserId = GetUserId.GetUserIdFromClaims(User);

        var isRead = await _chatService.MarkMessageAsRead(currentUserId, messageId);
        return Ok(isRead);
    }
}

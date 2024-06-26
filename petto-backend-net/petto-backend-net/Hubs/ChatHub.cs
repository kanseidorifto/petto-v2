using Microsoft.AspNetCore.SignalR;

using petto_backend_net.BLL.Interfaces;
using petto_backend_net.Helpers;

namespace petto_backend_net.Hubs;

public class ChatHub : Hub<IChatHub>
{
    private readonly IChatService _chatService;

    public ChatHub(IChatService chatService)
    {
        _chatService = chatService;
    }

    public override async Task OnConnectedAsync()
    {
        if (Context.User == null)
        {
            return;
        }

        var currentUserId = GetUserId.GetUserIdFromClaims(Context.User);

        var chatRoomIds = await _chatService.GetChatRoomsIds(currentUserId);

        foreach (var chatRoomId in chatRoomIds)
        {
            await Groups.AddToGroupAsync(Context.ConnectionId, chatRoomId.ToString());
        }

        await base.OnConnectedAsync();
    }

    public override async Task OnDisconnectedAsync(Exception? exception)
    {
        var currentUserId = GetUserId.GetUserIdFromClaims(Context.User!);

        var chatRoomIds = await _chatService.GetChatRoomsIds(currentUserId);

        foreach (var chatRoomId in chatRoomIds)
        {
            await Groups.RemoveFromGroupAsync(Context.ConnectionId, chatRoomId.ToString());
        }

        await base.OnDisconnectedAsync(exception);
    }
}

using Microsoft.EntityFrameworkCore;

using petto_backend_net.DAL.Entities;
using petto_backend_net.DAL.Enums;
using petto_backend_net.DAL.Interfaces;

namespace petto_backend_net.DAL.Repositories;

public class ChatRoomRepository(AppDbContext dbContext): GenericRepository<ChatRoom, Guid>(dbContext), IChatRoomRepository
{
    public async Task<ChatRoom?> GetPrivateChatRoom(Guid userId, Guid recipientId)
    {
        var chatRoom = await DbContext.ChatRooms
                                    .Where(cr => cr.Type == ChatType.Private)
                                    .Include(cr => cr.Participants)
                                    .FirstOrDefaultAsync(cr => cr.Participants.Any(cp => cp.ProfileId == userId) && cr.Participants.Any(cp => cp.ProfileId == recipientId));
        return chatRoom;
    }

    public IQueryable<ChatMessage> GetMessagesQuery(Guid chatRoomId)
    {
        return DbContext.ChatMessages
                        .Where(cm => cm.ChatRoomId == chatRoomId);
    }   

    public async Task AddParticipant(ChatRoom chatRoom, UserProfile userProfile)
    {
        var chatParticipant = new ChatParticipant
        {
            ChatRoomId = chatRoom.Id,
            ProfileId = userProfile.Id,
            CreatedAt = DateTime.UtcNow,
            EditedAt = DateTime.UtcNow
        };

        await DbContext.ChatParticipants.AddAsync(chatParticipant);
        await DbContext.SaveChangesAsync();
    }

    public async Task RemoveParticipant(ChatRoom chatRoom, UserProfile userProfile)
    {
        var chatParticipant = await DbContext.ChatParticipants
                                    .FirstOrDefaultAsync(cp => cp.ChatRoomId == chatRoom.Id && 
                                        cp.ProfileId == userProfile.Id);

        if (chatParticipant == null)
        {
            return;
        }

        DbContext.ChatParticipants.Remove(chatParticipant);
        await DbContext.SaveChangesAsync();
    }
    public async Task<ChatMessage?> GetMessageById(Guid id)
    {
        var message = await DbContext.ChatMessages
                                    .Include(cm => cm.SenderProfile)
                                    .Include(cm => cm.ChatRoom)
                                    .ThenInclude(cr => cr.Participants)
                                    .FirstOrDefaultAsync(cm => cm.Id == id);
        return message;
    }
    public async Task AddMessage(ChatMessage chatMessage)
    {
        await DbContext.ChatMessages.AddAsync(chatMessage);
        await DbContext.SaveChangesAsync();
    }
    public async Task DeleteMessage(ChatMessage message)
    {
        DbContext.ChatMessages.Remove(message);
        await DbContext.SaveChangesAsync();
    }
}

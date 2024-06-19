using petto_backend_net.DAL.Entities;

namespace petto_backend_net.DAL.Interfaces;

public interface IChatRoomRepository: IGenericRepository<ChatRoom, Guid>
{
    Task<ChatRoom?> GetPrivateChatRoom(Guid userId, Guid recipientId);
    IQueryable<ChatMessage> GetMessagesQuery(Guid chatRoomId);
    Task AddParticipant(ChatRoom chatRoom, UserProfile userProfile);
    Task RemoveParticipant(ChatRoom chatRoom, UserProfile userProfile);
    Task<ChatMessage?> GetMessageById(Guid id);
    Task AddMessage(ChatMessage chatMessage);
    Task DeleteMessage(ChatMessage chatMessage);
}

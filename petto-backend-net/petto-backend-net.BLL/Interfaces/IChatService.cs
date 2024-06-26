using petto_backend_net.BLL.DTO;
using petto_backend_net.BLL.DTO.Chat;
using petto_backend_net.BLL.Filtering;

namespace petto_backend_net.BLL.Interfaces;

public interface IChatService
{
    Task<ChatRoomDetailsDTO> CreateGroupChatRoom(Guid userId, ChatRoomGroupCreateDTO model);
    Task<ChatRoomDetailsDTO> UpdateGroupChatRoom(Guid userId, Guid chatRoomId, ChatRoomGroupUpdateDTO model);
    Task<EntitiesWithTotalCount<ChatRoomPreviewDTO>> GetChatRooms(Guid userId, ChatRoomFilteringModel model);
    Task<ICollection<Guid>> GetChatRoomsIds(Guid userId);
    Task<ChatRoomDetailsDTO> GetChatRoom(Guid userId, Guid chatRoomId);
    Task<EntitiesWithTotalCount<ChatMessageReadDTO>> GetChatRoomMessages(Guid userId, Guid chatRoomId, ChatMessageFilteringModel model);
    Task<ChatMessageReadDTO> SendPrivateMessage(Guid userId, Guid recipientId, ChatMessageCreateDTO model);
    Task<ChatMessageReadDTO> SendRoomMessage(Guid userId, Guid chatRoomId, ChatMessageCreateDTO model);
    Task<bool> DeleteMessage(Guid userId, Guid messageId);
    Task<bool> DeleteChatRoom(Guid userId, Guid chatRoomId);
    Task<bool> LeaveChatRoom(Guid userId, Guid chatRoomId);
    Task<bool> AddParticipant(Guid userId, Guid chatRoomId, Guid participantId);
    Task<bool> RemoveParticipant(Guid userId, Guid chatRoomId, Guid participantId);
    Task<bool> MarkMessageAsRead(Guid userId, Guid messageId);
}

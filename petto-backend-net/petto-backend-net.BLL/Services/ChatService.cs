using AutoMapper;

using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;

using Newtonsoft.Json;

using petto_backend_net.BLL.DTO;
using petto_backend_net.BLL.DTO.Chat;
using petto_backend_net.BLL.Exceptions;
using petto_backend_net.BLL.Extensions;
using petto_backend_net.BLL.Filtering;
using petto_backend_net.BLL.Interfaces;
using petto_backend_net.DAL.Entities;
using petto_backend_net.DAL.Enums;
using petto_backend_net.DAL.Interfaces;
using petto_backend_net.DAL.Utils;

namespace petto_backend_net.BLL.Services;

public class ChatService : IChatService
{
    private readonly IChatRoomRepository _chatRoomRepository;
    private readonly UserManager<UserProfile> _userManager;
    private readonly IFileService _fileService;
    private readonly IMapper _mapper;

    public ChatService(
        IChatRoomRepository chatRoomRepository,
        UserManager<UserProfile> userManager,
        IFileService fileService,
        IMapper mapper)
    {
        _chatRoomRepository = chatRoomRepository;
        _userManager = userManager;
        _fileService = fileService;
        _mapper = mapper;
    }
    public async Task<ChatRoomDetailsDTO> CreateGroupChatRoom(Guid userId, ChatRoomGroupCreateDTO model)
    {
        var user = await _userManager.FindByIdAsync(userId.ToString());
        if (user == null)
        {
            throw new NotFoundException("User", userId);
        }

        var chatRoom = new ChatRoom
        {
            Title = model.Title,
            Type = ChatType.Group,
            ProfileId = userId,
            CreatedAt = DateTime.UtcNow,
            EditedAt = DateTime.UtcNow,
        };

        if (model.IconMedia != null)
        {
            chatRoom.IconUrl = await _fileService.SaveFileAsync(model.IconMedia);
        }

        using var transaction = await _chatRoomRepository.GetContext().Database.BeginTransactionAsync();

        await _chatRoomRepository.Add(chatRoom);

        await _chatRoomRepository.AddParticipant(chatRoom, user);

        foreach (var participantId in model.Participants)
        {
            var participant = await _userManager.FindByIdAsync(participantId.ToString());
            if (participant == null)
            {
                throw new NotFoundException("User", participantId);
            }

            await _chatRoomRepository.AddParticipant(chatRoom, participant);
        }

        var createdMessage = new ChatMessage
        {
            ChatRoomId = chatRoom.Id,
            SenderProfileId = userId,
            MessageText = ChatInfoMessages.ChatRoomGroupCreated(),
            MessageType = MessageType.Info,
            CreatedAt = DateTime.UtcNow,
            EditedAt = DateTime.UtcNow
        };

        await _chatRoomRepository.AddMessage(createdMessage);

        await transaction.CommitAsync();

        chatRoom = await _chatRoomRepository.GetByIdWithInclude(
                                                                id: chatRoom.Id,
                                                                include: q => q
                                                                            .Include(cr => cr.Profile)
                                                                            .Include(cr => cr.Participants)
                                                                            .ThenInclude(cp => cp.Profile)
                                                                            .Include(cr => cr.Messages));

        return _mapper.Map<ChatRoomDetailsDTO>(chatRoom);
    }

    public async Task<ChatRoomDetailsDTO> GetChatRoom(Guid userId, Guid chatRoomId)
    {
        var chatRoom = await _chatRoomRepository.GetByIdWithInclude(
                                                                    id: chatRoomId,
                                                                    include: q => q
                                                                                  .Include(cr => cr.Profile)
                                                                                  .Include(cr => cr.Participants)
                                                                                  .ThenInclude(cp => cp.Profile)
                                                                                  .Include(cr => cr.Messages));

        if (chatRoom == null)
        {
            throw new NotFoundException("Chat room", chatRoomId);
        }

        if (!chatRoom.Participants.Any(p => p.ProfileId == userId))
        {
            throw new ForbiddenException("You are not a participant of this chat room");
        }

        return _mapper.Map<ChatRoomDetailsDTO>(chatRoom);
    }

    public async Task<EntitiesWithTotalCount<ChatRoomPreviewDTO>> GetChatRooms(Guid userId, ChatRoomFilteringModel model)
    {
        var query = _chatRoomRepository.GetQuery()
                                      .Include(cr => cr.Profile)
                                      .Include(cr => cr.Participants)
                                      .Include(cr => cr.Messages)
                                      .Where(cr => cr.Participants.Any(p => p.ProfileId == userId));

        var totalCount = query.Count();

        query = query.SortByField(model).Paginate(model);

        var chatRooms = await _mapper.ProjectTo<ChatRoomPreviewDTO>(query).ToListAsync();

        var result = new EntitiesWithTotalCount<ChatRoomPreviewDTO>
        {
            Items = chatRooms,
            TotalCount = totalCount
        };

        return result;
    }

    public async Task<EntitiesWithTotalCount<ChatMessageReadDTO>> GetChatRoomMessages(Guid userId, Guid chatRoomId, ChatMessageFilteringModel model)
    {
        var chatRoom = await _chatRoomRepository.GetByIdWithInclude(id: chatRoomId,
                                                                    include: q => q.Include(cr => cr.Participants));

        if (chatRoom == null)
        {
            throw new NotFoundException("Chat room", chatRoomId);
        }

        if (!chatRoom.Participants.Any(p => p.ProfileId == userId))
        {
            throw new ForbiddenException("You are not a participant of this chat room");
        }

        var query = _chatRoomRepository.GetMessagesQuery(chatRoomId)
                                      .Include(cm => cm.SenderProfile)
                                      .Include(cm => cm.ChatRoom)
                                      .AsQueryable();

        var totalCount = query.Count();

        query = query.SortByField(model).Paginate(model);

        var chatMessages = await _mapper.ProjectTo<ChatMessageReadDTO>(query).ToListAsync();

        var result = new EntitiesWithTotalCount<ChatMessageReadDTO>
        {
            Items = chatMessages,
            TotalCount = totalCount
        };

        return result;
    }

    public async Task<ChatMessageReadDTO> SendPrivateMessage(Guid userId, Guid recipientId, ChatMessageCreateDTO model)
    {
        var user = await _userManager.FindByIdAsync(userId.ToString());

        if (user == null)
        {
            throw new NotFoundException("User", userId);
        }

        var recipient = await _userManager.FindByIdAsync(recipientId.ToString());
        if (recipient == null)
        {
            throw new NotFoundException("User", recipientId);
        }

        var chatRoom = await _chatRoomRepository.GetPrivateChatRoom(userId, recipientId);

        if (chatRoom == null)
        {
            chatRoom = new ChatRoom
            {
                ProfileId = userId,
                Type = ChatType.Private,
                CreatedAt = DateTime.UtcNow,
                EditedAt = DateTime.UtcNow
            };

            using var transaction = await _chatRoomRepository.GetContext().Database.BeginTransactionAsync();

            await _chatRoomRepository.Add(chatRoom);

            await _chatRoomRepository.AddParticipant(chatRoom, user);
            await _chatRoomRepository.AddParticipant(chatRoom, recipient);

            await transaction.CommitAsync();
        }

        var chatMessage = await SendRoomMessage(userId, chatRoom.Id, model);

        return _mapper.Map<ChatMessageReadDTO>(chatMessage);
    }

    public async Task<ChatMessageReadDTO> SendRoomMessage(Guid userId, Guid chatRoomId, ChatMessageCreateDTO model)
    {
        var chatRoom = await _chatRoomRepository.GetByIdWithInclude(
                                                                    id: chatRoomId,
                                                                    include: q => q
                                                                                  .Include(cr => cr.Profile)
                                                                                  .Include(cr => cr.Participants)
                                                                                  .Include(cr => cr.Messages));

        if (chatRoom == null)
        {
            throw new NotFoundException("Chat room", chatRoomId);
        }

        if (!chatRoom.Participants.Any(p => p.ProfileId == userId))
        {
            throw new ForbiddenException("You are not a participant of this chat room");
        }

        var chatMessage = new ChatMessage
        {
            ChatRoomId = chatRoomId,
            SenderProfileId = userId,
            MessageText = model.MessageText,
            MessageType = model.MessageType,
            CreatedAt = DateTime.UtcNow,
            EditedAt = DateTime.UtcNow,
        };

        var mediaTypes = new List<MessageType> { MessageType.Image, MessageType.Video };

        if (mediaTypes.Contains(model.MessageType) && model.MessageMediaList != null)
        {
            var mediaUrls = new List<string>();

            foreach (var media in model.MessageMediaList)
            {
                var mediaUrl = await _fileService.SaveFileAsync(media);
                mediaUrls.Add(mediaUrl);
            }

            chatMessage.MessageMediaUrls = JsonConvert.SerializeObject(mediaUrls);
        }

        await _chatRoomRepository.AddMessage(chatMessage);

        chatMessage = await _chatRoomRepository.GetMessageById(chatMessage.Id);

        return _mapper.Map<ChatMessageReadDTO>(chatMessage);
    }

    public async Task<bool> DeleteMessage(Guid userId, Guid messageId)
    {
        var message = await _chatRoomRepository.GetMessageById(messageId);

        if (message == null)
        {
            throw new NotFoundException("Message", messageId);
        }

        if (message.SenderProfileId != userId)
        {
            throw new ForbiddenException("You can't delete message that you didn't send");
        }

        await _chatRoomRepository.DeleteMessage(message);

        return true;
    }

    public async Task<bool> DeleteChatRoom(Guid userId, Guid chatRoomId)
    {
        var chatRoom = await _chatRoomRepository.GetByIdWithInclude(id: chatRoomId,
                                                                    include: q => q
                                                                                  .Include(cr => cr.Profile)
                                                                                  .Include(cr => cr.Participants)
                                                                                  .ThenInclude(p => p.Profile)
                                                                                  .Include(cr => cr.Messages));

        if (chatRoom == null)
        {
            throw new NotFoundException("Chat room", chatRoomId);
        }

        if (chatRoom.ProfileId != userId)
        {
            throw new ForbiddenException("You can't delete chat room that you didn't create");
        }

        await _chatRoomRepository.Delete(chatRoom);

        return true;
    }

    public async Task<bool> LeaveChatRoom(Guid userId, Guid chatRoomId)
    {
        var chatRoom = await _chatRoomRepository.GetByIdWithInclude(id: chatRoomId,
                                                                    include: q => q
                                                                                  .Include(cr => cr.Profile)
                                                                                  .Include(cr => cr.Participants)
                                                                                  .ThenInclude(p => p.Profile)
                                                                                  .Include(cr => cr.Messages));

        if (chatRoom == null)
        {
            throw new NotFoundException("Chat room", chatRoomId);
        }

        if (chatRoom.Type == ChatType.Private)
        {
            throw new ForbiddenException("You can't leave private chat room");
        }

        if (chatRoom.ProfileId == userId)
        {
            throw new ForbiddenException("You can't leave chat room that you created");
        }

        var participant = chatRoom.Participants.FirstOrDefault(p => p.ProfileId == userId);
        if (participant == null)
        {
            throw new ForbiddenException("You are not a participant of this chat room");
        }

        var leftMessage = new ChatMessage
        {
            ChatRoomId = chatRoom.Id,
            SenderProfileId = userId,
            MessageText = ChatInfoMessages.ChatRoomParticipantLeft($"{participant.Profile.GivenName} {participant.Profile.Surname}"),
            MessageType = MessageType.Info,
            CreatedAt = DateTime.UtcNow,
            EditedAt = DateTime.UtcNow
        };

        using var transaction = await _chatRoomRepository.GetContext().Database.BeginTransactionAsync();

        await _chatRoomRepository.RemoveParticipant(chatRoom, participant.Profile);
        await _chatRoomRepository.AddMessage(leftMessage);

        await transaction.CommitAsync();

        return true;
    }

    public async Task<bool> AddParticipant(Guid userId, Guid chatRoomId, Guid participantId)
    {
        var chatRoom = await _chatRoomRepository.GetByIdWithInclude(id: chatRoomId,
                                                                    include: q => q
                                                                                  .Include(cr => cr.Profile)
                                                                                  .Include(cr => cr.Participants)
                                                                                  .ThenInclude(p => p.Profile)
                                                                                  .Include(cr => cr.Messages));
        if (chatRoom == null)
        {
            throw new NotFoundException("Chat room", chatRoomId);
        }

        if (chatRoom.Type == ChatType.Private)
        {
            throw new ForbiddenException("You can't add participants to private chat room");
        }

        if (chatRoom.ProfileId != userId)
        {
            throw new ForbiddenException("You can't add participants to chat room that you didn't create");
        }

        var participant = await _userManager.FindByIdAsync(participantId.ToString());
        if (participant == null)
        {
            throw new NotFoundException("User", participantId);
        }

        if (chatRoom.Participants.Any(p => p.ProfileId == participantId))
        {
            throw new ForbiddenException("User is already a participant of this chat room");
        }

        var addedMessage = new ChatMessage
        {
            ChatRoomId = chatRoom.Id,
            SenderProfileId = userId,
            MessageText = ChatInfoMessages.ChatRoomParticipantAdded($"{participant.GivenName} {participant.Surname}"),
            MessageType = MessageType.Info,
            CreatedAt = DateTime.UtcNow,
            EditedAt = DateTime.UtcNow
        };

        using var transaction = await _chatRoomRepository.GetContext().Database.BeginTransactionAsync();

        await _chatRoomRepository.AddParticipant(chatRoom, participant);
        await _chatRoomRepository.AddMessage(addedMessage);

        await transaction.CommitAsync();

        return true;
    }

    public async Task<bool> RemoveParticipant(Guid userId, Guid chatRoomId, Guid participantId)
    {
        var chatRoom = await _chatRoomRepository.GetByIdWithInclude(id: chatRoomId,
                                                                    include: q => q
                                                                                  .Include(cr => cr.Profile)
                                                                                  .Include(cr => cr.Participants)
                                                                                  .ThenInclude(p => p.Profile)
                                                                                  .Include(cr => cr.Messages));

        if (chatRoom == null)
        {
            throw new NotFoundException("Chat room", chatRoomId);
        }

        if (chatRoom.Type == ChatType.Private)
        {
            throw new ForbiddenException("You can't remove participants from private chat room");
        }

        if (chatRoom.ProfileId != userId)
        {
            throw new ForbiddenException("You can't remove participants from chat room that you didn't create");
        }

        if (chatRoom.ProfileId == participantId)
        {
            throw new ForbiddenException("You can't remove yourself from chat room");
        }

        var participant = chatRoom.Participants.FirstOrDefault(p => p.ProfileId == participantId);
        if (participant == null)
        {
            throw new NotFoundException("Participant", participantId);
        }

        var removedMessage = new ChatMessage
        {
            ChatRoomId = chatRoom.Id,
            SenderProfileId = userId,
            MessageText = ChatInfoMessages.ChatRoomParticipantRemoved($"{participant.Profile.GivenName} {participant.Profile.Surname}"),
            MessageType = MessageType.Info,
            CreatedAt = DateTime.UtcNow,
            EditedAt = DateTime.UtcNow
        };

        using var transaction = await _chatRoomRepository.GetContext().Database.BeginTransactionAsync();

        await _chatRoomRepository.RemoveParticipant(chatRoom, participant.Profile);
        await _chatRoomRepository.AddMessage(removedMessage);

        await transaction.CommitAsync();

        return true;
    }

    public async Task<bool> MarkMessageAsRead(Guid userId, Guid messageId)
    {
        var message = await _chatRoomRepository.GetMessageById(messageId);

        if (message == null)
        {
            throw new NotFoundException("Message", messageId);
        }

        if (message.SenderProfileId == userId)
        {
            throw new ForbiddenException("You can't mark your own message as readed");
        }

        var participant = message.ChatRoom.Participants.FirstOrDefault(p => p.ProfileId == userId);
        if (participant == null)
        {
            throw new ForbiddenException("You are not a participant of this chat room");
        }

        if (participant.LastReadedMessageId == messageId)
        {
            return true;
        }

        if (participant.LastReadedMessageId != null)
        {
            var lastReadedMessage = await _chatRoomRepository.GetMessageById((Guid)participant.LastReadedMessageId);
            if (lastReadedMessage != null && lastReadedMessage.CreatedAt > message.CreatedAt)
            {
                throw new ForbiddenException("You can't mark message as readed if there are newer message");
            }
        }

        participant.LastReadedMessageId = messageId;

        await _chatRoomRepository.GetContext().SaveChangesAsync();

        return true;
    }

}

using AutoMapper;

using petto_backend_net.DAL.Entities;
using petto_backend_net.BLL.DTO.Chat;

namespace petto_backend_net.BLL.Mapper;

public class ChatProfile : Profile
{
    public ChatProfile()
    {
        CreateMap<ChatRoom, ChatRoomPreviewDTO>()
            .ForMember(dest => dest.LastMessage, opt =>
                        opt.MapFrom(src => src.Messages.OrderByDescending(m => m.CreatedAt).FirstOrDefault()));

        CreateMap<ChatRoom, ChatRoomDetailsDTO>()
            .ForMember(dest => dest.LastMessage, opt =>
                        opt.MapFrom(src => src.Messages.OrderByDescending(m => m.CreatedAt).FirstOrDefault()));

        CreateMap<ChatParticipant, ChatParticipantPreviewDTO>();
        CreateMap<ChatMessage, ChatMessageReadDTO>();
    }
}

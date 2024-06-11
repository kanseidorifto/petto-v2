using AutoMapper;

using petto_backend_net.BLL.DTO.Community;
using petto_backend_net.DAL.Entities;

namespace petto_backend_net.BLL.Mapper;

public class CommunityProfile : Profile
{
    public CommunityProfile()
    {
        CreateMap<Community, CommunityReadDto>();
    }
}

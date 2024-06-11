using AutoMapper;

using Newtonsoft.Json;

using petto_backend_net.BLL.DTO.UserPost;
using petto_backend_net.DAL.Entities;

namespace petto_backend_net.BLL.Mapper;

public class UserPostProfile : Profile
{
    public UserPostProfile()
    {
        CreateMap<PostComment, PostCommentReadDto>();

        CreateMap<PostLike, LikeReadDTO>();

        CreateMap<UserPost, UserPostReadDto>()
            .ForMember(dest => dest.MediaLocations,
                // deserialize json string to list of strings
                opt => opt.MapFrom(src => JsonConvert.DeserializeObject<List<string>>(src.MediaLocations!)));
    }
}

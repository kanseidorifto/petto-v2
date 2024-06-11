using AutoMapper;
using petto_backend_net.BLL.DTO.UserFriendship;
using petto_backend_net.DAL.Entities;

namespace petto_backend_net.BLL.Mapper
{
    public class UserFriendshipProfile: Profile
    {
        public UserFriendshipProfile()
        {
            CreateMap<UserFriendship, UserFriendshipReadDTO>();

            CreateMap<UserFriendshipCreateDTO, UserFriendship>();
        }
    }
}

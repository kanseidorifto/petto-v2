using AutoMapper;
using petto_backend_net.BLL.DTO.Auth;
using petto_backend_net.BLL.DTO.UserProfile;
using petto_backend_net.DAL.Entities;

namespace petto_backend_net.BLL.Mapper;

public class UserProfileProfile : Profile
{
    public UserProfileProfile()
    {
        CreateMap<UserProfile, UserDataReadDTO>();

        CreateMap<RegisterDTO, UserProfile>();

        CreateMap<UserProfile, UserProfileReadDTO>();

        // update user profile from model, some values can be null, if that, don't update those values
        CreateMap<UserProfileUpdateDTO, UserProfile>()
            .ForMember(dest => dest.GivenName, opt => opt.Condition((src, dest, srcMember) => srcMember != null))
            .ForMember(dest => dest.Surname, opt => opt.Condition((src, dest, srcMember) => srcMember != null))
            .ForMember(dest => dest.Bio, opt => opt.Condition((src, dest, srcMember) => srcMember != null));

        CreateMap<UserProfile, UserProfileDetailsDTO>();
    }
}

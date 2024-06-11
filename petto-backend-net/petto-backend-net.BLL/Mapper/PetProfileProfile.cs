using AutoMapper;
using petto_backend_net.BLL.DTO.PetProfile;
using petto_backend_net.DAL.Entities;

namespace petto_backend_net.BLL.Mapper;
public class PetProfileProfile : Profile
{
    public PetProfileProfile()
    {
        CreateMap<PetProfile, PetProfileReadDTO>();

        CreateMap<PetProfileCreateDTO, PetProfile>();

        CreateMap<PetProfileUpdateDTO, PetProfile>()
            .ForMember(dest => dest.GivenName, opt => opt.Condition((src, dest, srcMember) => srcMember != null))
            .ForMember(dest => dest.Breed, opt => opt.Condition((src, dest, srcMember) => srcMember != null))
            .ForMember(dest => dest.Age, opt => opt.Condition((src, dest, srcMember) => srcMember != null))
            .ForMember(dest => dest.Bio, opt => opt.Condition((src, dest, srcMember) => srcMember != null));
    }
}

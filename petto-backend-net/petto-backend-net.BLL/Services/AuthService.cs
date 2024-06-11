using AutoMapper;
using Microsoft.AspNetCore.Identity;
using Microsoft.Extensions.Configuration;
using Microsoft.AspNetCore.Http;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

using petto_backend_net.DAL.Entities;
using petto_backend_net.DAL.Enums;
using petto_backend_net.BLL.DTO.Auth;
using petto_backend_net.BLL.Interfaces;
using petto_backend_net.BLL.Exceptions;

namespace petto_backend_net.BLL.Services;

public class AuthService : IAuthService
{
    private readonly IHttpContextAccessor _httpContextAccessor;
    private readonly IMapper _mapper;
    private readonly UserManager<UserProfile> _userManager;
    private readonly RoleManager<IdentityRole<Guid>> _roleManager;
    private readonly IConfiguration _configuration;

    public AuthService(
        IHttpContextAccessor httpContextAccessor,
        IMapper mapper,
        UserManager<UserProfile> userManager,
        RoleManager<IdentityRole<Guid>> roleManager,
        IConfiguration configuration
    )
    {
        _httpContextAccessor = httpContextAccessor;
        _mapper = mapper;
        _userManager = userManager;
        _roleManager = roleManager;
        _configuration = configuration;
    }

    public SecurityToken GenerateToken(UserProfile user, IList<string> userRoles)
    {
        var handler = new JwtSecurityTokenHandler();
        var key = Encoding.ASCII.GetBytes(_configuration["JWT:SECRET"]);
        var credentials = new SigningCredentials(
            new SymmetricSecurityKey(key),
            SecurityAlgorithms.HmacSha256Signature);

        var claims = new ClaimsIdentity();
        claims.AddClaim(new Claim(ClaimTypes.Email, user.Email!));
        claims.AddClaim(new Claim(ClaimTypes.NameIdentifier, user.Id.ToString()));

        foreach (var role in userRoles)
            claims.AddClaim(new Claim(ClaimTypes.Role, role));

        var tokenDescriptor = new SecurityTokenDescriptor
        {
            Issuer = _configuration["JWT:ISSUER"],
            Audience = _configuration["JWT:AUDIENCE"],
            Subject = claims,
            Expires = DateTime.UtcNow.Add(TimeSpan.Parse(_configuration["JWT:EXPIRES_IN"])),
            SigningCredentials = credentials,
        };

        var token = handler.CreateToken(tokenDescriptor);
        return token;
    }

    public async Task<UserDataReadDTO> Login(LoginDTO model)
    {
        var user = await _userManager.FindByEmailAsync(model.Email);
        if (user != null && await _userManager.CheckPasswordAsync(user, model.Password))
        {
            var userRoles = await _userManager.GetRolesAsync(user);

            var token = GenerateToken(user, userRoles);

            var userDTO = _mapper.Map<UserDataReadDTO>(user);

            userDTO.Token = new JwtSecurityTokenHandler().WriteToken(token);

            return userDTO;
        }

        throw new BadRequestException("Invalid credentials");
    }

    public async Task<UserDataReadDTO> Register(RegisterDTO model)
    {
        var userExists = await _userManager.FindByEmailAsync(model.Email);
        if (userExists != null)
            throw new BadRequestException("Already exist!");

        var newUser = _mapper.Map<UserProfile>(model);

        newUser.UserName = model.Email;
        newUser.SecurityStamp = Guid.NewGuid().ToString();


        var result = await _userManager.CreateAsync(newUser, model.Password);
        if (!result.Succeeded)
            throw new Exception("User creation failed! Please check user details and try again.");

        if (await _roleManager.RoleExistsAsync(UserRoles.User.ToString()))
        {
            await _userManager.AddToRoleAsync(newUser, UserRoles.User.ToString());
        }

        var userData = await Login(new LoginDTO { Email = model.Email, Password = model.Password });

        return userData;
    }
}

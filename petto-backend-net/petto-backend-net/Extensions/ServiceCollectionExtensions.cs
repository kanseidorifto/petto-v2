using petto_backend_net.DAL;
using petto_backend_net.DAL.Entities;
using petto_backend_net.DAL.Interfaces;
using petto_backend_net.DAL.Repositories;
using petto_backend_net.BLL.Interfaces;
using petto_backend_net.BLL.Services;
using petto_backend_net.BLL.Mapper;

using Microsoft.AspNetCore.Identity;
using Microsoft.IdentityModel.Tokens;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using System.Text;
using Microsoft.OpenApi.Models;
using AutoMapper;

namespace petto_backend_net.Extensions;

public static class ServiceCollectionExtensions
{
    public static void AddDbContext(this IServiceCollection services, IConfiguration configuration)
    {
        services.AddDbContext<AppDbContext>(
            optionsAction: (serviceProvider, options) =>
                options.UseNpgsql(configuration["POSTGRESDB_URI"]),
            contextLifetime: ServiceLifetime.Transient,
            optionsLifetime: ServiceLifetime.Scoped);
    }

    public static void AddIdentity(this IServiceCollection services)
    {
        services.AddIdentity<UserProfile, IdentityRole<Guid>>()
        .AddEntityFrameworkStores<AppDbContext>()
        .AddDefaultTokenProviders();
    }

        public static async void CreateRoles(this WebApplication application)
    {
        var serviceProvider = application.Services.CreateScope().ServiceProvider;
        var RoleManager = serviceProvider.GetRequiredService<RoleManager<IdentityRole<Guid>>>();
        var UserManager = serviceProvider.GetRequiredService<UserManager<UserProfile>>();
        string[] roleNames = { "Admin", "SuperAdmin", "User" };
        IdentityResult roleResult;

        foreach (var roleName in roleNames)
        {
            var roleExist = await RoleManager.RoleExistsAsync(roleName);
            if (!roleExist)
            {
                roleResult = await RoleManager.CreateAsync(new IdentityRole<Guid>(roleName));
            }
        }

        var superAdmin = new UserProfile
        {
            UserName = application.Configuration["APPSUPERADMIN:NAME"],
            Email = application.Configuration["APPSUPERADMIN:EMAIL"],
            GivenName = "Petto",
            Surname = "Admin",
            AvatarUrl = application.Configuration["APPSUPERADMIN:AVATARURL"],
            CoverUrl = application.Configuration["APPSUPERADMIN:COVERURL"],
            EmailConfirmed = true
        };
        string superAdminPassword = application.Configuration["APPSUPERADMIN:PASSWORD"]!;
        var _user = await UserManager.FindByEmailAsync(application.Configuration["APPSUPERADMIN:EMAIL"]!);

        if (_user == null)
        {
            var createSuperAdmin = await UserManager.CreateAsync(superAdmin, superAdminPassword);
            if (createSuperAdmin.Succeeded)
            {
                await UserManager.AddToRoleAsync(superAdmin, "SuperAdmin");
            }
        }
    }
    public static void AddJwtAuthentication(this IServiceCollection services, IConfiguration configuration)
    {
        services
            .AddAuthentication(x =>
            {
                x.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
                x.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
            })
            .AddJwtBearer(x =>
            {
                x.RequireHttpsMetadata = false;
                x.SaveToken = true;
                x.TokenValidationParameters = new TokenValidationParameters
                {
                    IssuerSigningKey = new SymmetricSecurityKey(Encoding.ASCII.GetBytes(configuration["JWT:SECRET"])),
                    ValidateIssuer = false,
                    ValidateAudience = false
                };
            });

        services.AddAuthorization();
    }

    public static void AddSwaggerGenToken(this IServiceCollection services)
    {
        services.AddSwaggerGen(c =>
        {
            c.SwaggerDoc("v1", new OpenApiInfo { Title = "petto-backend-net", Version = "v1" });
            c.AddSecurityDefinition("Bearer", new OpenApiSecurityScheme
            {
                Name = "Authorization",
                Description = "Enter your JWT token in this field",
                In = ParameterLocation.Header,
                Type = SecuritySchemeType.Http,
                Scheme = "bearer",
                BearerFormat = "JWT"
            });
            c.AddSecurityRequirement(new OpenApiSecurityRequirement
            {
                {
                    new OpenApiSecurityScheme
                    {
                        Reference = new OpenApiReference
                        {
                            Type = ReferenceType.SecurityScheme,
                            Id = "Bearer"
                        }
                    },
                    new string[] { }
                }
            });
        });
    }

    public static void AddCorsPolicy(this IServiceCollection services, IConfiguration configuration)
    {
        services.AddCors(options =>
        {
            options.AddPolicy(name: "AllowSpecificOrigins",
                              policy =>
                              {
                                  policy.WithOrigins(configuration["CORS:ORIGINS"].Split(','))
                                        .AllowAnyHeader()
                                        .AllowAnyMethod();
                              });
        });
    }

    public static void AddAutoMapper(this IServiceCollection services)
    {
        var mapperConfig = new MapperConfiguration(mc =>
        {
            mc.AddProfile(new UserProfileProfile());
            mc.AddProfile(new UserFriendshipProfile());
            mc.AddProfile(new PetProfileProfile());
            mc.AddProfile(new UserPostProfile());
            mc.AddProfile(new CommunityProfile());
            mc.AddProfile(new ChatProfile());
        });

        var mapper = mapperConfig.CreateMapper();
        services.AddSingleton(mapper);
    }

    public static void AddRepositories(this IServiceCollection services)
    {
        services.AddScoped<IUserProfileRepository, UserProfileRepository>();
        services.AddScoped<IUserFriendshipRepository, UserFriendshipRepository>();
        services.AddScoped<IPetProfileRepository, PetProfileRepository>();
        services.AddScoped<IPostTaggedPetRepository, PostTaggedPetRepository>();
        services.AddScoped<IUserPostRepository, UserPostRepository>();
        services.AddScoped<IChatRoomRepository, ChatRoomRepository>();
    }

    public static void AddServices(this IServiceCollection services)
    {
        services.AddHttpClient<IFileService>();
        services.AddSingleton<IFileService, FileService>();
        services.AddTransient<IAuthService, AuthService>();
        services.AddTransient<IUserService, UserService>();
        services.AddTransient<IUserFriendshipService, UserFriendshipService>();
        services.AddTransient<IPetProfileService, PetProfileService>();
        services.AddTransient<IUserPostService, UserPostService>();
        services.AddTransient<IChatService, ChatService>();
    }
}

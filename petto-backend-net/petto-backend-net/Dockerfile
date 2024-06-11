#See https://aka.ms/customizecontainer to learn how to customize your debug container and how Visual Studio uses this Dockerfile to build your images for faster debugging.

FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS base
USER app
WORKDIR /app
EXPOSE 8080
EXPOSE 8081

FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
ARG BUILD_CONFIGURATION=Release
WORKDIR /src
COPY ["petto-backend-net/petto-backend-net.API.csproj", "petto-backend-net/"]
COPY ["petto-backend-net.BLL/petto-backend-net.BLL.csproj", "petto-backend-net.BLL/"]
COPY ["petto-backend-net.DAL/petto-backend-net.DAL.csproj", "petto-backend-net.DAL/"]
RUN dotnet restore "./petto-backend-net/petto-backend-net.API.csproj"
COPY . .
WORKDIR "/src/petto-backend-net"
RUN dotnet build "./petto-backend-net.API.csproj" -c $BUILD_CONFIGURATION -o /app/build

FROM build AS publish
ARG BUILD_CONFIGURATION=Release
RUN dotnet publish "./petto-backend-net.API.csproj" -c $BUILD_CONFIGURATION -o /app/publish /p:UseAppHost=false

FROM base AS final
WORKDIR /app
COPY --from=publish /app/publish .
ENTRYPOINT ["dotnet", "petto-backend-net.API.dll"]
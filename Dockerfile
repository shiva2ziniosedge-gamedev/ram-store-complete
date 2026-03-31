# Use the official .NET SDK image
FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /app

# Copy csproj and restore dependencies
COPY Back-end/RamApi/RamApi.csproj ./
RUN dotnet restore

# Copy everything else and build
COPY Back-end/RamApi/ ./
RUN dotnet publish -c Release -o out

# Build runtime image
FROM mcr.microsoft.com/dotnet/aspnet:8.0
WORKDIR /app
COPY --from=build /app/out .

# Expose port
EXPOSE $PORT

# Start the application
ENTRYPOINT ["dotnet", "RamApi.dll"]
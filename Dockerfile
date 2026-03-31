# Use the official .NET SDK image
FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /app

# Copy everything first
COPY . ./

# List files to debug (temporary)
RUN ls -la

# Find and restore the project
RUN find . -name "*.csproj" -exec dotnet restore {} \;

# Build and publish
RUN find . -name "*.csproj" -exec dotnet publish {} -c Release -o out \;

# Build runtime image
FROM mcr.microsoft.com/dotnet/aspnet:8.0
WORKDIR /app
COPY --from=build /app/out .

# Expose port
EXPOSE $PORT

# Start the application
ENTRYPOINT ["dotnet", "RamApi.dll"]
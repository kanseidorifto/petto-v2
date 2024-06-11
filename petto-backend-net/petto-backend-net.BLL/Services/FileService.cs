using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Configuration;
using petto_backend_net.BLL.Interfaces;

namespace petto_backend_net.BLL.Services;

public class FileService: IFileService
{
    private readonly HttpClient _httpClient;
    private readonly string _region;
    private readonly string _request;
    private readonly string _namespace;
    private readonly string _bucket;

    public FileService(HttpClient httpClient, IConfiguration configuration)
    {
        _httpClient = httpClient;
        _region = configuration["OCI_REGION"];
        _request = configuration["OCI_REQUEST"];
        _namespace = configuration["OCI_NAMESPACE"];
        _bucket = configuration["OCI_BUCKET"];
    }
    private static byte[] GetByteArrayFromImage(IFormFile file)
    {
        using (var target = new MemoryStream())
        {
            file.CopyTo(target);
            return target.ToArray();
        }
    }
    private static string GenerateUniqueFileName(string originalFileName)
    {
        var extension = Path.GetExtension(originalFileName);
        var originalName = Path.GetFileNameWithoutExtension(originalFileName);
        return $"{originalName}_{Guid.NewGuid()}{extension}";
    }

    public async Task<string> SaveFileAsync(IFormFile file)
    {
        var newFileName = GenerateUniqueFileName(file.FileName);

        var uploadURL = $"https://objectstorage.{_region}.oraclecloud.com/p/{_request}/n/{_namespace}/b/{_bucket}/o/{newFileName}";


        var content = new ByteArrayContent(GetByteArrayFromImage(file));

        content.Headers.ContentType = new System.Net.Http.Headers.MediaTypeHeaderValue(file.ContentType);

        var response = await _httpClient.PutAsync(uploadURL, content);

        if (response.IsSuccessStatusCode)
        {
            return $"https://objectstorage.{_region}.oraclecloud.com/n/{_namespace}/b/{_bucket}/o/{newFileName}";
        }

        throw new Exception("Failed to upload file to Cloud Storage");
    }
}

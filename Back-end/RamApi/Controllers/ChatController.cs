using Microsoft.AspNetCore.Mvc;
using System.Text;
using System.Text.Json;

namespace RamApi.Controllers;

[ApiController]
[Route("api/[controller]")]
public class ChatController : ControllerBase
{
    private readonly IConfiguration _config;
    private readonly HttpClient _httpClient;

    public ChatController(IConfiguration config, IHttpClientFactory httpClientFactory)
    {
        _config = config;
        _httpClient = httpClientFactory.CreateClient();
    }

    [HttpPost]
    public async Task<IActionResult> Chat([FromBody] ChatRequest request)
    {
        try
        {
            var apiKey = _config["Gemini:ApiKey"];
            var url = $"https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key={apiKey}";

            var systemPrompt = @"You are a helpful assistant for RAM Store, an online computer RAM retailer. 
Help customers with questions about:
- RAM specifications (DDR4, DDR5, speed, capacity)
- Product recommendations
- Compatibility with their systems
- Pricing and availability
- Orders and shipping
- Technical support

Be friendly, concise, and helpful. If you don't know something specific about our inventory, suggest they check the product list on the page.";

            var payload = new
            {
                contents = new[]
                {
                    new
                    {
                        parts = new[]
                        {
                            new { text = systemPrompt + "\n\nUser question: " + request.Message }
                        }
                    }
                }
            };

            var json = JsonSerializer.Serialize(payload);
            var content = new StringContent(json, Encoding.UTF8, "application/json");

            var response = await _httpClient.PostAsync(url, content);
            var responseText = await response.Content.ReadAsStringAsync();

            if (!response.IsSuccessStatusCode)
            {
                Console.WriteLine($"Gemini API error: {responseText}");
                return Ok(new { reply = "Sorry, I'm having trouble connecting right now. Please try again." });
            }

            var result = JsonSerializer.Deserialize<JsonElement>(responseText);
            var reply = result
                .GetProperty("candidates")[0]
                .GetProperty("content")
                .GetProperty("parts")[0]
                .GetProperty("text")
                .GetString();

            return Ok(new { reply });
        }
        catch (Exception ex)
        {
            Console.WriteLine($"Chat error: {ex.Message}");
            return Ok(new { reply = "Sorry, I encountered an error. Please try again." });
        }
    }
}

public class ChatRequest
{
    public string Message { get; set; } = "";
}

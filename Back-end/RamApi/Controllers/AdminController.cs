using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using RamApi.Data;
using RamApi.Models;

namespace RamApi.Controllers;

[ApiController]
[Route("api/[controller]")]
public class AdminController : ControllerBase
{
    private readonly AppDbContext _context;

    public AdminController(AppDbContext context)
    {
        _context = context;
    }

    // GET: api/admin/rams - Get all RAMs for editing
    [HttpGet("rams")]
    public async Task<ActionResult<IEnumerable<Ram>>> GetAllRams()
    {
        return await _context.Rams.ToListAsync();
    }

    // PUT: api/admin/rams/5 - Update RAM
    [HttpPut("rams/{id}")]
    public async Task<IActionResult> UpdateRam(int id, Ram ram)
    {
        if (id != ram.Id) return BadRequest();

        _context.Entry(ram).State = EntityState.Modified;
        await _context.SaveChangesAsync();
        return NoContent();
    }

    // POST: api/admin/rams - Add new RAM
    [HttpPost("rams")]
    public async Task<ActionResult<Ram>> CreateRam(Ram ram)
    {
        _context.Rams.Add(ram);
        await _context.SaveChangesAsync();
        return CreatedAtAction(nameof(GetAllRams), new { id = ram.Id }, ram);
    }

    // DELETE: api/admin/rams/5 - Delete RAM
    [HttpDelete("rams/{id}")]
    public async Task<IActionResult> DeleteRam(int id)
    {
        var ram = await _context.Rams.FindAsync(id);
        if (ram == null) return NotFound();

        _context.Rams.Remove(ram);
        await _context.SaveChangesAsync();
        return NoContent();
    }

    // GET: api/admin/orders - Get all orders
    [HttpGet("orders")]
    public async Task<ActionResult<IEnumerable<Order>>> GetAllOrders()
    {
        return await _context.Orders.Include(o => o.Ram).ToListAsync();
    }

    // GET: api/admin/reviews - Get all reviews
    [HttpGet("reviews")]
    public async Task<ActionResult<IEnumerable<Review>>> GetAllReviews()
    {
        return await _context.Reviews.Include(r => r.Ram).ToListAsync();
    }

    // POST: api/admin/test-email - Test email functionality
    [HttpPost("test-email")]
    public async Task<IActionResult> TestEmail([FromBody] TestEmailRequest request)
    {
        try
        {
            var emailService = HttpContext.RequestServices.GetRequiredService<EmailService>();
            await emailService.SendOrderConfirmationAsync(
                request.Email,
                "Test Customer",
                "Test RAM 16GB DDR4",
                1,
                2500
            );
            return Ok(new { message = "Test email sent successfully" });
        }
        catch (Exception ex)
        {
            return BadRequest(new { message = $"Email test failed: {ex.Message}" });
        }
    }
}

public class TestEmailRequest
{
    public string Email { get; set; } = "";
}
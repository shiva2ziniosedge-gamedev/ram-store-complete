using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using RamApi.Data;
using RamApi.Models;

namespace RamApi.Controllers;

[ApiController]
[Route("api/[controller]")]
public class ReviewController : ControllerBase
{
    private readonly AppDbContext _db;
    public ReviewController(AppDbContext db) => _db = db;

    // GET api/review/5  ← get all reviews for RAM id 5
    [HttpGet("{ramId}")]
    public async Task<IActionResult> GetByRam(int ramId) =>
        Ok(await _db.Reviews
            .Where(r => r.RamId == ramId)
            .ToListAsync());

    // POST api/review  ← submit a new review
    [HttpPost]
    public async Task<IActionResult> Add(Review review)
    {
        _db.Reviews.Add(review);
        await _db.SaveChangesAsync();
        return Ok(review);
    }
}

using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using RamApi.Data;
using RamApi.Models;

namespace RamApi.Controllers;

[ApiController]
[Route("api/[controller]")]
public class RamController : ControllerBase
{
    private readonly AppDbContext _db;
    public RamController(AppDbContext db) => _db = db;

    [HttpGet]
    public async Task<IActionResult> GetAll() =>
        Ok(await _db.Rams.ToListAsync());

    [HttpGet("{id}")]
    public async Task<IActionResult> GetById(int id)
    {
        var ram = await _db.Rams.FindAsync(id);
        return ram is null ? NotFound() : Ok(ram);
    }

    [HttpPost]
    public async Task<IActionResult> Create(Ram ram)
    {
        _db.Rams.Add(ram);
        await _db.SaveChangesAsync();
        return CreatedAtAction(nameof(GetById), new { id = ram.Id }, ram);
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> Update(int id, Ram ram)
    {
        if (id != ram.Id) return BadRequest();
        _db.Entry(ram).State = EntityState.Modified;
        await _db.SaveChangesAsync();
        return NoContent();
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(int id)
    {
        var ram = await _db.Rams.FindAsync(id);
        if (ram is null) return NotFound();
        _db.Rams.Remove(ram);
        await _db.SaveChangesAsync();
        return NoContent();
    }
}

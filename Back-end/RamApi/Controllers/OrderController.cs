using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using RamApi.Data;
using RamApi.Models;
using RamApi.Services;

namespace RamApi.Controllers;

[ApiController]
[Route("api/[controller]")]
public class OrderController : ControllerBase
{
   private readonly AppDbContext _db;
private readonly EmailService _email;

public OrderController(AppDbContext db, EmailService email)
{
    _db = db;
    _email = email;
}


    [HttpGet]
    public async Task<IActionResult> GetAll() =>
        Ok(await _db.Orders.Include(o => o.Ram).ToListAsync());

    [HttpPost]
    public async Task<IActionResult> PlaceOrder(Order order)
    {
        var ram = await _db.Rams.FindAsync(order.RamId);
        if (ram is null) return NotFound("RAM not found");

        if (ram.Stock <= 0 || ram.Stock < order.Quantity)
        {
            order.Status = "StockOut";
            _db.Orders.Add(order);
            await _db.SaveChangesAsync();
            return Ok(new { message = "Stock not available", order });
        }

        ram.Stock -= order.Quantity;
        order.Status = "Booked";
        _db.Orders.Add(order);
        await _db.SaveChangesAsync();


        if (!string.IsNullOrEmpty(order.Email))
{
    await _email.SendOrderConfirmationAsync(
        order.Email,
        order.CustomerName,
        $"{ram.Name} {ram.CapacityGb}GB",
        order.Quantity,
        ram.Price * order.Quantity
    );
}

        return Ok(new { message = "Order placed successfully", order });
    }

    [HttpPut("{id}/confirm")]
    public async Task<IActionResult> Confirm(int id)
    {
        var order = await _db.Orders.FindAsync(id);
        if (order is null) return NotFound();
        order.Status = "Confirmed";
        await _db.SaveChangesAsync();
        return Ok(order);
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(int id)
    {
        var order = await _db.Orders.FindAsync(id);
        if (order is null) return NotFound();
        _db.Orders.Remove(order);
        await _db.SaveChangesAsync();
        return NoContent();
    }
}

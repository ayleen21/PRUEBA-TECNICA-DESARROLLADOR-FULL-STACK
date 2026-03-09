using BackendFacturas.Models;
using BackendFacturas.DTOs;
using BackendFacturas.Services;
using Microsoft.AspNetCore.Mvc;

namespace BackendFacturas.Controllers;

[ApiController]
[Route("api/[controller]")]
public class InvoicesController : ControllerBase
{
    private readonly InvoiceService _service;

    public InvoicesController(InvoiceService service)
    {
        _service = service;
    }

    [HttpGet("{customerID}")]
    public ActionResult<IEnumerable<InvoiceDto>> GetInvoices(int customerID)
    {
        var invoices = _service.GetInvoices(customerID);
        if (!invoices.Any())
            return NotFound(new { message = "No se encontraron facturas para este cliente." });

        var result = invoices.Select(i => new InvoiceDto
        {
            InvoiceID = i.InvoiceID,
            Date = i.Date,
            Amount = i.Amount,
            Status = i.Status,
            CustomerID = i.CustomerID
        });

        return Ok(result);
    }
}

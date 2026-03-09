using BackendFacturas.Models;
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
    public ActionResult<IEnumerable<Invoice>> GetInvoices(int customerID)
    {
        var invoices = _service.GetInvoices(customerID);
        if (!invoices.Any())
            return NotFound(new { message = "No se encontraron facturas para este cliente." });

        return Ok(invoices);
    }
}

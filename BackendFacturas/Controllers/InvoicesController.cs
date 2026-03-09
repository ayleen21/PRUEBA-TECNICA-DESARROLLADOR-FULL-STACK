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

    /// <summary>
    /// Obtiene las facturas activas de un cliente por su ID.
    /// </summary>
    /// <param name="customerID">ID del cliente</param>
    /// <returns>Lista de facturas</returns>
    [HttpGet("{customerID}")]
    [ProducesResponseType(typeof(IEnumerable<InvoiceDto>), 200)]
    [ProducesResponseType(400)]
    [ProducesResponseType(404)]
    public ActionResult<IEnumerable<InvoiceDto>> GetInvoices(int customerID)
    {
        if (customerID <= 0)
            return BadRequest(new { message = "El ID de cliente debe ser mayor a cero." });

        try
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
        catch (Exception ex)
        {
            // Loguear el error si se requiere
            return StatusCode(500, new { message = "Error interno del servidor.", detail = ex.Message });
        }
    }
}

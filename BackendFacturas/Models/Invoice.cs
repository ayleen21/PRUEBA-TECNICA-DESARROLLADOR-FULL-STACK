namespace BackendFacturas.Models;

public class Invoice
{
    public int InvoiceID { get; set; }
    public DateTime Date { get; set; }
    public decimal Amount { get; set; }
    public string? Status { get; set; }
    public int CustomerID { get; set; }
}

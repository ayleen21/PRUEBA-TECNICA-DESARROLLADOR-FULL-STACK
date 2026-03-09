namespace BackendFacturas.DTOs
{
    public class InvoiceDto
    {
        public int InvoiceID { get; set; }
        public DateTime Date { get; set; }
        public decimal Amount { get; set; }
        public string? Status { get; set; }
        public int CustomerID { get; set; }
    }
}
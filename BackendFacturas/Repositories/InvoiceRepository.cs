using BackendFacturas.Models;

namespace BackendFacturas.Repositories;

public class InvoiceRepository : IInvoiceRepository
{
    private readonly List<Invoice> _invoices = new()
    {
        //Registros de facturas 
        new Invoice { InvoiceID = 1, Date = DateTime.Now.AddDays(-30), Amount = 5000, Status = "Pagada", CustomerID = 1 },
        new Invoice { InvoiceID = 2, Date = DateTime.Now.AddDays(-25), Amount = 10000, Status = "Pendiente", CustomerID = 1 },
        new Invoice { InvoiceID = 3, Date = DateTime.Now.AddDays(-20), Amount = 15000, Status = "Anulada", CustomerID = 1 },

        new Invoice { InvoiceID = 4, Date = DateTime.Now.AddDays(-15), Amount = 20000, Status = "Pagada", CustomerID = 2 },
        new Invoice { InvoiceID = 5, Date = DateTime.Now.AddDays(-10), Amount = 25000, Status = "Pendiente", CustomerID = 2 },

        new Invoice { InvoiceID = 6, Date = DateTime.Now.AddDays(-8), Amount = 30000, Status = "Pagada", CustomerID = 3 },
        new Invoice { InvoiceID = 7, Date = DateTime.Now.AddDays(-5), Amount = 35000, Status = "Pendiente", CustomerID = 3 },

        new Invoice { InvoiceID = 8, Date = DateTime.Now.AddDays(-3), Amount = 40000, Status = "Pagada", CustomerID = 4 },
        new Invoice { InvoiceID = 9, Date = DateTime.Now.AddDays(-2), Amount = 45000, Status = "Pendiente", CustomerID = 4 },

        new Invoice { InvoiceID = 10, Date = DateTime.Now.AddDays(-1), Amount = 50000, Status = "Pagada", CustomerID = 5 }
    };

    //Implementación del método para obtener facturas por cliente, excluyendo las anuladas y ordenando por fecha
    public IEnumerable<Invoice> GetInvoicesByCustomer(int customerID)
    {
        return _invoices
            .Where(i => i.CustomerID == customerID && i.Status != "Anulada")
            .OrderByDescending(i => i.Date);
    }
}

using BackendFacturas.Models;

namespace BackendFacturas.Repositories;

public interface IInvoiceRepository
{
    IEnumerable<Invoice> GetInvoicesByCustomer(int customerID);
}

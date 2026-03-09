using BackendFacturas.Models;
using BackendFacturas.Repositories;

namespace BackendFacturas.Services;

public class InvoiceService
{
    private readonly IInvoiceRepository _repository;

    public InvoiceService(IInvoiceRepository repository)
    {
        _repository = repository;
    }

    public IEnumerable<Invoice> GetInvoices(int customerID)
    {
        return _repository.GetInvoicesByCustomer(customerID);
    }
}

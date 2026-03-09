"use client";
import { useState } from "react";

function formatCurrency(amount) {
  return amount?.toLocaleString("es-CO", { style: "currency", currency: "COP", minimumFractionDigits: 0 });
}

const PAGE_SIZE = 10;

export default function Home() {
  const [customerId, setCustomerId] = useState("");
  const [minAmount, setMinAmount] = useState("");
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [sortBy, setSortBy] = useState("date");
  const [sortDir, setSortDir] = useState("desc");
  const [page, setPage] = useState(1);
  const [showTooltip, setShowTooltip] = useState(false);

  const handleSearch = async (e) => {
    e.preventDefault();
    setError("");
    setInvoices([]);
    setPage(1);
    if (!customerId || isNaN(customerId) || Number(customerId) <= 0) {
      setError("Ingrese un ClienteID válido (mayor a 0)");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch(
        `http://localhost:5193/api/Invoices/${customerId}`
      );
      if (!res.ok) {
        const data = await res.json();
        setError(data.message || "Error al consultar la API");
        setLoading(false);
        return;
      }
      const data = await res.json();
      setInvoices(data);
    } catch (err) {
      setError("No se pudo conectar con la API");
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setCustomerId("");
    setMinAmount("");
    setInvoices([]);
    setError("");
    setPage(1);
  };

  // Filtro rápido: solo facturas con monto estrictamente superior a X
  let filteredInvoices = invoices.filter(
    (inv) => {
      if (!minAmount) return true;
      // Quitar separadores de miles y puntos
      const cleanMin = minAmount.replace(/[,\.]/g, "");
      return isNaN(cleanMin) ? true : Number(inv.amount) > Number(cleanMin);
    }
  );

  // Ordenar
  filteredInvoices = filteredInvoices.sort((a, b) => {
    let valA, valB;
    if (sortBy === "amount") {
      valA = Number(a.amount);
      valB = Number(b.amount);
    } else if (sortBy === "date") {
      valA = new Date(a.date);
      valB = new Date(b.date);
    } else if (sortBy === "status") {
      valA = a.status;
      valB = b.status;
    } else {
      valA = a[sortBy];
      valB = b[sortBy];
    }
    if (valA < valB) return sortDir === "asc" ? -1 : 1;
    if (valA > valB) return sortDir === "asc" ? 1 : -1;
    return 0;
  });

  // Paginación
  const totalPages = Math.ceil(filteredInvoices.length / PAGE_SIZE);
  const paginatedInvoices = filteredInvoices.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const handleSort = (column) => {
    if (sortBy === column) {
      setSortDir(sortDir === "asc" ? "desc" : "asc");
    } else {
      setSortBy(column);
      setSortDir("asc");
    }
  };

  // Totales
  const totalFacturas = filteredInvoices.length;
  const totalMonto = filteredInvoices.reduce((acc, inv) => acc + Number(inv.amount), 0);

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center py-10 px-2">
      <div className="w-full max-w-3xl bg-white rounded-lg shadow-lg p-8">
        <h1 className="text-3xl font-bold mb-8 text-center text-green-700">Consulta de Facturas</h1>
        <form
          onSubmit={handleSearch}
          className="flex flex-col sm:flex-row gap-4 mb-8 w-full justify-center"
          aria-label="Formulario de búsqueda de facturas"
        >
          <input
            type="number"
            min="1"
            placeholder="ClienteID"
            value={customerId}
            onChange={(e) => setCustomerId(e.target.value)}
            className={`rounded border px-3 py-2 w-full sm:w-40 focus:outline-none focus:ring-2 transition-all duration-200 bg-white text-gray-900 placeholder-gray-400 font-medium shadow-sm ${error ? 'border-red-500 focus:ring-red-400' : 'border-gray-300 focus:ring-green-400'}`}
            style={{ opacity: 1 }}
            aria-label="ID del cliente"
          />
          <div className="relative w-full sm:w-48">
            <input
              type="text"
              inputMode="numeric"
              pattern="[0-9,\.]*"
              min="0"
              placeholder="Monto superior a ($)"
              value={minAmount}
              onChange={(e) => {
                let val = e.target.value.replace(/[^\d,\.]/g, "");
                setMinAmount(val);
              }}
              className="rounded border border-gray-300 px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-green-400 bg-white text-gray-900 placeholder-gray-400 font-medium shadow-sm transition-all duration-200"
              style={{ opacity: 1 }}
              aria-label="Monto superior a"
              onFocus={() => setShowTooltip(true)}
              onBlur={() => setShowTooltip(false)}
            />
            {showTooltip && (
              <div className="absolute left-0 top-full mt-1 w-56 bg-gray-800 text-white text-xs rounded px-2 py-1 shadow-lg z-10 animate-fade-in" role="tooltip">
                Puedes ingresar valores con separador de miles, por ejemplo: 10,000 o 10.000
              </div>
            )}
          </div>
          <button
            type="submit"
            className="bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700 transition-all duration-200"
            disabled={loading}
            aria-label="Buscar facturas"
          >
            {loading ? (
              <span className="flex items-center gap-2">
                <svg className="animate-spin h-5 w-5 text-white" viewBox="0 0 24 24" aria-label="Cargando">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                </svg>
                Buscando...
              </span>
            ) : (
              "Buscar"
            )}
          </button>
          <button
            type="button"
            onClick={handleReset}
            className="bg-gray-300 text-gray-800 px-6 py-2 rounded hover:bg-gray-400 transition-all duration-200 font-semibold"
            aria-label="Limpiar filtros"
          >
            Limpiar
          </button>
        </form>
        {error && (
          <div className="mb-4 text-red-600 font-bold text-center transition-all duration-200" role="alert">{error}</div>
        )}
        <div className="overflow-x-auto">
          {paginatedInvoices.length > 0 ? (
            <table className="w-full bg-white rounded shadow border border-gray-200" role="table" aria-label="Tabla de facturas">
              <thead className="bg-green-600 text-white select-none" role="rowgroup">
                <tr role="row">
                  <th className="py-2 px-3 cursor-pointer" onClick={() => handleSort("invoiceID")}>ID Factura {sortBy === "invoiceID" && (sortDir === "asc" ? "▲" : "▼")}</th>
                  <th className="py-2 px-3 cursor-pointer" onClick={() => handleSort("date")}>Fecha {sortBy === "date" && (sortDir === "asc" ? "▲" : "▼")}</th>
                  <th className="py-2 px-3 cursor-pointer" onClick={() => handleSort("amount")}>Monto {sortBy === "amount" && (sortDir === "asc" ? "▲" : "▼")}</th>
                  <th className="py-2 px-3 cursor-pointer" onClick={() => handleSort("status")}>Estado {sortBy === "status" && (sortDir === "asc" ? "▲" : "▼")}</th>
                  <th className="py-2 px-3">ID Cliente</th>
                </tr>
              </thead>
              <tbody>
                {paginatedInvoices.map((inv) => (
                  <tr
                    key={inv.invoiceID}
                    className={"border-b last:border-b-0 text-gray-900 font-semibold transition-all duration-200"}
                    role="row"
                  >
                    <td className="py-2 px-3 text-center" role="cell">{inv.invoiceID}</td>
                    <td className="py-2 px-3 text-center" role="cell">{new Date(inv.date).toLocaleDateString()}</td>
                    <td className="py-2 px-3 text-center" role="cell">{formatCurrency(Number(inv.amount))}</td>
                    <td className="py-2 px-3 text-center" role="cell">
                      {inv.status === "Pendiente" ? (
                        <span className="inline-block px-3 py-1 rounded-full bg-yellow-200 text-yellow-800 font-bold text-xs transition-all duration-200">Pendiente</span>
                      ) : inv.status === "Pagada" ? (
                        <span className="inline-block px-3 py-1 rounded-full bg-blue-600 text-white font-bold text-xs transition-all duration-200">Pagada</span>
                      ) : (
                        <span className="inline-block px-3 py-1 rounded-full bg-gray-300 text-gray-800 font-bold text-xs transition-all duration-200">{inv.status}</span>
                      )}
                    </td>
                    <td className="py-2 px-3 text-center" role="cell">{inv.customerID}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            !loading &&
            invoices.length === 0 && (
              <div className="text-gray-600 text-center mt-8 transition-all duration-200">
                No hay facturas para mostrar.
              </div>
            )
          )}
        </div>
        {/* Totales */}
        {paginatedInvoices.length > 0 && (
          <div className="mt-4 flex flex-col sm:flex-row justify-between items-center text-gray-700 text-base font-semibold transition-all duration-200">
            <span>Total de facturas: {totalFacturas}</span>
            <span>Monto total: {formatCurrency(totalMonto)}</span>
          </div>
        )}
        {/* Paginación */}
        {paginatedInvoices.length > 0 && totalPages > 1 && (
          <div className="flex justify-center items-center gap-2 mt-6">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              className="px-3 py-1 rounded bg-gray-200 text-gray-700 font-bold disabled:opacity-50 transition-all duration-200"
              aria-label="Página anterior"
            >
              Anterior
            </button>
            <span className="mx-2 font-semibold">Página {page} de {totalPages}</span>
            <button
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              className="px-3 py-1 rounded bg-gray-200 text-gray-700 font-bold disabled:opacity-50 transition-all duration-200"
              aria-label="Página siguiente"
            >
              Siguiente
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

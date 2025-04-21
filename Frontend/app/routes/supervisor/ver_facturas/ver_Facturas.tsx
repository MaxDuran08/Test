import React, { useEffect, useState } from "react";
import { ver_Facturas } from "./services/ver_facturas";
import { jsPDF } from "jspdf";

const VerFacturas = () => {
  const [facturas, setFacturas] = useState<any[]>([]);
  const [filteredFacturas, setFilteredFacturas] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const fetchFacturas = async () => {
      try {
        const data = await ver_Facturas();
        setFacturas(data);
        setFilteredFacturas(data); // Inicializa las facturas filtradas con todas las facturas
      } catch (err) {
        setError("Error al obtener las facturas");
      } finally {
        setLoading(false);
      }
    };

    fetchFacturas();
  }, []);

  useEffect(() => {
    if (searchTerm === "") {
      setFilteredFacturas(facturas); // Si no hay búsqueda, mostrar todas las facturas
    } else {
      const filtered = facturas.filter((factura) => {
        // Filtrar por cliente o fecha
        const clienteMatch = factura.cliente.toLowerCase().includes(searchTerm.toLowerCase());
        const fechaMatch = new Date(factura.fecha_emision).toLocaleDateString().includes(searchTerm);
        return clienteMatch || fechaMatch;
      });
      setFilteredFacturas(filtered);
    }
  }, [searchTerm, facturas]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  // Función para generar y ver la imagen PNG


  const handleDownloadPDF = (factura) => {
    if (factura.pdf) {
      const link = document.createElement('a');
      link.href = factura.pdf;
      link.download = `factura_${factura.id_factura}.pdf`; 
      link.target = "_blank";
      link.click();
    } else {
      alert('No se encontró el PDF para esta factura.');
    }
  };
  
  
  if (loading) return <p className="text-center text-white">Cargando facturas...</p>;
  if (error) return <p className="text-center text-red-500">{error}</p>;

  return (
    <div className="max-w-6xl mx-auto p-6">
      <h2 className="text-2xl font-bold text-white text-center mb-6">📜 Facturas Emitidas</h2>

      {/* Campo de búsqueda */}
      <div className="mb-6">
        <input
          type="text"
          placeholder="Buscar por cliente o fecha"
          value={searchTerm}
          onChange={handleSearchChange}
          className="w-full p-3 bg-gray-700 text-white rounded-lg focus:outline-none"
        />
      </div>

      {/* Contenedor con scroll */}
      <div className="overflow-y-auto max-h-[80vh]">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 justify-center">
          {filteredFacturas.length > 0 ? (
            filteredFacturas.map((factura) => (
              <div
                key={factura.id_factura}
                id={`factura-${factura.id_factura}`} // Asegúrate de tener un id único para cada factura
                className="bg-gray-800 text-white p-6 rounded-2xl shadow-lg transform hover:scale-105 transition duration-300"
              >
                <h3 className="text-2xl font-semibold text-center">🧾 Factura #{factura.id_factura}</h3>
                <p className="text-white-300 text-center">📅 {new Date(factura.fecha_emision).toLocaleDateString()}</p>
                <hr className="border-white-600 my-3" />
                <p className="text-white-300"><strong>🧑 Cliente:</strong> {factura.cliente}</p>
                <p className="text-white-300"><strong>🏠 Dirección:</strong> {factura.direccion}</p>
                <p className="text-white-300"><strong>👤 Empleado:</strong> {factura.empleado}</p>
                <h4 className="text-lg font-semibold mt-3">📦 Detalles:</h4>
                <ul className="list-disc pl-5 text-gray-400">
                  {factura.detalles.map((detalle, index) => (
                    <li key={`${factura.id_factura}-${detalle.id_detalle || index}`}>
                      📚 {detalle.cantidad}x {detalle.nombre} - Q {detalle.precio_total}
                    </li>
                  ))}
                </ul>
                <span className="text-white-400 font-semibold"> Pago: </span> {factura.metodo_pago}
                <span className="text-white-400 font-bold text-xl text-center mt-3"> Total: </span> Q{factura.total}

                {/* Botones para generar y descargar PNG/PDF */}
                <div className="mt-4 flex justify-between">

                  <button
                    onClick={() => handleDownloadPDF(factura)}
                    className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
                  >
                    Descargar PDF
                  </button>
                </div>
              </div>
            ))
          ) : (
            <p className="text-gray-400 text-center col-span-full">No hay facturas disponibles.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default VerFacturas;

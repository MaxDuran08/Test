import { useEffect, useState } from "react";
import { obtenerEmpleados } from "./services/empleadoServices";
import Modal from "~/common/components/Modal";

const VerEmpleados = () => {
  const [empleados, setEmpleados] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [itemsPerPage, setItemsPerPage] = useState(5);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    cargarEmpleados();
  }, []);

  const cargarEmpleados = async () => {
    setLoading(true);
    setModalOpen(true);
    try {
      const data = await obtenerEmpleados();
      setEmpleados(data["empleados obtenidos"]);
    } catch (err) {
      console.error("Error al obtener empleados", err);
    } finally {
      setLoading(false);
      setModalOpen(false);
    }
  };

  const totalPages = Math.ceil(empleados.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const displayedEmpleados = empleados.slice(startIndex, startIndex + itemsPerPage);

  return (
    <div className="max-w-4xl mx-auto p-4">
      <div className="bg-gray-800 text-white shadow-lg rounded-lg p-6">
        <h2 className="text-2xl font-semibold mb-6">Lista de Empleados</h2>
        <div className="mb-4">
          <label className="mr-2">Mostrar:</label>
          <select
            value={itemsPerPage}
            onChange={(e) => setItemsPerPage(Number(e.target.value))}
            className="p-2 border rounded-md bg-gray-800 text-white"
          >
            <option value={5}>5</option>
            <option value={10}>10</option>
            <option value={20}>20</option>
          </select>
        </div>
        <table className="w-full border border-gray-700">
          <thead>
            <tr className="bg-gray-700 text-white">
              <th className="p-2 border">CUI</th>
              <th className="p-2 border">Nombre</th>
              <th className="p-2 border">Correo</th>
              <th className="p-2 border">Teléfono</th>
              <th className="p-2 border">Edad</th>
              <th className="p-2 border">Estado</th>
            </tr>
          </thead>
          <tbody>
            {displayedEmpleados.length > 0 ? (
              displayedEmpleados.map((empleado, index) => (
                <tr key={index} className="bg-gray-900 text-white hover:bg-gray-700">
                  <td className="p-2 border">{empleado.CUI}</td>
                  <td className="p-2 border">{empleado.Nombre}</td>
                  <td className="p-2 border">{empleado.Correo}</td>
                  <td className="p-2 border">{empleado.Telefono}</td>
                  <td className="p-2 border">{empleado.Edad}</td>
                  <td className="p-2 border">{empleado.Estado}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={6} className="p-2 text-center">No hay empleados registrados.</td>
              </tr>
            )}
          </tbody>
        </table>
        <div className="flex justify-between mt-4">
          <button
            className="px-4 py-2 bg-blue-500 text-white rounded-md disabled:bg-gray-500"
            disabled={currentPage === 1}
            onClick={() => setCurrentPage((prev) => prev - 1)}
          >
            Anterior
          </button>
          <span>Página {currentPage} de {totalPages}</span>
          <button
            className="px-4 py-2 bg-blue-500 text-white rounded-md disabled:bg-gray-500"
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage((prev) => prev + 1)}
          >
            Siguiente
          </button>
        </div>
      </div>
      <Modal isOpen={modalOpen} message={loading ? "Cargando empleados..." : "Carga completada"} type={loading ? "info" : "success"} onClose={() => setModalOpen(false)} />
    </div>
  );
};

export default VerEmpleados;
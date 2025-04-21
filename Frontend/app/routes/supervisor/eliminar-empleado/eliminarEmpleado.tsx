import React, { useState, useEffect } from "react";
import Modal from "~/common/components/Modal";
import { obtenerEmpleado, deleteEmpleado } from "./services/deleteEmpleado";

const ModificarEmpleado = () => {
  const [empleados, setEmpleados] = useState<{ cui: string , nombre: string, estado: string}[]>([]);
  const [cui, setCui] = useState("");
  const [causa, setCausa] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [modalMessage, setModalMessage] = useState("");
  const [modalType, setModalType] = useState<"success" | "error">("success");

  // Obtener empleados al cargar el componente
  useEffect(() => {
    const cargarEmpleados = async () => {
      try {
        const data = await obtenerEmpleado();
        setEmpleados((data as any[]).map(emp => ({
          cui: emp.CUI,
          nombre: emp.Nombre,
          estado: emp.Estado
        })));
      } catch (error) {
        console.error("Error al obtener empleados", error);
      }
    };
    cargarEmpleados();
  }, []);

  // Manejar la selección de CUI
  const handleSelectEmpleado = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setCui(e.target.value);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
  
    const id_role = 2; // Puedes cambiarlo según sea necesario
  
    try {
      await deleteEmpleado({ CUI: Number(cui), Causa: causa });
      setModalMessage("Empleado eliminado correctamente!");
      setModalType("success");
  
      // Actualizar lista de empleados eliminando el seleccionado

      setEmpleados(empleados.filter(emp => emp.cui !== cui ));
      setCui(""); // Resetear el select
      setCausa(""); // Resetear la causa
    } catch (error) {
      setModalMessage("Hubo un error al eliminar al empleado.");
      setModalType("error");
    }
  
    setModalOpen(true);
  };

  return (
    <div className="max-w-4xl mx-auto p-4">
      <div className="bg-gray-800 text-white shadow-lg rounded-lg p-6">
        <h2 className="text-2xl font-semibold mb-6">Eliminar Empleado</h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="cui" className="block text-sm font-medium mb-2">
              Selecciona el Empleado (CUI):
            </label>
            <select
              id="cui"
              value={cui}
              onChange={handleSelectEmpleado}
              required
              className="w-full px-4 py-2 border border-gray-600 rounded-md bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="" hidden>Selecciona el CUI</option>
              {empleados
                .filter(emp => emp.estado === "Contratado") // Filtra solo los empleados con estado "Contratado"
                .map(emp => (
                  <option key={emp.cui} value={emp.cui}>
                    {emp.cui + " - " + emp.nombre}
                  </option>
                ))}
            </select>

          </div>
          <div>
            <label htmlFor="causa" className="block text-sm font-medium mb-2">Causa de despido:</label>
            <input
              type="text"
              id="causa"
              value={causa}
              onChange={(e) => setCausa(e.target.value)}
              required
              className="w-full px-4 py-2 border border-gray-600 rounded-md bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <button
            type="submit"
            className="w-full py-3 bg-blue-500 text-white font-semibold rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            Eliminar
          </button>
        </form>
      </div>

      {/* Modal Component */}
      <Modal isOpen={modalOpen} message={modalMessage} type={modalType} onClose={() => setModalOpen(false)} />
    </div>
  );
};

export default ModificarEmpleado;

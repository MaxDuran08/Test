import React, { useState, useEffect } from "react";
import Modal from "~/common/components/Modal";
import { eliminarSupervisor } from "./services/supervisorServices";
import { obtenerSupervisores } from "../services/gerenteServices";
import TablaSupervisores from "../components/TablaSupervisores";

const EliminarSupervisor = () => {
  const [cuiSeleccionado, setCuiSeleccionado] = useState("");
  const [causa, setCausa] = useState("");
  const [supervisores, setSupervisores] = useState<any[]>([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalMessage, setModalMessage] = useState("");
  const [modalType, setModalType] = useState<"success" | "error">("success");

  // Cargar supervisores al montar el componente
  useEffect(() => {
    cargarSupervisores();
  }, []);

  const cargarSupervisores = async () => {
    try {
      const data = await obtenerSupervisores();
      setSupervisores(data);
    } catch (err) {
      console.error("Error al obtener supervisores", err);
    }
  };

  const handleEliminar = async () => {
    if (!cuiSeleccionado && !causa) return;

    try {
      await eliminarSupervisor({ CUI: Number(cuiSeleccionado), Causa: causa });
      setModalMessage("¡Supervisor eliminado correctamente!");
      setModalType("success");
      setModalOpen(true);
      setCuiSeleccionado("");
      cargarSupervisores(); // Recargar lista
    } catch (err) {
      console.error("Error en la eliminación", err);
      setModalMessage("Error al eliminar el supervisor.");
      setModalType("error");
      setModalOpen(true);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-4">
      <div className="bg-gray-800 text-white shadow-lg rounded-lg p-6">
        <h2 className="text-2xl font-semibold mb-6">Eliminar Supervisor</h2>
        <div className="space-y-4">
          <label htmlFor="cui" className="block text-sm font-medium mb-2">
            Selecciona un supervisor:
          </label>
          <select
              id="cui"
              value={cuiSeleccionado}
              onChange={(e) => setCuiSeleccionado(e.target.value)}
              className="w-full px-4 py-2 border border-gray-600 rounded-md bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="" disabled hidden>-- Seleccionar --</option>
              hidden
              {supervisores
                .filter((supervisor) => supervisor.Estado === "Contratado") // Filtrar solo los contratados
                .map((supervisor) => (
                  <option key={supervisor.CUI} value={supervisor.CUI}>
                    {supervisor.Nombre} - {supervisor.CUI}
                  </option>
                ))}
            </select>

          <div>
            <label htmlFor="causa" className="block text-sm font-medium mb-2">Descripcion:</label>
            <input
              type="string"
              id="causa"
              value={causa}
              onChange={(e) => setCausa(e.target.value)}
              required
              className="w-full px-4 py-2 border border-gray-600 rounded-md bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <button
            onClick={handleEliminar}
            className="w-full py-3 bg-red-500 text-white font-semibold rounded-md hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500"
            disabled={!cuiSeleccionado}
          >
            Eliminar
          </button>
        </div>
      </div>

      {/* Tabla de Supervisores */}
      <TablaSupervisores supervisores={supervisores} />

      {/* Modal Component */}
      <Modal isOpen={modalOpen} message={modalMessage} type={modalType} onClose={() => setModalOpen(false)} />
    </div>
  );
};

export default EliminarSupervisor;
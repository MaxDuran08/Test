import React, { useState, useEffect } from "react";
import Modal from "~/common/components/Modal";
import { modificarSupervisor } from "./services/supervisorServices"; 
import { obtenerSupervisores, obtenerRoles } from "../services/gerenteServices";
import TablaSupervisores from "../components/TablaSupervisores";

const ModificarSupervisor = () => {
  const [cuiSeleccionado, setCuiSeleccionado] = useState("");
  const [supervisores, setSupervisores] = useState<any[]>([]);
  const [formData, setFormData] = useState({
    Nombre: "",
    Correo: "",
    Telefono: "",
    Edad: "",
    Genero: "",
    Estado: "",
    Roles_id: "",
  });
  const [modalOpen, setModalOpen] = useState(false);
  const [modalMessage, setModalMessage] = useState("");
  const [modalType, setModalType] = useState<"success" | "error">("success");
  const [roles, setRoles] = useState<any[]>([]); // Estado para los roles

  useEffect(() => {
    cargarSupervisores();
    cargarRoles(); // Cargar los roles cuando se monte el componente
  }, []);

  const cargarSupervisores = async () => {
    try {
      const data = await obtenerSupervisores();
      setSupervisores(data);
    } catch (err) {
      console.error("Error al obtener supervisores", err);
    }
  };

  const cargarRoles = async () => {
    try {
        const data = await obtenerRoles();
        setRoles(data["Roles obtenidos"]);
      } catch (err) {
        console.error("Error al obtener roles", err);
      }
  };

  const handleSeleccionSupervisor = (cui: string) => {
    setCuiSeleccionado(cui);
    const supervisor = supervisores.find((sup) => sup.CUI === Number(cui));
    if (supervisor) {
        const rol = roles.find((role) => role.nombre.toLowerCase() === supervisor.Puesto.toLowerCase());
      setFormData({
        Nombre: supervisor.Nombre,
        Correo: supervisor.Correo,
        Telefono: supervisor.Telefono,
        Edad: supervisor.Edad.toString(),
        Genero: supervisor.Genero,
        Estado: supervisor.Estado,
        Roles_id: rol ? rol.id.toString() : "",
      });
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleModificar = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!cuiSeleccionado) return;

    // Validaciones antes de enviar la solicitud
    if (formData.Nombre.length > 150) {
      setModalMessage("El nombre no puede tener más de 150 caracteres.");
      setModalType("error");
      setModalOpen(true);
      return;
    }

    if (formData.Correo.length > 100) {
      setModalMessage("El correo no puede tener más de 100 caracteres.");
      setModalType("error");
      setModalOpen(true);
      return;
    }

    if (formData.Telefono.length > 20) {
      setModalMessage("El teléfono no puede tener más de 20 caracteres.");
      setModalType("error");
      setModalOpen(true);
      return;
    }

    if (parseInt(formData.Edad) < 18) {
      setModalMessage("La edad debe ser mayor o igual a 18 años.");
      setModalType("error");
      setModalOpen(true);
      return;
    }

    if (!["Masculino", "Femenino"].includes(formData.Genero)) {
      setModalMessage("El género debe ser 'Masculino' o 'Femenino'.");
      setModalType("error");
      setModalOpen(true);
      return;
    }

    if (!formData.Roles_id) {
      setModalMessage("Debe seleccionar un rol.");
      setModalType("error");
      setModalOpen(true);
      return;
    }

    try {
      await modificarSupervisor({ CUI: Number(cuiSeleccionado), ...formData });
      setModalMessage("¡Supervisor modificado correctamente!");
      setModalType("success");
      setModalOpen(true);
      cargarSupervisores();
    } catch (err) {
      console.error("Error en la modificación", err);
      setModalMessage("Error al modificar el supervisor.");
      setModalType("error");
      setModalOpen(true);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-4">
      <div className="bg-gray-800 text-white shadow-lg rounded-lg p-6">
        <h2 className="text-2xl font-semibold mb-6">Modificar Supervisor</h2>

        <div className="space-y-4">
          <label htmlFor="cui" className="block text-sm font-medium mb-2">Selecciona un supervisor:</label>
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
        </div>

        {cuiSeleccionado && (
          <form onSubmit={handleModificar} className="space-y-6 mt-4">
            <div>
              <label htmlFor="Nombre" className="block text-sm font-medium mb-2">Nombre:</label>
              <input type="text" id="Nombre" value={formData.Nombre} onChange={handleChange} maxLength={150} required className="w-full px-4 py-2 border border-gray-600 rounded-md bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>

            <div>
              <label htmlFor="Correo" className="block text-sm font-medium mb-2">Correo Electrónico:</label>
              <input type="email" id="Correo" value={formData.Correo} onChange={handleChange} maxLength={100} required className="w-full px-4 py-2 border border-gray-600 rounded-md bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>

            <div>
              <label htmlFor="Telefono" className="block text-sm font-medium mb-2">Teléfono:</label>
              <input type="text" id="Telefono" value={formData.Telefono} onChange={handleChange} maxLength={20} required className="w-full px-4 py-2 border border-gray-600 rounded-md bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>

            <div>
              <label htmlFor="Edad" className="block text-sm font-medium mb-2">Edad (mayor de 18 años):</label>
              <input type="number" id="Edad" value={formData.Edad} onChange={handleChange} min={18} required className="w-full px-4 py-2 border border-gray-600 rounded-md bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>

            <div>
              <label htmlFor="Genero" className="block text-sm font-medium mb-2">Género:</label>
              <select id="Genero" value={formData.Genero} onChange={handleChange} required className="w-full px-4 py-2 border border-gray-600 rounded-md bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500">
                <option value="">-- Seleccionar --</option>
                <option value="Masculino">Masculino</option>
                <option value="Femenino">Femenino</option>
              </select>
            </div>

            <div>
              <label htmlFor="Estado" className="block text-sm font-medium mb-2">Estado:</label>
              <select id="Estado" value={formData.Estado} onChange={handleChange} required className="w-full px-4 py-2 border border-gray-600 rounded-md bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500">
                <option value="">-- Seleccionar --</option>
                <option value="Contratado">Contratado</option>
                <option value="Despedido">Despedido</option>
              </select>
            </div>

            <div>
              <label htmlFor="Roles_id" className="block text-sm font-medium mb-2">Rol:</label>
              <select id="Roles_id" value={formData.Roles_id} onChange={handleChange} required className="w-full px-4 py-2 border border-gray-600 rounded-md bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500">
                <option value="">-- Seleccionar --</option>
                {roles.map((role) => (
                  <option key={role.id} value={role.id}>
                    {role.nombre}
                  </option>
                ))}
              </select>
            </div>

            <button type="submit" className="w-full py-3 bg-blue-500 text-white font-semibold rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500">
              Modificar
            </button>
          </form>
        )}
      </div>

      <TablaSupervisores supervisores={supervisores} />
      <Modal isOpen={modalOpen} message={modalMessage} type={modalType} onClose={() => setModalOpen(false)} />
    </div>
  );
};

export default ModificarSupervisor;
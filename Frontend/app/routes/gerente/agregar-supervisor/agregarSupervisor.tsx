import React, { useState, useEffect } from "react";
import Modal from "~/common/components/Modal";
import { agregarSupervisor } from "./services/supervisorServices";
import { obtenerSupervisores } from "../services/gerenteServices";
import TablaSupervisores from "../components/TablaSupervisores";

const AgregarSupervisor = () => {
  const [cui, setCui] = useState("");
  const [nombre, setNombre] = useState("");
  const [email, setEmail] = useState("");
  const [telefono, setTelefono] = useState("");
  const [edad, setEdad] = useState("");
  const [genero, setGenero] = useState("");
  const [supervisores, setSupervisores] = useState<any[]>([]); // Guardará la lista de supervisores
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
      setSupervisores(data); // Guardar los supervisores en el estado
    } catch (err) {
      console.error("Error al obtener supervisores", err);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validaciones antes de enviar la solicitud
    if (nombre.length > 150) {
      setModalMessage("El nombre no puede tener más de 150 caracteres.");
      setModalType("error");
      setModalOpen(true);
      return;
    }

    if (email.length > 100) {
      setModalMessage("El correo no puede tener más de 100 caracteres.");
      setModalType("error");
      setModalOpen(true);
      return;
    }

    if (telefono.length > 20) {
      setModalMessage("El teléfono no puede tener más de 20 caracteres.");
      setModalType("error");
      setModalOpen(true);
      return;
    }

    if (parseInt(edad) < 18) {
      setModalMessage("La edad debe ser mayor o igual a 18 años.");
      setModalType("error");
      setModalOpen(true);
      return;
    }

    if (!["Masculino", "Femenino"].includes(genero)) {
      setModalMessage("El género debe ser 'Masculino' o 'Femenino'.");
      setModalType("error");
      setModalOpen(true);
      return;
    }

    const nuevoSupervisor = {
      CUI: Number(cui),
      Nombre: nombre,
      Correo: email,
      Telefono: telefono,
      Edad: parseInt(edad),
      Genero: genero,
    };

    try {
      await agregarSupervisor(nuevoSupervisor);
      setModalMessage("¡Supervisor agregado correctamente!");
      setModalType("success");
      setModalOpen(true);

      // Limpiar los campos
      setCui("");
      setNombre("");
      setEmail("");
      setTelefono("");
      setEdad("");
      setGenero("");

      // Cargar la lista actualizada de supervisores
      cargarSupervisores();
    } catch (err) {
      console.error("Error en la petición:", err);
      setModalMessage("Error al agregar el supervisor.");
      setModalType("error");
      setModalOpen(true);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-4">
      <div className="bg-gray-800 text-white shadow-lg rounded-lg p-6">
        <h2 className="text-2xl font-semibold mb-6">Agregar Supervisor</h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="cui" className="block text-sm font-medium mb-2">
              CUI (13 dígitos):
            </label>
            <input
              type="text"
              id="cui"
              value={cui}
              onChange={(e) => setCui(e.target.value)}
              required
              pattern="\d{13}"
              maxLength={13}
              className="w-full px-4 py-2 border border-gray-600 rounded-md bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label htmlFor="nombre" className="block text-sm font-medium mb-2">
              Nombre:
            </label>
            <input
              type="text"
              id="nombre"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              required
              maxLength={150}
              className="w-full px-4 py-2 border border-gray-600 rounded-md bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label htmlFor="email" className="block text-sm font-medium mb-2">
              Correo Electrónico:
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              maxLength={100}
              className="w-full px-4 py-2 border border-gray-600 rounded-md bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label htmlFor="telefono" className="block text-sm font-medium mb-2">
              Teléfono (máx. 20 caracteres, solo números y guiones):
            </label>
            <input
              type="tel"
              id="telefono"
              value={telefono}
              onChange={(e) => setTelefono(e.target.value)}
              required
              pattern="^\d{1,20}(-\d{1,20})?$"
              maxLength={20}
              className="w-full px-4 py-2 border border-gray-600 rounded-md bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label htmlFor="edad" className="block text-sm font-medium mb-2">
              Edad (mayor de 18 años):
            </label>
            <input
              type="number"
              id="edad"
              value={edad}
              onChange={(e) => setEdad(e.target.value)}
              required
              min={18}
              className="w-full px-4 py-2 border border-gray-600 rounded-md bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label htmlFor="genero" className="block text-sm font-medium mb-2">
              Género:
            </label>
            <select
              id="genero"
              value={genero}
              onChange={(e) => setGenero(e.target.value)}
              required
              className="w-full px-4 py-2 border border-gray-600 rounded-md bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">-- Seleccionar --</option>
              <option value="Masculino">Masculino</option>
              <option value="Femenino">Femenino</option>
            </select>
          </div>
          <button
            type="submit"
            className="w-full py-3 bg-blue-500 text-white font-semibold rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            Agregar
          </button>
        </form>
      </div>

      {/* Tabla de Supervisores */}
      <TablaSupervisores supervisores={supervisores} />

      {/* Modal Component */}
      <Modal isOpen={modalOpen} message={modalMessage} type={modalType} onClose={() => setModalOpen(false)} />
    </div>
  );
};

export default AgregarSupervisor;

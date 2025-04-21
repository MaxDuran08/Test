import React, { useState } from "react";
import Modal from "~/common/components/Modal";
import { agregarEmpleado } from "./services/addempleadoServices"; 

const AgregarEmpleado = () => {
  const [nombre, setNombre] = useState("");
  const [cui, setCui] = useState("");
  const [telefono, setTelefono] = useState("");
  const [email, setEmail] = useState("");
  const [edad, setEdad] = useState("");
  const [genero, setGenero] = useState("");
  const [fecha, setFecha] = useState("");
  const [foto, setFoto] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [modalMessage, setModalMessage] = useState("");
  const [modalType, setModalType] = useState<"success" | "error">("success");

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
        const reader = new FileReader();
        reader.onloadend = () => {
          if (reader.result && typeof reader.result === "string") {
            const base64String = reader.result.split(",")[1] ?? "";
            if (base64String) {
              setFoto(base64String);
            } else {
              console.error("Error al procesar la imagen");
            }
          }
        };
        reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Crear el objeto de datos para enviar a la API
    const empleadoData = {
      cui: Number(cui),
      nombre,
      email,
      telefono: Number(telefono),
      edad: Number(edad),  // Convierte la edad a número
      genero,
      fecha,
      foto
    };

    try {
      await agregarEmpleado(empleadoData);
      setModalMessage("Empleado agregado correctamente!");
      setModalType("success");
    } catch (error) {
      setModalMessage("Hubo un error al agregar al empleado.");
      setModalType("error");
    }

    setModalOpen(true);
    setNombre("");
    setEmail("");
    setTelefono("");
    setCui("");
    setEdad("");
    setGenero("");
    setFecha("");
    setFoto("");
  };
  
  const handleModalClose = () => {
    setModalOpen(false);
  };

  return (
    <div className="max-w-4xl mx-auto p-4">
      <div className="bg-gray-800 text-white shadow-lg rounded-lg p-6">
        <h2 className="text-2xl font-semibold mb-6">Agregar Empleado</h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Los inputs siguen siendo los mismos */}
          <div>
            <label htmlFor="cui" className="block text-sm font-medium mb-2">
              CUI:
            </label>
            <input
              type="text"
              id="cui"
              value={cui}
              onChange={(e) => setCui(e.target.value)}
              required
              className="w-full px-4 py-2 border border-gray-600 rounded-md bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label htmlFor="nombre" className="block text-sm font-medium mb-2">
              Nombre Completo:
            </label>
            <input
              type="text"
              id="nombre"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              required
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
              className="w-full px-4 py-2 border border-gray-600 rounded-md bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label htmlFor="telefono" className="block text-sm font-medium mb-2">
              Teléfono:
            </label>
            <input
              type="tel"
              id="telefono"
              value={telefono}
              onChange={(e) => setTelefono(e.target.value)}
              required
              className="w-full px-4 py-2 border border-gray-600 rounded-md bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="space-y-4">
            {/* Edad y Género */}
            <div className="flex gap-4">
              <div className="w-1/2">
                <label htmlFor="edad" className="block text-sm font-medium mb-2">
                  Edad:
                </label>
                <input
                  type="number"
                  id="edad"
                  value={edad}
                  onChange={(e) => setEdad(e.target.value)}
                  required
                  className="w-full px-4 py-2 border border-gray-600 rounded-md bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="w-1/2">
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
                  <option value="" hidden>Selecciona tu género</option>
                  <option value="masculino">Masculino</option>
                  <option value="femenino">Femenino</option>
                  <option value="otro">Otro</option>
                </select>
              </div>
            </div>

            {/* Fecha de contratación y Fotografía */}
            <div className="flex gap-4">
              <div className="w-1/2">
                <label htmlFor="fecha" className="block text-sm font-medium mb-2">
                  Fecha de Contratación:
                </label>
                <input
                  type="date"
                  id="fecha"
                  value={fecha}
                  onChange={(e) => setFecha(e.target.value)}
                  required
                  className="w-full px-4 py-2 border border-gray-600 rounded-md bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="w-1/2">
                <label htmlFor="foto" className="block text-sm font-medium mb-2">
                  Fotografía:
                </label>
                <input
                  type="file"
                  id="foto"
                  accept="image/*"
                  onChange={handleFileChange}
                  required
                  className="w-full px-4 py-2 border border-gray-600 rounded-md bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-blue-500 text-white font-semibold rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              Agregar
            </button>
          </div>
        </form>
      </div>

      {/* Modal Component */}
      <Modal
        isOpen={modalOpen}
        message={modalMessage}
        type={modalType}
        onClose={handleModalClose}
      />
    </div>
  );
};

export default AgregarEmpleado;

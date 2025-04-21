import React, { useState, useEffect } from "react";
import Modal from "~/common/components/Modal";
import { obtenerEmpleado, modificarEmpleado } from "./services/empleadoService";

const ModificarEmpleado = () => {
  const [empleados, setEmpleados] = useState<{ cui: string, nombre: string, telefono: string, email: string, estado: string }[]>([]);
  const [cui, setCui] = useState("");
  const [nombre, setNombre] = useState("");
  const [telefono, setTelefono] = useState("");
  const [email, setEmail] = useState("");
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
          telefono: emp.Telefono, 
          email: emp.Correo,
          estado: emp.Estado
        })));
      } catch (error) {
        console.error("Error al obtener empleados", error);
      }
    };
    cargarEmpleados();
  }, []);

  // Cuando se selecciona un empleado, llenar los campos
  const handleSelectEmpleado = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const cuiSeleccionado = e.target.value; // Asegúrate de que esto sea un string

    setCui(cuiSeleccionado);

    // Verificar si el cui seleccionado está presente en los empleados
    const empleado = empleados.find(emp => String(emp.cui) === String(cuiSeleccionado)); // La comparación se hace como string
    if (empleado) {
      setNombre(empleado.nombre); // No se puede modificar
      setEmail(empleado.email);
      setTelefono(empleado.telefono.toString()); // Convertir número a string para el input
    }
};


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      await modificarEmpleado({ cui, correo: email, telefono: Number(telefono)});
      setModalMessage("Empleado modificado correctamente!");
      setModalType("success");
    } catch (error) {
      setModalMessage("Hubo un error al modificar al empleado.");
      setModalType("error");
    }

    setModalOpen(true);
  };

  return (
    <div className="max-w-4xl mx-auto p-4">
      <div className="bg-gray-800 text-white shadow-lg rounded-lg p-6">
        <h2 className="text-2xl font-semibold mb-6">Modificar Empleado</h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="cui" className="block text-sm font-medium mb-2">CUI:</label>
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
            <label htmlFor="nombre" className="block text-sm font-medium mb-2">Nombre:</label>
            <input
              type="text"
              id="nombre"
              value={nombre}
              disabled
              className="w-full px-4 py-2 border border-gray-600 rounded-md bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label htmlFor="email" className="block text-sm font-medium mb-2">Correo Electrónico:</label>
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
            <label htmlFor="telefono" className="block text-sm font-medium mb-2">Teléfono:</label>
            <input
              type="tel"
              id="telefono"
              value={telefono}
              onChange={(e) => setTelefono(Number(e.target.value).toString())}
              required
              className="w-full px-4 py-2 border border-gray-600 rounded-md bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <button
            type="submit"
            className="w-full py-3 bg-blue-500 text-white font-semibold rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            Modificar
          </button>
        </form>
      </div>

      {/* Modal Component */}
      <Modal isOpen={modalOpen} message={modalMessage} type={modalType} onClose={() => setModalOpen(false)} />
    </div>
  );
};

export default ModificarEmpleado;

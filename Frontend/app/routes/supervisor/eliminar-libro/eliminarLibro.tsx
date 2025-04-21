import React, { useState, useEffect } from "react";
import Modal from "~/common/components/Modal";
import { obtenerLibros, deleteLibro } from "./services/deleteLibro";

const EliminarLibro = () => {
  const [libros, setLibros] = useState<{ idLibros: number; Titulo: string }[]>([]);
  const [idLibro, setIdLibro] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [modalMessage, setModalMessage] = useState("");
  const [modalType, setModalType] = useState<"success" | "error">("success");

  // Obtener libros al cargar el componente
  useEffect(() => {
    const cargarLibros = async () => {
      try {
        const data = await obtenerLibros();
        setLibros(data);
      } catch (error) {
        console.error("Error al obtener libros", error);
      }
    };
    cargarLibros();
  }, []);

  // Manejar la selección de un libro
  const handleSelectLibro = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setIdLibro(e.target.value);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
  
    try {
      await deleteLibro(Number(idLibro));
      setModalMessage("Libro eliminado correctamente!");
      setModalType("success");
  
      // Actualizar lista de libros eliminando el seleccionado
      setLibros(prevLibros => prevLibros.filter(libro => libro.idLibros !== Number(idLibro)));
      setIdLibro(""); // Resetear el select
    } catch (error) {
      setModalMessage("Hubo un error al eliminar el libro.");
      setModalType("error");
    }
  
    setModalOpen(true);
  };

  return (
    <div className="max-w-4xl mx-auto p-4">
      <div className="bg-gray-800 text-white shadow-lg rounded-lg p-6">
        <h2 className="text-2xl font-semibold mb-6">Eliminar Libro</h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="idLibro" className="block text-sm font-medium mb-2">
              Selecciona el Libro:
            </label>
            <select
              id="idLibro"
              value={idLibro}
              onChange={handleSelectLibro}
              required
              className="w-full px-4 py-2 border border-gray-600 rounded-md bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="" hidden>Selecciona un libro</option>
              {libros.map(libro => (
                <option key={libro.idLibros} value={libro.idLibros}>
                  {libro.idLibros+" - "+libro.Titulo}
                </option>
              ))}
            </select>
          </div>

          <button
            type="submit"
            className="w-full py-3 bg-red-500 text-white font-semibold rounded-md hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500"
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

export default EliminarLibro;

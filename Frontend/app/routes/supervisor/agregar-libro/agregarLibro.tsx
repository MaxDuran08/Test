import React, { useState } from "react";
import Modal from "~/common/components/Modal";
import { agregarLibro } from "./services/libroService";

const AgregarLibro = () => {
  const [titulo, setTitulo] = useState("");
  const [autor, setAutor] = useState("");
  const [fechaLanzamiento, setFechaLanzamiento] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [genero, setGenero] = useState("");
  const [stock, setStock] = useState("");
  const [precio, setPrecio] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [modalMessage, setModalMessage] = useState("");
  const [modalType, setModalType] = useState<"success" | "error">("success");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Crear el objeto de datos para enviar a la API
    const libroData = {
      titulo,
      autor,
      fecha_lanzamiento: fechaLanzamiento,
      descripcion,
      genero,
      stock: Number(stock),
      precio: Number(precio)
    };

    try {
      await agregarLibro(libroData);
      setModalMessage("Libro agregado correctamente!");
      setModalType("success");
    } catch (error) {
      setModalMessage("Hubo un error al agregar el libro.");
      setModalType("error");
    }

    setModalOpen(true);
    setTitulo("");
    setAutor("");
    setFechaLanzamiento("");
    setDescripcion("");
    setGenero("");
    setStock("");
    setPrecio("");
  };

  const handleModalClose = () => {
    setModalOpen(false);
  };

  return (
    <div className="max-w-4xl mx-auto p-4">
      <div className="bg-gray-800 text-white shadow-lg rounded-lg p-6">
        <h2 className="text-2xl font-semibold mb-6">Agregar Libro</h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Título */}
          <div>
            <label htmlFor="titulo" className="block text-sm font-medium mb-2">
              Título:
            </label>
            <input
              type="text"
              id="titulo"
              value={titulo}
              onChange={(e) => setTitulo(e.target.value)}
              required
              className="w-full px-4 py-2 border border-gray-600 rounded-md bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Autor */}
          <div>
            <label htmlFor="autor" className="block text-sm font-medium mb-2">
              Autor:
            </label>
            <input
              type="text"
              id="autor"
              value={autor}
              onChange={(e) => setAutor(e.target.value)}
              required
              className="w-full px-4 py-2 border border-gray-600 rounded-md bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Fecha de lanzamiento */}
          <div>
            <label htmlFor="fechaLanzamiento" className="block text-sm font-medium mb-2">
              Fecha de Lanzamiento:
            </label>
            <input
              type="date"
              id="fechaLanzamiento"
              value={fechaLanzamiento}
              onChange={(e) => setFechaLanzamiento(e.target.value)}
              required
              className="w-full px-4 py-2 border border-gray-600 rounded-md bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Descripción */}
          <div>
            <label htmlFor="descripcion" className="block text-sm font-medium mb-2">
              Descripción:
            </label>
            <textarea
              id="descripcion"
              value={descripcion}
              onChange={(e) => setDescripcion(e.target.value)}
              required
              className="w-full px-4 py-2 border border-gray-600 rounded-md bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            ></textarea>
          </div>

          {/* Género */}
          <div>
            <label htmlFor="genero" className="block text-sm font-medium mb-2">
              Género:
            </label>
            <input
              type="text"
              id="genero"
              value={genero}
              onChange={(e) => setGenero(e.target.value)}
              required
              className="w-full px-4 py-2 border border-gray-600 rounded-md bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Stock */}
          <div>
            <label htmlFor="stock" className="block text-sm font-medium mb-2">
              Stock:
            </label>
            <input
              type="number"
              id="stock"
              value={stock}
              onChange={(e) => setStock(e.target.value)}
              required
              min="0"
              className="w-full px-4 py-2 border border-gray-600 rounded-md bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Precio */}
          <div>
            <label htmlFor="precio" className="block text-sm font-medium mb-2">
              Precio:
            </label>
            <input
              type="number"
              id="precio"
              value={precio}
              onChange={(e) => setPrecio(e.target.value)}
              required
              step="0.01"
              min="0"
              className="w-full px-4 py-2 border border-gray-600 rounded-md bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Botón de enviar */}
          <button
            type="submit"
            className="w-full py-3 bg-blue-500 text-white font-semibold rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            Agregar
          </button>
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

export default AgregarLibro;

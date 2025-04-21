import React, { useState, useEffect } from "react";
import Modal from "~/common/components/Modal";
import { obtenerLibros, modificarLibro } from "./services/libroService";

const ModificarLibro = () => {
  const [libros, setLibros] = useState<{idLibros: number, Titulo: string, Autor: string, Fecha_lanzamiento: Date, Descripcion: string, Genero: string, Stock: number, Precio: number }[]>([]);
  const [idLibros, setIdLibros] = useState("");
  const [titulo, setTitulo] = useState("");
  const [autor, setAutor] = useState("");
  const [fecha, setFecha] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [genero, setGenero] = useState("");
  const [stock, setStock] = useState("");
  const [precio, setPrecio] = useState("");
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

  


  // Cuando se selecciona un empleado, llenar los campos
  const handleSelectLibro = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const idLibroSeleccionado = e.target.value; // Asegúrate de que esto sea un string
  
    setIdLibros(idLibroSeleccionado);
  
    // Verificar si el libro seleccionado está presente en los libros
    const libro = libros.find(emp => String(emp.idLibros) === String(idLibroSeleccionado)); // La comparación se hace como string
    if (libro) {
      setTitulo(libro.Titulo);
      setAutor(libro.Autor);
  
      // Convertir la fecha en formato adecuado para input[type="date"] (YYYY-MM-DD)
      const fecha = new Date(libro.Fecha_lanzamiento);
      const fechaFormateada = fecha.toISOString().split('T')[0]; // Formato YYYY-MM-DD
      setFecha(fechaFormateada);
  
      setDescripcion(libro.Descripcion);
      setGenero(libro.Genero);
      setStock(String(libro.Stock));
      setPrecio(String(libro.Precio));
    }
  };
  


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      await modificarLibro({ idLibros: Number(idLibros), titulo, autor, fecha: new Date(fecha), descripcion, genero, stock: Number(stock), precio: Number(precio) });
      setModalMessage("Libro modificado correctamente!");
      setModalType("success");
    } catch (error) {
      console.error("Error al modificar libro", error);
      setModalMessage("Error al modificar libro");
      setModalType("error");
    }

    setModalOpen(true);
  };

  return (
    <div className="max-w-4xl mx-auto p-4">
      <div className="bg-gray-800 text-white shadow-lg rounded-lg p-6">
        <h2 className="text-2xl font-semibold mb-6">Modificar Empleado</h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div >
            <label htmlFor="IdLibro" className="block text-sm font-medium mb-2">IdLibro:</label>
            <select
              id="IdLibro"
              value={idLibros}
              onChange={handleSelectLibro}
              required
              className="w-full px-4 py-2 border border-gray-600 rounded-md bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="" hidden>Selecciona un libro</option>
              {libros.map(emp => (
                <option key={emp.idLibros} value={emp.idLibros}>
                  {emp.idLibros} - {emp.Titulo}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="titulo" className="block text-sm font-medium mb-2">Titulo:</label>
            <input
              type="text"
              id="titulo"
              value={titulo}
              onChange={(e) => setTitulo(e.target.value)}
              required
              className="w-full px-4 py-2 border border-gray-600 rounded-md bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label htmlFor="autor" className="block text-sm font-medium mb-2">Autor:</label>
            <input
              type="autor"
              id="autor"
              value={autor}
              onChange={(e) => setAutor(e.target.value)}
              required
              className="w-full px-4 py-2 border border-gray-600 rounded-md bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="flex items-center space-x-4">
          {/* Input deshabilitado con la fecha actual */}
          <div>
            <label htmlFor="fechaActual" className="block text-sm font-medium mb-2">Fecha de Lanzamiento Actual:</label>
            <input
              type="text"
              id="fechaActual"
              value={fecha}
              disabled
              className="w-full px-4 py-2 border border-gray-600 rounded-md bg-gray-700 text-white"
            />
          </div>

          {/* Input habilitado para cambiar la fecha */}
          <div>
            <label htmlFor="fecha" className="block text-sm font-medium mb-2">Nueva Fecha de Lanzamiento:</label>
            <input
              type="date"
              id="fecha"
              value={fecha}
              onChange={(e) => setFecha(e.target.value || fecha)} // Si no se ingresa, mantiene la fecha actual
              className="w-full px-4 py-2 border border-gray-600 rounded-md bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

          <div>
            <label htmlFor="descripcion" className="block text-sm font-medium mb-2">Descripcion:</label>
            <input
              type="descripcion"
              id="descripcion"
              value={descripcion}
              onChange={(e) => setDescripcion(e.target.value)}
              required
              className="w-full px-4 py-2 border border-gray-600 rounded-md bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label htmlFor="genero" className="block text-sm font-medium mb-2">Genero:</label>
            <input
              type="genero"
              id="genero"
              value={genero}
              onChange={(e) => setGenero(e.target.value)}
              required
              className="w-full px-4 py-2 border border-gray-600 rounded-md bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label htmlFor="stock" className="block text-sm font-medium mb-2">Stock:</label>
            <input
              type="number"
              id="stock"
              value={stock}
              onChange={(e) => setStock(e.target.value)}
              required
              className="w-full px-4 py-2 border border-gray-600 rounded-md bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label htmlFor="precio" className="block text-sm font-medium mb-2">Precio:</label>
            <input
              type="number"
              id="precio"
              value={precio}
              onChange={(e) => setPrecio(e.target.value)}
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

export default ModificarLibro;

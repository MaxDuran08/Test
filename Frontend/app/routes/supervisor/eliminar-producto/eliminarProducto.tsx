import React, { useState, useEffect } from "react";
import Modal from "~/common/components/Modal";
import { eliminarProducto } from "./services/productoServices";
import { verProducto } from "./services/productoServices";

const EliminarProducto = () => {
  const [idProductoSeleccionado, setIdProductoSeleccionado] = useState("");
  const [productos, setProductos] = useState<any[]>([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalMessage, setModalMessage] = useState("");
  const [modalType, setModalType] = useState<"success" | "error">("success");
  const [errorModalOpen, setErrorModalOpen] = useState(false);

  useEffect(() => {
    cargarProductos();
  }, []);

  const cargarProductos = async () => {
    try {
      const data = await verProducto();
      if (!data || !Array.isArray(data.productos)) {
        throw new Error("Formato de datos incorrecto");
      }
  
      if (data.productos.length === 0) {
        setModalMessage("No se encontraron productos disponibles.");
        setModalType("error");
        setErrorModalOpen(true);
      }
      setProductos(data.productos); // Solo asignamos `productos`
    } catch (err: any) {
      console.error("Error al obtener productos", err);
      setProductos([]); // Asegura que `productos` sea un array vacío en caso de error
      setModalMessage("Error al obtener la lista de productos.");
      setModalType("error");
      setErrorModalOpen(true);
    }
  };
  

  const handleEliminar = async () => {
    if (!idProductoSeleccionado) return;

    try {
      await eliminarProducto({ idProducto: Number(idProductoSeleccionado) });
      setModalMessage("¡Producto eliminado correctamente!");
      setModalType("success");
      setModalOpen(true);
      setIdProductoSeleccionado("");
      cargarProductos();
    } catch (err) {
      console.error("Error en la eliminación", err);
      setModalMessage("Error al eliminar el producto.");
      setModalType("error");
      setModalOpen(true);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-4">
      <div className="bg-gray-800 text-white shadow-lg rounded-lg p-6">
        <h2 className="text-2xl font-semibold mb-6">Eliminar Producto</h2>
        <div className="space-y-4">
          <label htmlFor="producto" className="block text-sm font-medium mb-2">
            Selecciona un producto:
          </label>
          <select
            id="producto"
            value={idProductoSeleccionado}
            onChange={(e) => setIdProductoSeleccionado(e.target.value)}
            className="w-full px-4 py-2 border border-gray-600 rounded-md bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="" hidden>-- Seleccionar --</option>
            {productos.map((producto) => (
              <option key={producto.idProducto} value={producto.idProducto}>
                {producto.Nombre} - {producto.idProducto}
              </option>
            ))}
          </select>
          <button
            onClick={handleEliminar}
            className="w-full py-3 bg-red-500 text-white font-semibold rounded-md hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500"
            disabled={!idProductoSeleccionado}
          >
            Eliminar
          </button>
        </div>
      </div>

      {/* Modal de confirmación de eliminación */}
      <Modal isOpen={modalOpen} message={modalMessage} type={modalType} onClose={() => setModalOpen(false)} />
      
      {/* Modal de error si no hay productos */}
      <Modal isOpen={errorModalOpen} message={modalMessage} type={modalType} onClose={() => setErrorModalOpen(false)} />
    </div>
  );
};

export default EliminarProducto;
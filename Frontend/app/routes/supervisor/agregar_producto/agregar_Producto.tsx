import React, { useState } from "react";
import Modal from "~/common/components/Modal";
import { agregarProducto } from "./services/productoService";

const AgregarProducto = () => {
  const [nombre, setNombre] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [categoria, setCategoria] = useState("");
  const [precio_compra, setPrecio_compra] = useState("");
  const [precio_venta, setPrecio_venta] = useState("");
  const [stock, setStock] = useState("");
  const [imagen_producto, setImagen_producto] = useState("");
  const [modalMessage, setModalMessage] = useState("");
  const [modalType, setModalType] = useState<"success" | "error">("success");
  const [modalOpen, setModalOpen] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
  
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      const base64String = reader.result?.toString().split(",")[1]; // Eliminamos 'data:image/png;base64,'
      setImagen_producto(base64String || "");
    };
  };
  

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const productoData = {
      nombre,
      descripcion,
      categoria,
      precio_compra: parseFloat(precio_compra),
      precio_venta: parseFloat(precio_venta),
      stock: Number(stock),
      imagen_producto,
    };

    try {
      await agregarProducto(productoData);
      setModalMessage("Producto agregado correctamente!");
      setModalType("success");
    } catch (error) {
      setModalMessage("Hubo un error al agregar el producto.");
      setModalType("error");
    }

    setModalOpen(true);
    setNombre("");
    setDescripcion("");
    setCategoria("");
    setPrecio_compra("");
    setPrecio_venta("");
    setStock("");
    setImagen_producto("");
  };

  const handleModalClose = () => {
    setModalOpen(false);
  };

  return (
    <div className="max-w-4xl mx-auto p-4">
      <div className="bg-gray-800 text-white shadow-lg rounded-lg p-6">
        <h2 className="text-2xl font-semibold mb-6">Agregar Producto</h2>
        <form onSubmit={handleSubmit} className="space-y-6">
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
              className="w-full px-4 py-2 border border-gray-600 rounded-md bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
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
          <div>
            <label htmlFor="categoria" className="block text-sm font-medium mb-2">
              Categoría:
            </label>
            <input
              type="text"
              id="categoria"
              value={categoria}
              onChange={(e) => setCategoria(e.target.value)}
              required
              className="w-full px-4 py-2 border border-gray-600 rounded-md bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="flex gap-4">
            <div className="w-1/2">
              <label htmlFor="precio_compra" className="block text-sm font-medium mb-2">
                Precio de Compra:
              </label>
              <input
                type="number"
                id="precio_compra"
                value={precio_compra}
                onChange={(e) => setPrecio_compra(e.target.value)}
                required
                className="w-full px-4 py-2 border border-gray-600 rounded-md bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="w-1/2">
              <label htmlFor="precio_venta" className="block text-sm font-medium mb-2">
                Precio de Venta:
              </label>
              <input
                type="number"
                id="precio_venta"
                value={precio_venta}
                onChange={(e) => setPrecio_venta(e.target.value)}
                required
                className="w-full px-4 py-2 border border-gray-600 rounded-md bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
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
              className="w-full px-4 py-2 border border-gray-600 rounded-md bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label htmlFor="imagen_producto" className="block text-sm font-medium mb-2">
              Imagen del Producto:
            </label>
            <input
              type="file"
              id="imagen_producto"
              accept="image/*"
              onChange={handleFileChange}
              className="w-full px-4 py-2 border border-gray-600 rounded-md bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <button
            type="submit"
            className="w-full py-3 bg-blue-500 text-white font-semibold rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            Agregar Producto
          </button>
        </form>
      </div>

      {/* Modal Component */}
      <Modal isOpen={modalOpen} message={modalMessage} type={modalType} onClose={handleModalClose} />
    </div>
  );
};

export default AgregarProducto;

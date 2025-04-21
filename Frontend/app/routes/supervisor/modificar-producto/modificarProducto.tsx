import React, { useState, useEffect } from "react";
import Modal from "~/common/components/Modal";
import { obtenerProductos, modificarProducto } from "./service/productoService";

const ModificarProducto = () => {
  const [productos, setProductos] = useState<
    {
      idProducto: number;
      Nombre: string;
      Descripcion: string;
      Categoria: string;
      Precio_compra: number;
      Precio_venta: number;
      Stock: number;
      Imagen_producto: string;
    }[]
  >([]);
  const [idProducto, setIdProducto] = useState("");
  const [nombre, setNombre] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [categoria, setCategoria] = useState("");
  const [precioCompra, setPrecioCompra] = useState("");
  const [precioVenta, setPrecioVenta] = useState("");
  const [stock, setStock] = useState("");
  const [imagen, setImagen] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [modalMessage, setModalMessage] = useState("");
  const [modalType, setModalType] = useState<"success" | "error">("success");

  // Cargar productos al montar el componente
  useEffect(() => {
    const cargarProductos = async () => {
      try {
        const data = await obtenerProductos();
        if (data && Array.isArray(data.productos)) {
          setProductos(data.productos);
        } else {
          throw new Error("Formato de datos incorrecto");
        }
      } catch (error) {
        console.error("Error al obtener productos", error);
      }
    };
    cargarProductos();
  }, []);

  // Llenar los campos cuando se selecciona un producto
  const handleSelectProducto = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const idSeleccionado = e.target.value;
    setIdProducto(idSeleccionado);

    const producto = productos.find((p) => String(p.idProducto) === idSeleccionado);
    if (producto) {
      setNombre(producto.Nombre);
      setDescripcion(producto.Descripcion);
      setCategoria(producto.Categoria);
      setPrecioCompra(String(producto.Precio_compra));
      setPrecioVenta(String(producto.Precio_venta));
      setStock(String(producto.Stock));
      setImagen(producto.Imagen_producto);
    }
  };

  // Enviar la modificación
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      await modificarProducto({
        idProducto: Number(idProducto),
        Nombre: nombre,
        Descripcion: descripcion,
        Categoria: categoria,
        Precio_compra: Number(precioCompra),
        Precio_venta: Number(precioVenta),
        Stock: Number(stock),
        Imagen_producto: imagen, // Asumimos que sigue siendo un base64 string
      });

      setModalMessage("Producto modificado correctamente!");
      setModalType("success");
    } catch (error) {
      console.error("Error al modificar producto", error);
      setModalMessage("Error al modificar el producto.");
      setModalType("error");
    }
    setModalOpen(true);
  };

  return (
    <div className="max-w-4xl mx-auto p-4">
      <div className="bg-gray-800 text-white shadow-lg rounded-lg p-6">
        <h2 className="text-2xl font-semibold mb-6">Modificar Producto</h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="producto" className="block text-sm font-medium mb-2">Selecciona un producto:</label>
            <select
              id="producto"
              value={idProducto}
              onChange={handleSelectProducto}
              required
              className="w-full px-4 py-2 border border-gray-600 rounded-md bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="" hidden>Seleccionar producto</option>
              {productos.map((producto) => (
                <option key={producto.idProducto} value={producto.idProducto}>
                  {producto.idProducto} - {producto.Nombre}
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
              onChange={(e) => setNombre(e.target.value)}
              required
              className="w-full px-4 py-2 border border-gray-600 rounded-md bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label htmlFor="descripcion" className="block text-sm font-medium mb-2">Descripción:</label>
            <input
              type="text"
              id="descripcion"
              value={descripcion}
              onChange={(e) => setDescripcion(e.target.value)}
              required
              className="w-full px-4 py-2 border border-gray-600 rounded-md bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label htmlFor="categoria" className="block text-sm font-medium mb-2">Categoría:</label>
            <input
              type="text"
              id="categoria"
              value={categoria}
              onChange={(e) => setCategoria(e.target.value)}
              required
              className="w-full px-4 py-2 border border-gray-600 rounded-md bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="precioCompra" className="block text-sm font-medium mb-2">Precio de Compra:</label>
              <input
                type="number"
                id="precioCompra"
                value={precioCompra}
                onChange={(e) => setPrecioCompra(e.target.value)}
                required
                className="w-full px-4 py-2 border border-gray-600 rounded-md bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label htmlFor="precioVenta" className="block text-sm font-medium mb-2">Precio de Venta:</label>
              <input
                type="number"
                id="precioVenta"
                value={precioVenta}
                onChange={(e) => setPrecioVenta(e.target.value)}
                required
                className="w-full px-4 py-2 border border-gray-600 rounded-md bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
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

          <button
            type="submit"
            className="w-full py-3 bg-blue-500 text-white font-semibold rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            Modificar
          </button>
        </form>
      </div>

      {/* Modal */}
      <Modal isOpen={modalOpen} message={modalMessage} type={modalType} onClose={() => setModalOpen(false)} />
    </div>
  );
};

export default ModificarProducto;

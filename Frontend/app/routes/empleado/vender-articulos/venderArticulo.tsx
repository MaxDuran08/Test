import React, { useState, useEffect } from "react";
import Modal from "~/common/components/Modal";
import { registrarVenta, verProducto } from "./services/ventaService";

const venderArticulo = () => {
  const [articulos, setArticulos] = useState([]);
  const [total, setTotal] = useState(0);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalMessage, setModalMessage] = useState("");
  const [modalType, setModalType] = useState("success");
  const [productos, setProductos] = useState([]);
  const [empleadoCUI, setEmpleadoCUI] = useState("");
  const [clienteId, setClienteId] = useState("");
  const [metodoPago, setMetodoPago] = useState("");
  const [direccion, setDireccion] = useState("");

  useEffect(() => {
    const cargarProductos = async () => {
      try {
        const data = await verProducto();
        const librosFormateados = (data.libros || []).map((libro) => ({
          id: "L " + libro.idLibros,
          nombre: libro.Titulo,
          precio: libro.Precio,
          tipo: "L",
        }));
        const productosFormateados = (data.productos || []).map((producto) => ({
          id: "P " + producto.idProducto,
          nombre: producto.Nombre,
          precio: producto.Precio_venta,
          tipo: "P",
        }));
        setProductos([...librosFormateados, ...productosFormateados]);
      } catch (error) {
        console.error("Error al cargar productos", error);
      }
    };
    cargarProductos();
  }, []);

  const handleAgregarArticulo = () => {
    setArticulos([...articulos, { id: "", tipo: "", precio: 0, cantidad: 1 }]);
  };

  const handleChangeArticulo = (index, field, value) => {
    const nuevosArticulos = [...articulos];
    if (field === "id" && value) {
      const productoSeleccionado = productos.find((producto) => producto.id === value);
      if (productoSeleccionado) {
        nuevosArticulos[index].id = productoSeleccionado.id;
        nuevosArticulos[index].tipo = productoSeleccionado.id.startsWith("L") ? "Libro" : "Producto";
        nuevosArticulos[index].precio = parseFloat(productoSeleccionado.precio) || 0;
      }
    } else {
      nuevosArticulos[index][field] = value || "";
    }
    setArticulos(nuevosArticulos);
    calcularTotal(nuevosArticulos);
  };

  const calcularTotal = (articulos) => {
    const totalCalculado = articulos.reduce((acc, item) => acc + item.precio * item.cantidad, 0);
    setTotal(totalCalculado);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const detalles = articulos.map((articulo) => ({
      Cantidad: articulo.cantidad,
      Precio: articulo.precio,
      ...(articulo.id.startsWith("L") ? { Libros_idLibros: articulo.id.split(" ")[1] } : { Producto_idProducto: articulo.id.split(" ")[1] }),
    }));

    const ventaData = {
      Empleado_CUI: empleadoCUI,
      Cliente_idCliente: clienteId,
      Metodo_pago: metodoPago,
      Direccion: direccion,
      Detalles: detalles,
      total,
    };

    try {
      await registrarVenta(ventaData);
      setModalMessage("Venta registrada correctamente!");
      setModalType("success");
      setArticulos([]);
      setTotal(0);
      setEmpleadoCUI("");
      setClienteId("");
      setMetodoPago("");
      setDireccion("");
    } catch (error) {
      setModalMessage("Hubo un error al registrar la venta.");
      setModalType("error");
    }
    setModalOpen(true);
  };

  return (
    <div className="max-w-4xl mx-auto p-4">
      <div className="bg-gray-800 text-white shadow-lg rounded-lg p-6">
        <h2 className="text-2xl font-semibold mb-6">Registrar Venta</h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">CUI Empleado:</label>
              <input
                type="text"
                value={empleadoCUI}
                onChange={(e) => setEmpleadoCUI(e.target.value)}
                className="w-full px-4 py-2 border border-gray-600 rounded-md bg-gray-700 text-white"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">ID Cliente:</label>
              <input
                type="text"
                value={clienteId}
                onChange={(e) => setClienteId(e.target.value)}
                className="w-full px-4 py-2 border border-gray-600 rounded-md bg-gray-700 text-white"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Método de Pago:</label>
              <select
                value={metodoPago}
                onChange={(e) => setMetodoPago(e.target.value)}
                className="w-full px-4 py-2 border border-gray-600 rounded-md bg-gray-700 text-white"
                required
              >
                <option value="">Selecciona un método</option>
                <option value="Efectivo">Efectivo</option>
                <option value="Tarjeta">Tarjeta</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Dirección:</label>
              <input
                type="text"
                value={direccion}
                onChange={(e) => setDireccion(e.target.value)}
                className="w-full px-4 py-2 border border-gray-600 rounded-md bg-gray-700 text-white"
                required
              />
            </div>
          </div>

          {articulos.map((articulo, index) => (
            <div key={index} className="grid grid-cols-4 gap-4 items-center">
              <div>
                <label className="block text-sm font-medium mb-2">ID del artículo:</label>
                <select
                  value={articulo.id}
                  onChange={(e) => handleChangeArticulo(index, "id", e.target.value)}
                  className="w-full px-4 py-2 border border-gray-600 rounded-md bg-gray-700 text-white"
                >
                  <option value="">Selecciona un artículo</option>
                  {productos.map((producto) => (
                    <option key={producto.id} value={producto.id}>
                      {producto.id} - {producto.nombre}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Tipo:</label>
                <input
                  type="text"
                  value={articulo.tipo}
                  disabled
                  className="w-full px-4 py-2 border border-gray-600 rounded-md bg-gray-700 text-white"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Precio:</label>
                <input
                  type="number"
                  value={articulo.precio || 0}
                  disabled
                  className="w-full px-4 py-2 border border-gray-600 rounded-md bg-gray-700 text-white"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Cantidad:</label>
                <input
                  type="number"
                  value={articulo.cantidad}
                  onChange={(e) => handleChangeArticulo(index, "cantidad", e.target.value)}
                  className="w-full px-4 py-2 border border-gray-600 rounded-md bg-gray-700 text-white"
                />
              </div>
            </div>
          ))}

          <button
            type="button"
            onClick={handleAgregarArticulo}
            className="py-2 px-4 bg-green-500 text-white rounded-md hover:bg-green-600"
          >
            Agregar Artículo
          </button>

          <div className="text-lg font-semibold">Total: ${total.toFixed(2)}</div>

          <button
            type="submit"
            className="w-full py-3 bg-blue-500 text-white font-semibold rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            Registrar Venta
          </button>
        </form>
      </div>
      <Modal isOpen={modalOpen} message={modalMessage} type={modalType} onClose={() => setModalOpen(false)} />
    </div>
  );
};

export default venderArticulo;
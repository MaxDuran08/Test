import React, { useState } from "react";
import { generarFactura } from "./services/generar_facturas"; // Asegúrate de importar correctamente la función

const GenerarFactura = () => {
  const [empleadoCUI, setEmpleadoCUI] = useState(""); // Puedes setear un valor por defecto o dejarlo editable
  const [clienteId, setClienteId] = useState(""); // ID de cliente predeterminado
  const [metodoPago, setMetodoPago] =useState("");
  const [direccion, setDireccion] = useState("");
  const [productos, setProductos] = useState([
    { id: "ID", cantidad: "cantidad"} // Producto por defecto

  ]);
  const [mensaje, setMensaje] = useState<string>("");
  const [error, setError] = useState<string>("");

  // Manejar cambio en los campos de los productos
  const handleProductoChange = (
    index: number,
    field: string,
    value: number | string
  ) => {
    const newProductos = [...productos];
    newProductos[index][field] = value;
    setProductos(newProductos);
  };

  // Agregar un nuevo producto
  const addProducto = () => {
    setProductos([...productos, { id: 0, cantidad: 1 }]); // Producto vacío para completar
  };

  // Eliminar un producto
  const removeProducto = (index: number) => {
    const newProductos = productos.filter((_, i) => i !== index);
    setProductos(newProductos);
  };

  // Enviar la factura
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const facturaData = {
      Empleado_CUI: empleadoCUI,
      Cliente_idCliente: clienteId,
      Metodo_pago: metodoPago,
      Direccion: direccion,
      Productos: productos.map((producto) => ({
        id: producto.id,
        cantidad: producto.cantidad
      }))
    };

    try {
      const data = await generarFactura(facturaData);
      setMensaje(`Factura generada con éxito`);
      setError(""); // Limpiar posibles errores
    } catch (err) {
      setError("Error al generar la factura");
      setMensaje(""); // Limpiar mensaje de éxito
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-6">
      <h2 className="text-2xl font-bold text-white text-center mb-6">📄 Generar Factura</h2>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Empleado CUI */}
        <div>
          <label htmlFor="empleadoCUI" className="text-white">
            CUI del Empleado:
          </label>
          <input
            type="number"
            id="empleadoCUI"
            value={empleadoCUI}
            onChange={(e) => setEmpleadoCUI(Number(e.target.value))}
            className="w-full p-3 bg-gray-700 text-white rounded-lg focus:outline-none"
          />
        </div>

        {/* ID Cliente */}
        <div>
          <label htmlFor="clienteId" className="text-white">
            Cliente ID:
          </label>
          <input
            type="number"
            id="clienteId"
            value={clienteId}
            onChange={(e) => setClienteId(Number(e.target.value))}
            className="w-full p-3 bg-gray-700 text-white rounded-lg focus:outline-none"
          />
        </div>

        {/* Método de pago */}
        <div>
          <label htmlFor="metodoPago" className="text-white">
            Método de Pago:
          </label>
          <input
            type="text"
            id="metodoPago"
            value={metodoPago}
            onChange={(e) => setMetodoPago(e.target.value)}
            className="w-full p-3 bg-gray-700 text-white rounded-lg focus:outline-none"
          />
        </div>

        {/* Dirección */}
        <div>
          <label htmlFor="direccion" className="text-white">
            Dirección:
          </label>
          <input
            type="text"
            id="direccion"
            value={direccion}
            onChange={(e) => setDireccion(e.target.value)}
            className="w-full p-3 bg-gray-700 text-white rounded-lg focus:outline-none"
          />
        </div>

        {/* Productos */}
        <div>
          <h3 className="text-white">Detalles de los productos:</h3>
          {productos.map((producto, index) => (
            <div key={index} className="flex space-x-4 mb-4">
              <input
                type="number"
                placeholder="Producto ID"
                value={producto.id}
                onChange={(e) => handleProductoChange(index, "id", Number(e.target.value))}
                className="w-1/3 p-3 bg-gray-700 text-white rounded-lg"
              />
              <input
                type="number"
                placeholder="Cantidad"
                value={producto.cantidad}
                onChange={(e) => handleProductoChange(index, "cantidad", Number(e.target.value))}
                className="w-1/3 p-3 bg-gray-700 text-white rounded-lg"
              />
              <button
                type="button"
                onClick={() => removeProducto(index)}
                className="p-3 bg-red-600 text-white rounded-lg"
              >
                Eliminar
              </button>
            </div>
          ))}
          <button
            type="button"
            onClick={addProducto}
            className="p-3 bg-blue-600 text-white rounded-lg"
          >
            Agregar Producto
          </button>
        </div>

        {/* Botón de Enviar */}
        <div className="text-center">
          <button
            type="submit"
            className="p-3 bg-green-600 text-white rounded-lg"
          >
            Generar Factura
          </button>
        </div>
      </form>

      {/* Mensajes */}
      {mensaje && <p className="text-green-500 text-center mt-4">{mensaje}</p>}
      {error && <p className="text-red-500 text-center mt-4">{error}</p>}
    </div>
  );
};

export default GenerarFactura;
import React, { useEffect, useState } from "react";
import { obtenerIdUsuario, registrarFactura } from "../services/usuarioServices";
import Modal from "~/common/components/Modal";

const RealizarCompra = () => {
  const [idCliente, setIdCliente] = useState("0");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [metodoPago, setMetodoPago] = useState("Efectivo");
  const [direccion, setDireccion] = useState("");
  const [precioTotal, setPrecioTotal] = useState(0);
  const [carritoLibros, setCarritoLibros] = useState([]);
  const [carritoProductos, setCarritoProductos] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [mensajeModal, setMensajeModal] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const idCliente = await obtenerIdUsuario();
        setIdCliente(idCliente);
        
        // Cargar los carritos del localStorage
        const libros = JSON.parse(localStorage.getItem(`carrito_libros_${idCliente}`)) || [];
        const productos = JSON.parse(localStorage.getItem(`carrito_productos_${idCliente}`)) || [];
        
        setCarritoLibros(libros);
        setCarritoProductos(productos);
        
        // Calcular el precio total
        let total = 0;
        
        libros.forEach((libro) => {
          total += libro.cantidad * libro.precio;
        });
        
        productos.forEach((producto) => {
          total += producto.cantidad * producto.precio;
        });
        
        setPrecioTotal(total.toFixed(2));
      } catch (err) {
        setError("Error al obtener los datos");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const actualizarCarrito = (carrito, setCarrito, tipo, id, cantidad) => {
    const index = carrito.findIndex((item) => item.id === id);
  
    if (index !== -1) {
      if (cantidad <= 0) {
        carrito.splice(index, 1);
      } else {
        carrito[index].cantidad = cantidad;
      }
    } else {
      if (cantidad > 0) {
        carrito.push({
          id,
          tipo,
          nombre: tipo === "libros" ? carrito[index].Titulo : carrito[index].Nombre,
          cantidad,
          precio: tipo === "libros" ? carrito[index].Precio : carrito[index].Precio_venta,
          stock: carrito[index].Stock,
        });
      }
    }
  
    localStorage.setItem(`carrito_${tipo}_${idCliente}`, JSON.stringify(carrito));
    setCarrito([...carrito]); // Asegurarse de que el estado se actualice correctamente
  };

  const obtenerStock = (carrito, id) => {
    const item = carrito.find((item) => item.id === id);
    return item ? item.stock : null;  // Retorna el stock si se encuentra, o null si no se encuentra el item
  }

  const handleAgregarItem = (tipo, item) => {
    const carrito = tipo === "libros" ? [...carritoLibros] : [...carritoProductos];
    const stockDisponible = obtenerStock(carrito,item.id);
  
    if (stockDisponible > 0) {
      const itemEnCarrito = carrito.find((prod) => prod.id === item.id);
      const nuevaCantidad = itemEnCarrito ? itemEnCarrito.cantidad + 1 : 1;
      console.log("nuevaCantidad",nuevaCantidad)
      console.log("stockDisponible",stockDisponible)
      if (nuevaCantidad <= stockDisponible) {
        actualizarCarrito(carrito, tipo === "libros" ? setCarritoLibros : setCarritoProductos, tipo, item.id, nuevaCantidad);
        recalcularTotal(tipo === "libros" ? carritoLibros : carritoProductos);
      } else {
        setMensajeModal("No puedes agregar más productos, el stock disponible es limitado.");
        setIsModalOpen(true);
      }
    } else {
      setMensajeModal("No hay stock disponible.");
      setIsModalOpen(true);
    }
  };
  
  const handleQuitarItem = (tipo, item) => {
    const carrito = tipo === "libros" ? [...carritoLibros] : [...carritoProductos];
    const nuevaCantidad = carrito.find((prod) => prod.id === item.id).cantidad - 1;
  
    if (nuevaCantidad >= 1) {
      actualizarCarrito(carrito, tipo === "libros" ? setCarritoLibros : setCarritoProductos, tipo, item.id, nuevaCantidad);
    } else {
      actualizarCarrito(carrito, tipo === "libros" ? setCarritoLibros : setCarritoProductos, tipo, item.id, 0);
    }
  
    // Recalcular el precio total
    recalcularTotal(tipo === "libros" ? carritoLibros : carritoProductos);
  };

  const recalcularTotal = (carrito) => {
    let total = 0;
  
    carrito.forEach((item) => {
      total += item.cantidad * item.precio;
    });
  
    setPrecioTotal(total.toFixed(2));
  };

  const handleConfirmarCompra = async () => {
    if (!direccion) {
      setMensajeModal("Por favor, ingresa una dirección de envío.");
      setIsModalOpen(true);
      return;
    }
  
    const facturaData = {
      Cliente_idCliente: idCliente,
      Fecha_compra: new Date().toISOString().split("T")[0],
      Precio_total: parseFloat(precioTotal),
      Metodo_pago: metodoPago,
      Direccion: direccion,
      Empleado_CUI: 9999999999999,
    };
  
    // Detalles de la factura
    const detallesLibros = [];
    const detallesProductos = [];
  
    carritoLibros.forEach((libro) => {
      detallesLibros.push({
        Libros_idLibros: libro.id,
        Cantidad: libro.cantidad,
        Nombre: libro.nombre,
        Precio: parseFloat(libro.precio),
      });
    });
  
    carritoProductos.forEach((producto) => {
      detallesProductos.push({
        Producto_idProducto: producto.id,
        Cantidad: producto.cantidad,
        Nombre: producto.nombre,
        Precio: parseFloat(producto.precio),
      });
    });

    if (detallesLibros.length === 0 && detallesProductos.length === 0) {
      setMensajeModal("No hay articulos en el carrito.");
      setIsModalOpen(true);
      return;
    }
  
    try {
      const response = await registrarFactura(facturaData, detallesLibros, detallesProductos);
      localStorage.removeItem(`carrito_libros_${idCliente}`);
      localStorage.removeItem(`carrito_productos_${idCliente}`);
      setCarritoLibros([]);
      setCarritoProductos([]);
      setDireccion("");
      setPrecioTotal(0.00)
      setMensajeModal("Compra realizada con exito.");
      setIsModalOpen(true);

    } catch (error) {
      console.error("Error al registrar la factura", error);
      setMensajeModal("Error al registrar la factura: " + error);
      setIsModalOpen(true);
    }
  };

  return (
    <div className="container p-4 bg-gray-800 text-white shadow-lg rounded-lg p-6">
      {loading ? (
        <p>Cargando...</p>
      ) : error ? (
        <p>{error}</p>
      ) : (
        <>
          <h2 className="text-2xl font-semibold mb-4">Resumen de la Compra</h2>

          <div className="mb-4">
            <h3 className="text-xl">Carrito de Libros</h3>
            <ul>
              {carritoLibros.map((libro) => (
                <li key={libro.id} className="flex justify-between items-center">
                  <span>{libro.nombre} - {libro.cantidad} x Q{libro.precio} = Q{(libro.cantidad * libro.precio).toFixed(2)}</span>
                  <div className="flex gap-2">
                    <button onClick={() => handleAgregarItem("libros", libro)} className="bg-green-500 text-white p-1 rounded">+</button>
                    <button onClick={() => handleQuitarItem("libros", libro)} className="bg-red-500 text-white p-1 rounded">-</button>
                  </div>
                </li>
              ))}
            </ul>
          </div>

          <div className="mb-4">
            <h3 className="text-xl">Carrito de Productos</h3>
            <ul>
              {carritoProductos.map((producto) => (
                <li key={producto.id} className="flex justify-between items-center">
                  <span>{producto.nombre} - {producto.cantidad} x Q{producto.precio} = Q{(producto.cantidad * producto.precio).toFixed(2)}</span>
                  <div className="flex gap-2">
                    <button onClick={() => handleAgregarItem("productos", producto)} className="bg-green-500 text-white p-1 rounded">+</button>
                    <button onClick={() => handleQuitarItem("productos", producto)} className="bg-red-500 text-white p-1 rounded">-</button>
                  </div>
                </li>
              ))}
            </ul>
          </div>

          <div className="mb-4">
            <label className="block">Dirección de envío</label>
            <input
              type="text"
              value={direccion}
              onChange={(e) => setDireccion(e.target.value)}
              className="border p-2 w-full rounded-md"
              placeholder="Ingresa tu dirección"
            />
          </div>

          <div className="mb-4">
            <label className="block">Método de pago</label>
            <select
              value={metodoPago}
              onChange={(e) => setMetodoPago(e.target.value)}
              className="w-full px-4 py-2 border border-gray-600 rounded-md bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="Efectivo">Efectivo</option>
              <option value="Contra Entrega">Contra Entrega</option>
            </select>
          </div>

          <div className="mb-4">
            <p className="font-bold">Precio Total: Q{precioTotal}</p>
          </div>

          <button onClick={handleConfirmarCompra} className="bg-green-600 text-white p-2 rounded">
            Confirmar Compra
          </button>

          <Modal isOpen={isModalOpen} message={mensajeModal} onClose={() => setIsModalOpen(false)} />
        </>
      )}
    </div>
  );
};

export default RealizarCompra;

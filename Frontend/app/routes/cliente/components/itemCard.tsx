import React, { useState, useEffect } from "react";
import { FaShoppingCart, FaHeart, FaRegHeart } from "react-icons/fa";
import { agregarLibroListaDeseos, agregarProductoListaDeseos, eliminarLibroListaDeseos, eliminarProductoListaDeseos } from "../services/usuarioServices";
import Modal from "~/common/components/Modal";
import Estrellas from "./estrella";


const ItemCard = ({ item, type, idCliente, enListaDeseos, mostrarBotones = true }) => {
  const [Key, setKey] = useState(enListaDeseos);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [cantidad, setCantidad] = useState(1);
  const [stockDisponible, setStockDisponible] = useState(item.Stock);
  const [alerta, setAlerta] = useState({ isOpen: false, message: "", type: "info" });

  useEffect(() => {
    const carrito = type === "libros" 
      ? JSON.parse(localStorage.getItem(`carrito_libros_${idCliente}`)) || [] 
      : JSON.parse(localStorage.getItem(`carrito_productos_${idCliente}`)) || [];
    
    const itemEnCarrito = carrito.find((prod) => prod.id === (type === "libros" ? item.idLibros : item.idProducto));
    setStockDisponible(item.Stock - (itemEnCarrito ? itemEnCarrito.cantidad : 0));
  }, [idCliente, item, type]);

  const handleAddToCart = () => {
    setIsModalOpen(true);
  };

  const handleConfirmAddToCart = () => {
    const carrito = type === "libros" 
      ? JSON.parse(localStorage.getItem(`carrito_libros_${idCliente}`)) || [] 
      : JSON.parse(localStorage.getItem(`carrito_productos_${idCliente}`)) || [];
    
    // Dependiendo del tipo (libros o productos), obtenemos el ID correcto
    const id = type === "libros" ? item.idLibros : item.idProducto;
  
    // Buscar si el artículo ya está en el carrito usando el ID correcto
    const index = carrito.findIndex((prod) => prod.id === id);
  
    if (index !== -1) {
      // Si el artículo ya está en el carrito, actualizar la cantidad
      const nuevaCantidad = carrito[index].cantidad + cantidad;
      if (nuevaCantidad > stockDisponible) {
        setAlerta({ isOpen: true, message: "No puedes agregar más productos de los disponibles en stock.", type: "error" });
        return;
      }
      carrito[index].cantidad = nuevaCantidad;
    } else {
      // Si el artículo no está en el carrito, agregarlo
      if (cantidad > stockDisponible) {
        setAlerta({ isOpen: true, message: "No puedes agregar más productos de los disponibles en stock.", type: "error" });
        return;
      }
      carrito.push({
        id, // Usar el ID correcto según el tipo
        tipo: type,
        nombre: item.Titulo || item.Nombre,
        cantidad,
        precio: item.Precio || item.Precio_venta,
        stock: stockDisponible
      });
    }
    
    // Guardar los cambios en el carrito en localStorage (por separado dependiendo del tipo)
    if (type === "libros") {
      localStorage.setItem(`carrito_libros_${idCliente}`, JSON.stringify(carrito));
    } else {
      localStorage.setItem(`carrito_productos_${idCliente}`, JSON.stringify(carrito));
    }
    setIsModalOpen(false);
  };

  const handleWishlistClick = async () => {
    console.log(`${Key ? 'Eliminado de' : 'Agregado a'} la lista de deseos: ${item.Titulo || item.Nombre}`);

    if (type === "libros") {
      if (Key) {
        await eliminarLibroListaDeseos(idCliente, item.idLibros);
        setKey(false);
      } else {
        await agregarLibroListaDeseos(idCliente, item.idLibros);
        setKey(true);
      }
    } else {
      if (Key) {
        await eliminarProductoListaDeseos(idCliente, item.idProducto);
        setKey(false);
      } else {
        await agregarProductoListaDeseos(idCliente, item.idProducto);
        setKey(true);
      }
    }
  };

  return (
    <div className="bg-gray-800 text-white shadow-lg rounded-lg p-4 flex flex-col items-center">
      {type === "libros" ? (
        <>
          {item.CalificacionPromedio && item.CalificacionPromedio > 0 && item.CalificacionPromedio <= 5 ? (
        <Estrellas calificacion={item.CalificacionPromedio} />
      ) : (
        <></> // Si la calificación no es válida o no está presente, no muestra nada
      )}
          <h3 className="text-xl font-semibold">{item.Titulo}</h3>
          <p className="text-gray-300 text-center">{item.Descripcion}</p>
          <p className="text-gray-400">Autor: {item.Autor}</p>
          <p className="text-gray-400">Género: {item.Genero}</p>
          <p className="text-green-400 font-bold">Precio: Q{item.Precio}</p>
          <p className="text-gray-400 text-sm">Stock: {item.Stock}</p>
        </>
      ) : (
        <>
          {item.Imagen_producto ? (
            <img
              src={`data:image/jpg;base64,${item.Imagen_producto}`}
              alt={item.Nombre}
              className="w-full h-48 object-cover rounded-md"
            />
          ) : (
            <p className="text-gray-400">Imagen no disponible</p>
          )}
          <h3 className="text-xl font-semibold">{item.Nombre}</h3>
          <p className="text-gray-300 text-center">{item.Descripcion}</p>
          <p className="text-green-400 font-bold">Precio: Q{item.Precio_venta}</p>
          <p className="text-gray-400 text-sm">Stock: {item.Stock}</p>
        </>
      )}

      {mostrarBotones && (
        <div className="mt-4 flex gap-3">
          <button
            onClick={handleAddToCart}
            className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded-lg"
          >
            <FaShoppingCart size={34} /> Agregar al carrito
          </button>
          <button
            onClick={handleWishlistClick}
            className={`flex items-center gap-2 py-2 px-4 rounded-lg ${Key ? 'bg-red-700 hover:bg-red-800' : 'bg-red-600 hover:bg-red-700'} text-white`}
          >
            {Key ? <FaHeart size={34} /> : <FaRegHeart size={34} />}
            {Key ? "Eliminar de la lista de deseos" : "Agregar a la lista de deseos"}
          </button>
        </div>
      )}

      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-opacity-50">
          <div className="bg-white text-black p-6 rounded-lg">
            <h2 className="text-lg font-bold mb-4">Selecciona la cantidad</h2>
            <input
              type="number"
              min="1"
              max={stockDisponible}
              value={cantidad}
              onChange={(e) => setCantidad(Math.min(stockDisponible, Math.max(1, Number(e.target.value))))}
              className="border p-2 w-full text-black"
            />
            <div className="flex justify-end mt-4 gap-2">
              <button onClick={() => setIsModalOpen(false)} className="bg-gray-500 text-white px-4 py-2 rounded-lg">Cancelar</button>
              <button onClick={handleConfirmAddToCart} className="bg-green-600 text-white px-4 py-2 rounded-lg">Añadir</button>
            </div>
          </div>
        </div>
      )}

      <Modal isOpen={alerta.isOpen} message={alerta.message} type={alerta.type} onClose={() => setAlerta({ isOpen: false, message: "", type: "info" })} />
    </div>
  );
};

export default ItemCard;

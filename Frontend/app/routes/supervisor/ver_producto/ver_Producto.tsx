import React, { useEffect, useState } from "react";
import { verProducto } from "./services/ver_productoService";

const VerProducto = () => {
  const [productos, setProductos] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchProductos = async () => {
      try {
        const data = await verProducto(); // Obtener datos del backend

        // Verificar si hay productos y libros en la respuesta
        const productosData = data.productos || [];
        const librosData = data.libros || [];

        // Normalizar los libros para que coincidan con la estructura de los productos
        const librosNormalizados = librosData.map(libro => ({
          idProducto: libro.idLibros, // Cambiar idLibros a idProducto para uniformidad
          Nombre: libro.Titulo, // Título es equivalente a Nombre
          Descripcion: libro.Descripcion || "Sin descripción",
          Precio_venta: libro.Precio,
          Precio_compra: libro.Precio, // No hay precio de compra en libros, se mantiene igual
          Stock: libro.Stock ?? 0, // Si no tiene stock, poner 0
          Estado: libro.Estado, // Disponible o No Disponible
          Imagen_producto: "", // No hay imagen en los libros
          codigo_producto: `LIBRO-${libro.idLibros}` // Código personalizado para diferenciarlos
        }));

        // Combinar productos y libros en una sola lista
        const listaProductos = [...productosData, ...librosNormalizados];

        // Guardar en el estado
        setProductos(listaProductos);
      } catch (err) {
        setError("Error al obtener productos y libros");
      } finally {
        setLoading(false);
      }
    };

    fetchProductos();
  }, []);

  if (loading) return <p className="text-center text-white">Cargando productos...</p>;
  if (error) return <p className="text-center text-red-500">{error}</p>;

  return (
    <div className="max-w-6xl mx-auto p-6">
      <h2 className="text-3xl font-bold text-white mb-6">Lista de Productos y Libros</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {productos.map((producto) => (
          <div key={producto.idProducto} className="bg-gray-800 text-white shadow-lg rounded-lg p-4">
            {/* Si el producto tiene imagen, mostrarla, si no, mostrar mensaje */}
            {producto.Imagen_producto ? (
              <img
                src={`data:image/jpg;base64,${producto.Imagen_producto}`}
                alt={producto.Nombre}
                className="w-full h-48 object-cover rounded-md"
              />
            ) : (
              <p className="text-gray-400 text-sm">Imagen no disponible</p>
            )}

            <h3 className="text-xl font-semibold mt-2">Cod: {producto.idProducto}</h3>
            <h3 className="text-xl font-semibold mt-2">{producto.Nombre}</h3>
            <p className="text-gray-300">{producto.Descripcion}</p>
            <p className={`font-bold mt-2 ${producto.Estado === "Disponible" ? "text-green-400" : "text-red-400"}`}>
              Estado: {producto.Estado}
            </p>
            <p className="text-green-400 font-bold mt-2">Venta Q{producto.Precio_venta}</p>
            <p className="text-gray-400 text-sm">Stock: {producto.Stock}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default VerProducto;

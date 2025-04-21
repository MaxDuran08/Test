import React, { useEffect, useState } from "react";
import { verProducto } from "./services/articuloServices";
import Modal from "~/common/components/Modal";

const ConsultarArticulo = () => {
  const [idProducto, setIdProducto] = useState<string>("");
  const [productos, setProductos] = useState<any[]>([]);
  const [libros, setLibros] = useState<any[]>([]);
  const [productoFiltrado, setProductoFiltrado] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [modalMessage, setModalMessage] = useState("");
  const [modalType, setModalType] = useState<"success" | "error">("success");

  // Cargar productos y libros al iniciar
  useEffect(() => {
    const fetchProductos = async () => {
      try {
        const data = await verProducto();
        console.log(data);
        setProductos(data.productos || []);
        setLibros(data.libros || []);
      } catch (err) {
        setError("Error al obtener productos y libros");
      } finally {
        setLoading(false);
      }
    };
    fetchProductos();
  }, []);

  // Buscar artículo con formato 'p123' o 'l456'
  const handleBuscarArticulo = () => {
    if (!idProducto) {
      setModalMessage("Por favor, ingrese un ID de producto o libro.");
      setModalType("error");
      setModalOpen(true);
      return;
    }

    // Extraer prefijo ('p' o 'l') y número
    const match = idProducto.match(/^([pl])(\d+)$/i);
    if (!match) {
      setModalMessage("Formato incorrecto. Use 'p123' para productos o 'l456' para libros.");
      setModalType("error");
      setModalOpen(true);
      return;
    }

    const [, tipo, id] = match;
    const idNumerico = Number(id);
    let encontrado = null;

    if (tipo.toLowerCase() === "p") {
      encontrado = productos.find((p) => p.idProducto === idNumerico);
    } else if (tipo.toLowerCase() === "l") {
      encontrado = libros.find((l) => l.idProducto === idNumerico);
    }

    if (encontrado) {
      setProductoFiltrado({ ...encontrado, tipo: tipo.toLowerCase() === "p" ? "producto" : "libro" });
    } else {
      setProductoFiltrado(null);
      setModalMessage("No se encontró el producto o libro.");
      setModalType("error");
      setModalOpen(true);
    }
  };

  if (loading) return <p className="text-center text-white">Cargando productos...</p>;
  if (error) return <p className="text-center text-red-500">{error}</p>;

  // Componente para mostrar cada producto o libro
  const TarjetaArticulo = ({ articulo, tipo }: { articulo: any; tipo: string }) => (
    <div key={articulo.idProducto} className="bg-gray-800 text-white shadow-lg rounded-lg p-4">
      {articulo.Imagen_producto ? (
        <img
          src={`data:image/jpg;base64,${articulo.Imagen_producto}`}
          alt={articulo.Nombre}
          className="w-full h-48 object-cover rounded-md"
        />
      ) : (
        <p className="text-gray-400">Imagen no disponible</p>
      )}
      <h3 className="text-xl font-semibold mt-2">
        Cod {articulo.idLibros || articulo.idProducto} ({tipo})
      </h3>
      <h3 className="text-xl font-semibold mt-2">{articulo.Nombre}</h3>
      <p className="text-gray-300">{articulo.Descripcion}</p>
      <p className="text-green-400 font-bold mt-2">Venta Q{articulo.Precio_venta}</p>
      <p className="text-green-400 font-bold mt-2">Compra Q{articulo.Precio_compra}</p>
      <p className="text-gray-400 text-sm">Stock: {articulo.Stock}</p>
    </div>
  );

  return (
    <div className="max-w-6xl mx-auto p-6">
      <h2 className="text-3xl font-bold text-white mb-6">Consultar Artículo</h2>

      {/* Barra de búsqueda */}
      <div className="bg-gray-800 p-4 rounded-lg shadow-lg mb-6">
        <label htmlFor="idProducto" className="block text-white text-lg mb-2">
          Ingrese el ID del producto (pID) o libro (lID):
        </label>
        <div className="flex gap-2">
          <input
            type="text"
            id="idProducto"
            value={idProducto}
            onChange={(e) => {
              setIdProducto(e.target.value);
              if (!e.target.value) setProductoFiltrado(null);
            }}
            className="w-full px-4 py-2 border border-gray-600 rounded-md bg-gray-700 text-white focus:ring-2 focus:ring-blue-500"
            placeholder="Ejemplo: p123 para producto, l456 para libro"
          />
          <button
            onClick={handleBuscarArticulo}
            className="px-6 py-2 bg-blue-500 text-white font-semibold rounded-md hover:bg-blue-600 focus:ring-2 focus:ring-blue-500"
            disabled={!idProducto}
          >
            Buscar
          </button>
        </div>
      </div>

      {/* Mostrar artículos */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {productoFiltrado ? (
          <TarjetaArticulo articulo={productoFiltrado} tipo={productoFiltrado.tipo} />
        ) : (
          <>
            {productos.map((producto) => (
              <TarjetaArticulo key={producto.idProducto} articulo={producto} tipo="Producto" />
            ))}
            {libros.map((libro) => (
              <TarjetaArticulo key={libro.idProducto} articulo={libro} tipo="Libro" />
            ))}
          </>
        )}
      </div>

      {/* Modal de éxito o error */}
      <Modal isOpen={modalOpen} message={modalMessage} type={modalType} onClose={() => setModalOpen(false)} />
    </div>
  );
};

export default ConsultarArticulo;

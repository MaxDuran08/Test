import { useEffect, useState } from "react";
import { obtenerIdUsuario, obtenerProductosLibros } from "../services/usuarioServices";
import ItemCard from "../components/itemCard";

const BuscarLibro = () => {
  const [idCliente, setIdCliente] = useState("0");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [libros, setLibros] = useState([]);
  const [productos, setProductos] = useState([]);
  const [busqueda, setBusqueda] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const idCliente = await obtenerIdUsuario();
        setIdCliente(idCliente);
        const data = await obtenerProductosLibros();
        setLibros(data.libros || []);
        setProductos(data.productos || []);
      } catch (err) {
        setError("Error al obtener los datos");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Función para filtrar los libros y productos
  const filtrarItems = (items) =>
    items.filter(
      (item) =>
        (item.Autor && item.Autor.toLowerCase().includes(busqueda.toLowerCase())) ||
        (item.Descripcion && item.Descripcion.toLowerCase().includes(busqueda.toLowerCase())) ||
        (item.Titulo && item.Titulo.toLowerCase().includes(busqueda.toLowerCase()))
    );

  const librosFiltrados = filtrarItems(libros);
  const productosFiltrados = filtrarItems(productos);

  if (loading) return <p className="text-center text-white">Cargando datos...</p>;
  if (error) return <p className="text-center text-red-500">{error}</p>;

  return (
    <div className="max-w-6xl mx-auto p-6">
      {/* Input de búsqueda */}
      <input
        type="text"
        placeholder="Buscar por autor o descripción..."
        value={busqueda}
        onChange={(e) => setBusqueda(e.target.value)}
        className="w-full p-3 mb-6 text-white border rounded-lg"
      />

      {/* Sección de Libros */}
      <h2 className="text-3xl font-bold text-white mb-6">Libros</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {librosFiltrados.map((libro) => (
          <ItemCard
            key={libro.idLibros}
            item={libro}
            type="libros"
            idCliente={idCliente}
            enListaDeseos={true}
            mostrarBotones={true}
          />
        ))}
      </div>

      {/* Sección de Productos */}
      <h2 className="text-3xl font-bold text-white mt-10 mb-6">Productos</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {productosFiltrados.map((producto) => (
          <ItemCard
            key={producto.idProducto}
            item={producto}
            type="productos"
            idCliente={idCliente}
            enListaDeseos={true}
            mostrarBotones={true}
          />
        ))}
      </div>
    </div>
  );
};

export default BuscarLibro;

import { useEffect, useState } from "react";
import { obtenerIdUsuario, obtenerProductosLibrosDeseados } from "../services/usuarioServices";
import Modal from "~/common/components/Modal";
import ItemCard from "../components/itemCard";

const verListaDeseos = () => {
  const [idCliente, setIdCliente] = useState("0");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [libros, setLibros] = useState([]);
  const [productos, setProductos] = useState([]);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const idCliente = await obtenerIdUsuario();
        setIdCliente(idCliente);
        const data = await obtenerProductosLibrosDeseados(idCliente);
        setLibros(data.libros);
        setProductos(data.productos);
      } catch (err) {
        setError("Error al obtener los datos");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);
  if (loading) return <p className="text-center text-white">Cargando datos...</p>;
  if (error) return <p className="text-center text-red-500">{error}</p>;

  return (
    <div className="max-w-6xl mx-auto p-6">
      <h2 className="text-3xl font-bold text-white mb-6">Libros</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {libros.map((libro) => {
          return (
            <ItemCard
              key={libro.idLibros}
              item={libro}
              type="libros"
              idCliente={idCliente}
              enListaDeseos={true}
              mostrarBotones={true}
            />
          );
        })}
      </div>
      <h2 className="text-3xl font-bold text-white mt-10 mb-6">Productos</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {productos.map((producto) => {
          return (
            <ItemCard
              key={producto.idProducto}
              item={producto}
              type="productos"
              idCliente={idCliente}
              enListaDeseos={true}
              mostrarBotones={true}
            />
          );
        })}
      </div>
    </div>
  );
};
export default verListaDeseos;
import { useEffect, useState } from "react";
import { verificarListaDeseos } from "../services/usuarioServices";
import ItemCard from "../components/itemCard";
import { obtenerIdUsuario } from "~/common/services/services";

const VerLibros = () => {
  const [libros, setLibros] = useState([]);
  const [productos, setProductos] = useState([]);
  const [librosListaDeseos, setLibrosListaDeseos] = useState([]);
  const [productosListaDeseos, setProductosListaDeseos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [idCliente, setIdCliente] = useState("0");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const idCliente = await obtenerIdUsuario();
        const data = await verificarListaDeseos(idCliente);
        setIdCliente(idCliente);
        setLibros(data.libros);
        setProductos(data.productos);
        setLibrosListaDeseos(data.libros_lista_deseos);
        setProductosListaDeseos(data.productos_lista_deseos);
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
          const enListaDeseos = librosListaDeseos.some(l => l.idLibros === libro.idLibros);
          return (
            <ItemCard
              key={libro.idLibros}
              item={libro}
              type="libros"
              idCliente={idCliente}
              enListaDeseos={enListaDeseos}
              mostrarBotones={true}
            />
          );
        })}
      </div>
      <h2 className="text-3xl font-bold text-white mt-10 mb-6">Productos</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {productos.map((producto) => {
          const enListaDeseos = productosListaDeseos.some(p => p.idProducto === producto.idProducto);
          return (
            <ItemCard
              key={producto.idProducto}
              item={producto}
              type="productos"
              idCliente={idCliente}
              enListaDeseos={enListaDeseos}
              mostrarBotones={true}
            />
          );
        })}
      </div>
    </div>
  );
};

export default VerLibros;
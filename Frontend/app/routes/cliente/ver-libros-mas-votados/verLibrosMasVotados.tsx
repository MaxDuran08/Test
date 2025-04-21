import { useEffect, useState } from "react";
import { obtenerIdUsuario, librosTop } from "../services/usuarioServices";
import Modal from "~/common/components/Modal";
import ItemCard from "../components/itemCard";

const verLibrosMasVotados = () => {
  const [libros, setLibros] = useState([]);
  const [librosListaDeseos, setLibrosListaDeseos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [idCliente, setIdCliente] = useState("0");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const idCliente = await obtenerIdUsuario();
        const data = await librosTop(idCliente);
        setIdCliente(idCliente);
        setLibros(data.libros_mejor_calificados);
        setLibrosListaDeseos(data.libros_lista_deseos);

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
    </div>
  );
};
export default verLibrosMasVotados;
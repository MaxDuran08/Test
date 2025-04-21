import React, { useEffect, useState } from "react";
import { verOpiniones } from "./services/ver_opiniones";

const VerOpiniones = () => {
  const [opiniones, setOpiniones] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchOpiniones = async () => {
      try {
        const data = await verOpiniones();
        setOpiniones(data);
      } catch (err) {
        setError("Error al obtener opiniones");
      } finally {
        setLoading(false);
      }
    };

    fetchOpiniones();
  }, []);

  if (loading) return <p className="text-center text-white">Cargando opiniones...</p>;
  if (error) return <p className="text-center text-red-500">{error}</p>;

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h2 className="text-3xl font-bold text-white mb-6">Opiniones de Libros</h2>
      <div className="space-y-4">
        {opiniones.length > 0 ? (
          opiniones.map((opinion) => (
            <div key={opinion.id_opinion} className="bg-gray-800 text-white p-4 rounded-lg shadow-lg">
              <h3 className="text-xl font-semibold">{opinion.libro_titulo}</h3>
              <p className="text-gray-300 mt-2">"{opinion.comentario}"</p>
              <p className="text-yellow-400 mt-1">⭐ {opinion.calificacion} / 5</p>
              <p className="text-gray-500 text-sm mt-1">{new Date(opinion.fecha_opinion).toLocaleDateString()}</p>
            </div>
          ))
        ) : (
          <p className="text-gray-400 text-center">No hay opiniones disponibles.</p>
        )}
      </div>
    </div>
  );
};

export default VerOpiniones;

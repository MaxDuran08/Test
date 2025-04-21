import { useState } from "react";

interface Supervisor {
  CUI: number;
  Nombre: string;
  Correo: string;
  Telefono: string;
  Edad: number;
  Estado: string;
}

interface TablaSupervisoresProps {
  supervisores: Supervisor[];
}

const TablaSupervisores: React.FC<TablaSupervisoresProps> = ({ supervisores }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="bg-gray-800 text-white shadow-lg rounded-lg p-6 mt-6">
      {/* Título que controla la visibilidad */}
      <h2
        className="text-xl font-semibold mb-4 cursor-pointer flex justify-between items-center"
        onClick={() => setIsOpen(!isOpen)}
      >
        Supervisores Registrados
        <span className="text-gray-400">{isOpen ? "▲" : "▼"}</span>
      </h2>

      {/* Contenido de la tabla, solo visible si isOpen es true */}
      {isOpen && (
        <table className="w-full border border-gray-700">
          <thead>
            <tr className="bg-gray-700">
              <th className="p-2 border border-gray-600">CUI</th>
              <th className="p-2 border border-gray-600">Nombre</th>
              <th className="p-2 border border-gray-600">Correo</th>
              <th className="p-2 border border-gray-600">Teléfono</th>
              <th className="p-2 border border-gray-600">Edad</th>
              <th className="p-2 border border-gray-600">Estado</th>
            </tr>
          </thead>
          <tbody>
            {supervisores.length > 0 ? (
              supervisores.map((supervisor, index) => (
                <tr key={index} className="bg-gray-900 hover:bg-gray-700">
                  <td className="p-2 border border-gray-600">{supervisor.CUI}</td>
                  <td className="p-2 border border-gray-600">{supervisor.Nombre}</td>
                  <td className="p-2 border border-gray-600">{supervisor.Correo}</td>
                  <td className="p-2 border border-gray-600">{supervisor.Telefono}</td>
                  <td className="p-2 border border-gray-600">{supervisor.Edad}</td>
                  <td className="p-2 border border-gray-600">{supervisor.Estado}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={6} className="p-2 text-center">
                  No hay supervisores registrados.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default TablaSupervisores;

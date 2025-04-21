import { useState } from "react";
import { useNavigate } from "react-router";
import { obtenerRoles, loginUsuario } from "./services/loginServices";
import Modal from "~/common/components/Modal";

const Login: React.FC = () => {
  const [correo, setCorreo] = useState("");
  const [contrasena, setContrasena] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [modal, setModal] = useState({ isOpen: false, message: "", type: "info" });
  const navigate = useNavigate();

  const roleToRouteMap: Record<string, string> = {
    cliente: "/cliente",
    empleado: "/empleado",
    gerente: "/gerente",
    supervisor: "/supervisor",
    // Agrega más roles y rutas si es necesario
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    try {
      const { token, rol, cui } = await loginUsuario(correo, contrasena);
    
      // Guardar el token en localStorage
      localStorage.setItem("token", token);
    
      // Si el cui existe, lo guardamos también
      if (cui) {
        localStorage.setItem("cui", cui);
      }
    
      // Obtener los roles desde la API
      const roles = await obtenerRoles();
    
      if (!Array.isArray(roles)) {
        throw new Error("Los roles obtenidos no son un arreglo.");
      }
    
      // Verificar si el rol existe en los roles disponibles
      const rolEncontrado = roles.find((r: any) => r.nombre.toLowerCase() === rol?.toLowerCase());
    
      if (!rolEncontrado) {
        throw new Error("El rol del usuario no está autorizado.");
      }
    
      // Obtener la ruta según el rol
      const route = roleToRouteMap[rol?.toLowerCase()];
    
      if (!route) {
        throw new Error("No existe una ruta asociada al rol.");
      }
    
      // Redireccionar
      navigate(route);
    
      // Mostrar éxito
      setModal({ isOpen: true, message: "Inicio de sesión exitoso", type: "success" });
    } catch (error) {
      // Mostrar error
      setModal({ isOpen: true, message: error.toString(), type: "error" });
    }
  }
    

  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <h2 className="text-2xl font-bold mb-4">Iniciar Sesión</h2>
      <form onSubmit={handleSubmit} className="bg-gray-900 p-8 rounded shadow-lg w-96">
        <div className="mb-4">
          <label htmlFor="username" className="block mb-2">Correo</label>
          <input
            type="text"
            id="username"
            value={correo}
            onChange={(e) => setCorreo(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded"
          />
        </div>
        <div className="mb-4">
          <label htmlFor="password" className="block mb-2">Contraseña</label>
          <input
            type="password"
            id="password"
            value={contrasena}
            onChange={(e) => setContrasena(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded"
          />
        </div>
        {error && <p className="text-red-500 text-sm">{error}</p>}
        <button
          type="submit"
          className="w-full py-2 mt-4 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Iniciar sesión
        </button>
      </form>
      {/* Enlace para redirigir al registro */}
      <div className="mt-4 text-center">
        <p className="text-sm">
          ¿No tienes cuenta?{" "}
          <button
            onClick={() => navigate("/register")} // Redirige al formulario de registro
            className="text-blue-500 hover:text-blue-700"
          >
            Regístrate aquí
          </button>
        </p>
      </div>
      {/* Botón para redirigir a la página de productos */}
      <div className="mt-10 flex justify-center gap-6">
        <button
          onClick={() => navigate("/productos")} // Redirige a la página de productos
          className="px-6 py-3 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:ring-opacity-50"
        >
          Ver productos
        </button>
      </div>
      {/* Modal de mensaje */}
      <Modal
        isOpen={modal.isOpen}
        message={modal.message}
        type={modal.type as "success" | "error" | "info"}
        onClose={() => setModal({ isOpen: false, message: "", type: "info" })}
      />
    </div>
  );
};

export default Login;

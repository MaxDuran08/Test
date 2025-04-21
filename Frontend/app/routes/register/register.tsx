import { useState } from "react";
import { useNavigate } from "react-router";
import { registrarUsuario } from "./services/registerServices";
import Modal from "~/common/components/Modal";

const Register = () => {
  const [nombre, setNombre] = useState("");
  const [correo, setCorreo] = useState("");
  const [contrasena, setContrasena] = useState("");
  const [edad, setEdad] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [modalMessage, setModalMessage] = useState("");
  const [modalType, setModalType] = useState<"success" | "error" | "info">("info");
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      await registrarUsuario({
        Nombre: nombre,
        Correo: correo,
        Contrasena: contrasena,
        Edad: parseInt(edad),
      });

      setModalMessage("Usuario registrado con éxito");
      setModalType("success");
      setModalOpen(true);

      setTimeout(() => {
        setModalOpen(false);
        navigate("/login");
      }, 2000); // Redirigir tras 2 segundos
    } catch (error: any) {
      setModalMessage(error.response?.data?.message || "Error al registrar usuario");
      setModalType("error");
      setModalOpen(true);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <h2 className="text-2xl font-bold mb-4">Registo</h2>
      <form onSubmit={handleSubmit} className="bg-gray-900 p-8 rounded shadow-lg w-96">

        <div className="mb-4">
          <label className="block mb-2 text-white">Nombre</label>
          <input
            type="text"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded"
            required
          />
        </div>

        <div className="mb-4">
          <label className="block mb-2 text-white">Correo</label>
          <input
            type="email"
            value={correo}
            onChange={(e) => setCorreo(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded"
            required
          />
        </div>

        <div className="mb-4">
          <label className="block mb-2 text-white">Contraseña</label>
          <input
            type="password"
            value={contrasena}
            onChange={(e) => setContrasena(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded"
            required
          />
        </div>

        <div className="mb-4">
          <label className="block mb-2 text-white">Edad</label>
          <input
            type="number"
            value={edad}
            onChange={(e) => setEdad(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded"
            required
          />
        </div>

        <button
          type="submit"
          className="w-full py-2 mt-4 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Registrarse
        </button>
      </form>
      {/* Enlace para redirigir al login */}
      <div className="mt-4 text-center">
        <p className="text-sm">
          ¿Ya tienes cuenta?{" "}
          <button
            onClick={() => navigate("/login")}
            className="text-blue-500 hover:text-blue-700"
          >
            Inicia sesión aquí
          </button>
        </p>
      </div>
      <Modal
        isOpen={modalOpen}
        message={modalMessage}
        type={modalType}
        onClose={() => setModalOpen(false)}
      />
    </div>
  );
};

export default Register;
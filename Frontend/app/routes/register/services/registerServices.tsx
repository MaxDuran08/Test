import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;

export const registrarUsuario = async (data: {
  Nombre: string;
  Correo: string;
  Contrasena: string;
  Edad: number;
}) => {
  return await axios.post(`${API_URL}/register`, data);
};
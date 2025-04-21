import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;

// Función para modificar un supervisor
export const modificarSupervisor = async (supervisorData: {
  CUI: number;
  Roles_id: number;
  Nombre: string;
  Correo: string;
  Telefono: string;
  Edad: number;
  Genero: string;
  Estado: string;
}) => {
  try {
    const response = await axios.put(`${API_URL}/modificar_usuario`, supervisorData);
    return response.data;
  } catch (error) {
    console.error("Error al modificar supervisor", error);
    throw error;
  }
};
import axios from "axios";

// URL base de la API
const API_URL = import.meta.env.VITE_API_URL;

// Función para obtener la lista de supervisores
export const obtenerSupervisores = async () => {
  const id_empleado = 2; // Definir el ID aquí antes de la petición

  try {
    const response = await axios.get(`${API_URL}/obtener_empleado`, {
      params: { id_empleado }, // Enviar el ID en la URL
    });
    return response.data;
  } catch (error) {
    console.error("Error al obtener el empleado", error);
    throw error;
  }
};

// Función para obtener la lista de roles
export const obtenerRoles = async () => {
  try {
    const response = await axios.get(`${API_URL}/roles`);
    return response.data; // Suponiendo que el backend devuelve un campo 'roles'
  } catch (error) {
    console.error("Error al obtener roles", error);
    throw error;
  }
};
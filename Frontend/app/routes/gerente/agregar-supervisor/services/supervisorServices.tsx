import axios from "axios";

// URL base de la API
const API_URL = import.meta.env.VITE_API_URL;

// Función para agregar un supervisor
export const agregarSupervisor = async (supervisorData: { 
  CUI: number, 
  Nombre: string, 
  Correo: string, 
  Telefono: string, 
  Edad: number, 
  Genero: string,
}) => {
  // Definimos el valor de Roles_id
  const Roles_id = 2;

  // Agregamos Roles_id al objeto supervisorData
  const supervisorConRol = { ...supervisorData, Roles_id };

  try {
    const response = await axios.post(`${API_URL}/agregar_usuario`, supervisorConRol);
    return response.data;
  } catch (error) {
    console.error("Error al agregar supervisor", error);
    throw error;
  }
};
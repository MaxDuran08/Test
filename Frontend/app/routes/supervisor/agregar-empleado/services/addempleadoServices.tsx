import axios from "axios";

// URL base de la API
const API_URL = import.meta.env.VITE_API_URL;

// Función para agregar un empleado
export const agregarEmpleado = async (empleadoData: { cui: number, nombre: string, email: string, telefono: number, edad: number, genero: string, fecha: string, foto: string }) => {
  try {
    const response = await axios.post(`${API_URL}/agregar_empleado`, empleadoData);
    return response.data; // Devuelve los datos de la respuesta
  } catch (error) {
    console.error("Error al agregar empleado", error);
    throw error; // Lanza el error para que pueda ser manejado en el componente
  }
};

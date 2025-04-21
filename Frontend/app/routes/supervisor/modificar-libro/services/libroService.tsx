import axios from "axios";

// URL base de la API
const API_URL = import.meta.env.VITE_API_URL;

// Función para modificar un libro
export const modificarLibro = async (LibroData: { idLibros: number, titulo: string, autor: string, fecha: Date, descripcion: string, genero: string, stock: number, precio: number }) => {
  try {
    const response = await axios.put(`${API_URL}/modificar_libro`, LibroData);
    return response.data; // Devuelve los datos de la respuesta
  } catch (error) {
    console.error("Error al modificar empleado", error);
    throw error; // Lanza el error para que pueda ser manejado en el componente
  }
};

// Función para obtener la lista de empleados
export const obtenerLibros = async () => {
  try {
    const response = await axios.get(`${API_URL}/obtener_libro`);
    return response.data;
  } catch (error) {
    console.error("Error al obtener los libros", error);
    throw error;
  }
};


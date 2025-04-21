import axios from "axios";

// URL base de la API
const API_URL = import.meta.env.VITE_API_URL;


// Función para eliminar un libro
export const deleteLibro = async (id_libro: number) => {
  try {
    const response = await axios.put(`${API_URL}/eliminar_libro`, {
      id_libro, // Pasamos el ID como parte del cuerpo de la solicitud
    });
    return response.data;
  } catch (error) {
    console.error("Error al eliminar libro", error);
    throw error;
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

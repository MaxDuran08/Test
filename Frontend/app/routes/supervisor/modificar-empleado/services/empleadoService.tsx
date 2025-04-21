import axios from "axios";

// URL base de la API
const API_URL = import.meta.env.VITE_API_URL;

// Función para modificar un empleado
export const modificarEmpleado = async (empleadoData: { cui: string, correo: string, telefono: number }) => {
  try {
    console.log(empleadoData);
    const response = await axios.put(`${API_URL}/modificar_empleado`, empleadoData);
    return response.data; // Devuelve los datos de la respuesta
  } catch (error) {
    console.error("Error al modificar empleado", error);
    throw error; // Lanza el error para que pueda ser manejado en el componente
  }
};

// Función para obtener la lista de empleados
export const obtenerEmpleado = async () => {
  const id_empleado = 3; // Definir el ID aquí antes de la petición

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


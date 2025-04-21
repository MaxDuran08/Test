import axios from "axios";

// URL base de la API
const API_URL = import.meta.env.VITE_API_URL;

export const obtenerRolUsuario = async () => {
    try {
        // Obtener el token de localStorage
        const token = localStorage.getItem("token");

        if (!token) {
            throw new Error("No hay token disponible");
        }

        // Realizar la petición al backend con el token
        const response = await axios.get(`${API_URL}/auth/role`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });

        return response.data.rol; // Retorna solo el rol
    } catch (error) {
        console.error("Error al obtener el rol del usuario", error);
        throw error;
    }
};

export const obtenerIdUsuario = async () => {
    try {
        // Obtener el token de localStorage
        const token = localStorage.getItem("token");

        if (!token) {
            throw new Error("No hay token disponible");
        }

        // Realizar la petición al backend con el token
        const response = await axios.get(`${API_URL}/auth/user_id`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });

        return response.data.id;
    } catch (error) {
        console.error("Error al obtener el rol del usuario", error);
        throw error;
    }
};

export const obtenerProductosLibros = async () => {
    try {
      const response = await axios.get(`${API_URL}/obtener_productos_libros`);
      return response.data;
    } catch (error) {
      console.error("Error al obtener libros y productos", error);
      throw error;
    }
  };
import axios from "axios";

// URL base de la API
const API_URL = import.meta.env.VITE_API_URL;

// Función para obtener la lista de roles
export const obtenerRoles = async () => {
    try {
      const response = await axios.get(`${API_URL}/roles`);
      
      const roles = response.data["Roles obtenidos"];
      
      if (!Array.isArray(roles)) {
        throw new Error("La respuesta no contiene un arreglo de roles.");
      }
  
      return roles;
    } catch (error) {
      console.error("Error al obtener roles", error);
      throw error;
    }
  };
  export const loginUsuario = async (correo: string, contrasena: string) => {
    try {
      const response = await axios.post(`${API_URL}/login`, {
        Correo: correo,
        Contrasena: contrasena,
      });
  
      // Armamos el objeto de retorno
      const result: any = {
        token: response.data.token,
        rol: response.data.rol || null,  // Si es cliente, no tendrá rol
      };
  
      // Solo si viene el cui, lo agregamos
      if (response.data.cui) {
        result.cui = response.data.cui;
      }
  
      return result;
      
    } catch (error: any) {
      console.error("Error al hacer login:", error);
      throw new Error(error.response?.data?.error || "Error desconocido");
    }
  };
  
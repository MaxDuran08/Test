import axios from "axios";

// URL base de la API
const API_URL = import.meta.env.VITE_API_URL;

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

export const obtenerTicketsEmpleado = async (empleado_cui) => {
  try {
    const response = await fetch(`${API_URL}/ticket?empleado_cui=${empleado_cui}`);
    if (!response.ok) {
      throw new Error("Error al obtener los tickets");
    }
    const data = await response.json();
    return data["Tickets obtenidos"];
  } catch (error) {
    console.error("Error al obtener los tickets:", error);
    return [];
  }
};


export const aprobacion_ticket = async (idTicket) => {
  try {
    const response = await fetch(`${API_URL}/ticket_aprobacion`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        ticket_id: idTicket
      })
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Error al aprobar el ticket');
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error al aprobar el ticket:", error);
    throw error;
  }
};

export const obtenerConversacionTicket = async (idTicket) => {
    try {
      const response = await fetch(`${API_URL}/ticket_chat/${idTicket}`);
      if (!response.ok) {
        throw new Error("Error al obtener la conversación");
      }
      const data = await response.json();
      return data.Mensajes; // Retorna el array de mensajes
    } catch (error) {
      console.error("Error al obtener la conversación:", error);
      return [];
    }
  };
export const conversacionTicket = async (idTicket, empleadoCui, mensaje) => {
  try {
    const response = await fetch(`${API_URL}/ticket_conversacion`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${localStorage.getItem("token")}`
      },
      body: JSON.stringify({
        ticket_id: Number(idTicket),
        empleado_cui: Number(empleadoCui),
        mensaje: mensaje
      }),
    });

    const responseData = await response.json();
    
    if (!response.ok) {
      throw new Error(responseData.error || "Error desconocido");
    }
    
    return responseData;
    
  } catch (error) {}
};
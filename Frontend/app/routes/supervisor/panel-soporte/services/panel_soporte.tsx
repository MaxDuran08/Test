import axios from "axios";
const API_URL = import.meta.env.VITE_API_URL;


export const ver_Tickets_Soporte = async () => {
  try {
    const response = await axios.get(`${API_URL}/tickets_supervisor`);
    return response.data;
  } catch (error) {
    console.error("Error al obtener los tickets de soporte", error);
    throw error;
  }
};

export const asignar_Ticket = async (ticketId: number, empleadoCui: number, supervisorCui: number) => {
  try {
    const response = await axios.post(`${API_URL}/asignar_ticket`, {
      ticket_id: ticketId,
      empleado_cui: empleadoCui,
      supervisor_cui: supervisorCui,
    });
    return response.data;
  } catch (error) {
    console.error("Error al asignar el ticket", error);
    throw error;
  }
};


export const cancelar_Ticket = async (ticket_id: number, razon: string, supervisor_cui: number) => {
  try {
    const response = await axios.post(`${API_URL}/cancelar_ticket`, {
      ticket_id,
      razon,
      supervisor_cui,
    });
    return response.data;
  } catch (error) {
    console.error("Error al cancelar el ticket", error);
    throw error;
  }
};


export const aceptar_Resolucion = async (ticket_id: number,supervisor_cui: number ) => {
  try {
    const response = await axios.post(`${API_URL}/aceptar_resolucion`, {
      ticket_id,
      supervisor_cui,
    });
    return response.data;
  } catch (error) {
    console.error("Error al aceptar la resolución del ticket", error);
    throw error;
  }
};

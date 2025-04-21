import axios from "axios";

// URL base de la API
const API_URL = import.meta.env.VITE_API_URL;

// Función para generar una factura
export const generarFactura = async (facturaData: { 
  Empleado_CUI: number;
  Cliente_idCliente: number;
  Metodo_pago: string;
  Direccion: string;
  Productos: { 
    id: number;
    cantidad: number;
  }[];
}) => {
  try {
    const response = await axios.post(`${API_URL}/generar_factura`, facturaData);
    
   //console.log('Factura generada:', response.data);

    return response.data; // Devuelve los datos de la respuesta (puede ser ID de la factura generada)
  } catch (error) {
    console.error("Error al generar la factura", error);
    throw error; // Lanza el error para ser manejado en el componente
  }
};

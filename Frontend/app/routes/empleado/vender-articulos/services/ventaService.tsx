import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;

export const registrarVenta = async (ventaData) => {
  try {
    console.log("Datos de la venta:", ventaData);
    const response = await axios.post(`${API_URL}/registrar_venta`, ventaData);
    return response.data;
  } catch (error) {
    console.error("Error al registrar la venta", error);
    throw error;
  }
};

export const verProducto = async () => {
  try {
    const response = await axios.get(`${API_URL}/ver_productos`);
    return response.data;
  } catch (error) {
    console.error("Error al obtener productos", error);
    throw error;
  }
};
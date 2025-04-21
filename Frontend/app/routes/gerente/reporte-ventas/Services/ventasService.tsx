import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;

export const ventas = async (ventasData: { fecha_inicio: String, fecha_fin: String }) => {
    try {
        const response = await axios.post(`${API_URL}/ventas`, ventasData);
        return response.data;
    } catch (error) {
        console.error("Error al consultar las ventas", error);
        throw error;
    }
};

export const ventasComparacion = async (ventasData: { fecha_inicio: String, fecha_fin: String }) => {
    try {
        const response = await axios.post(`${API_URL}/ventas_periodo`, ventasData);
        return response.data;
    } catch (error) {
        console.error("Error al consultar las ventas", error);
        throw error;
    }
};

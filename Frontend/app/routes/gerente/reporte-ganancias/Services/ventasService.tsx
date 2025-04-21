import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;

// Función para obtener las ganancias por producto
export const obtenerGananciasPorProducto = async () => {
    try {
        const response = await axios.get(`${API_URL}/margen_ganancia_producto`);
        return response.data;
    } catch (error) {
        console.error("Error al obtener las ganancias por producto", error);
        throw error;
    }
};

// Función para obtener la comparación de ganancias por periodos
export const obtenerComparacionGananciasPorPeriodo = async () => {
    try {
        const response = await axios.get(`${API_URL}/comparacion_ganancias_periodos`);
        return response.data;
    } catch (error) {
        console.error("Error al obtener la comparación de ganancias", error);
        throw error;
    }
};

// Función para obtener las ganancias netas por categoría
export const obtenerGananciasPorCategoria = async () => {
    try {
        const response = await axios.get(`${API_URL}/ganancias_categoria`);
        return response.data;
    } catch (error) {
        console.error("Error al obtener las ganancias por categoría", error);
        throw error;
    }
};

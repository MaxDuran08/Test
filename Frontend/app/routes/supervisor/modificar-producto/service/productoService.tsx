import axios from "axios";

// URL base de la API
const API_URL = import.meta.env.VITE_API_URL;


export const obtenerProductos = async () => {
    try {
        const response = await axios.get(`${API_URL}/ver_productos`);
        return response.data; // Retorna la lista de productos
    } catch (error) {
        console.error("Error al obtener productos", error);
        throw error;
    }
};

export const modificarProducto = async (data: {
    idProducto: number;
    Nombre: string;
    Descripcion: string;
    Categoria: string;
    Precio_compra: number;
    Precio_venta: number;
    Stock: number;
    Imagen_producto: string;
}) => {
    try {
        await axios.put(`${API_URL}/producto`, data);
    } catch (error) {
        console.error("Error al modificar producto", error);
        throw error;
    }
};

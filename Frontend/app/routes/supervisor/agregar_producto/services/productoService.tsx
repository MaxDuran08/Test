import axios from "axios";
 
 // URL base de la API
 const API_URL = import.meta.env.VITE_API_URL;
 
 // Función para agregar un empleado
 export const agregarProducto = async (productoData: {  nombre: string, descripcion: string, categoria: string, precio_compra: number, precio_venta: string, stock: number, foto: string }) => {
   try {
     const response = await axios.post(`${API_URL}/agregar_producto`, productoData);
     return response.data; // Devuelve los datos de la respuesta
   } catch (error) {
     console.error("Error al agregar producto", error);
     throw error; // Lanza el error para que pueda ser manejado en el componente
   }
 };
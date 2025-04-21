import axios from "axios";

// URL base de la API
const API_URL = import.meta.env.VITE_API_URL;

export const obtenerProductosLibros = async () => {
  try {
    const response = await axios.get(`${API_URL}/obtener_productos_libros`);
    return response.data;
  } catch (error) {
    console.error("Error al obtener libros y productos", error);
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

export const verificarListaDeseos = async (idCliente: number) => {
  try {
    const response = await axios.post(`${API_URL}/obtener_productos_libros_lista_deseos`, {
      idCliente
    });
    return response.data;
  } catch (error) {
    console.error("Error al verificar el producto en la lista de deseos", error);
    throw error;
  }
};

export const librosTop = async (idCliente: number) => {
  try {
    const response = await axios.post(`${API_URL}/obtener_libros_mejor_calificacion`, {
      idCliente
    });
    return response.data;
  } catch (error) {
    console.error("Error al verificar el producto en la lista de deseos", error);
    throw error;
  }
};

export const agregarProductoListaDeseos = async (idCliente: number, idProducto: number) => {
  try {
    const response = await axios.post(`${API_URL}/agregar_producto_lista_deseos`, {
      idCliente,
      idProducto
    });
    return response.data;
  } catch (error) {
    console.error("Error al agregar producto a la lista de deseos", error);
    throw error;
  }
};

export const eliminarProductoListaDeseos = async (idCliente: number, idProducto: number) => {
  try {
    const response = await axios.delete(`${API_URL}/eliminar_producto_lista_deseos`, {
      data: { idCliente, idProducto }
    });
    return response.data;
  } catch (error) {
    console.error("Error al eliminar producto de la lista de deseos", error);
    throw error;
  }
};

export const agregarLibroListaDeseos = async (idCliente: number, idLibros: number) => {
  try {
    const response = await axios.post(`${API_URL}/agregar_libro_lista_deseos`, {
      idCliente,
      idLibros
    });
    return response.data;
  } catch (error) {
    console.error("Error al agregar libro a la lista de deseos", error);
    throw error;
  }
};

export const eliminarLibroListaDeseos = async (idCliente: number, idLibros: number) => {
  try {
    const response = await axios.delete(`${API_URL}/eliminar_libro_lista_deseos`, {
      data: { idCliente, idLibros }
    });
    return response.data;
  } catch (error) {
    console.error("Error al eliminar libro de la lista de deseos", error);
    throw error;
  }
};

export const registrarFactura = async (facturaData: any, detallesLibros: any[], detallesProductos: any[]) => {
  try {
    // Realizar la solicitud POST al backend
    const response = await axios.post(`${API_URL}/registrar_factura`, {
      facturaData,
      detallesLibros,
      detallesProductos
    }, {
      headers: {
        'Content-Type': 'application/json'  // Enviar los datos en formato JSON
      },
      responseType: 'blob'  // Indicar que esperamos una respuesta en formato binario (PDF)
    });

    // Crear un enlace de descarga para el PDF
    const blob = new Blob([response.data], { type: 'application/pdf' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'factura.pdf';  // Nombre del archivo que se descargará
    link.click();  // Simula el clic para iniciar la descarga

  } catch (error) {
    console.error("Error al registrar la factura", error);
    throw error;
  }
};

export const obtenerProductosLibrosDeseados = async (clienteId: number) => {
  try {
    const response = await axios.get(`${API_URL}/obtener_productos_libros_deseados`, {
      params: { Cliente_idCliente: clienteId }
    });
    return response.data;
  } catch (error) {
    console.error("Error al obtener productos y libros deseados", error);
    throw error;
  }
};
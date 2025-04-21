import { useNavigate } from 'react-router'; // Importa el hook navigate
import { useEffect, useState } from "react";
import { obtenerProductosLibros } from "~/common/services/services";
import ItemCard from "../cliente/components/itemCard";

const Productos = () => {
    const navigate = useNavigate(); // Hook para redirigir
    const [libros, setLibros] = useState([]);
    const [productos, setProductos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [idCliente, setIdCliente] = useState("0");

    useEffect(() => {
        const fetchData = async () => {
            try {
                const data = await obtenerProductosLibros();
                setLibros(data.libros);
                setProductos(data.productos);
            } catch (err) {
                setError("Error al obtener los datos");
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    if (loading) return <p className="text-center text-white">Cargando datos...</p>;
    if (error) return <p className="text-center text-red-500">{error}</p>;

    return (
        <div className="max-w-6xl mx-auto p-6">
            {/* Botones para redirigir al login y registro */}
            <div className="mt-10 flex justify-center gap-6">
                <button
                    onClick={() => navigate("/login")}
                    className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
                >
                    Iniciar sesión
                </button>
                <button
                    onClick={() => navigate("/register")}
                    className="px-6 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50"
                >
                    Registrarse
                </button>
            </div>
            <h2 className="text-3xl font-bold text-white mb-6">Libros</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {libros.map((libro) => {
                    return (
                        <ItemCard
                            key={libro.idLibros}
                            item={libro}
                            type="libros"
                            idCliente={0}
                            enListaDeseos={false}
                            mostrarBotones={false}
                        />
                    );
                })}
            </div>
            <h2 className="text-3xl font-bold text-white mt-10 mb-6">Productos</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {productos.map((producto) => {
                    return (
                        <ItemCard
                            key={producto.idProducto}
                            item={producto}
                            type="productos"
                            idCliente={0}
                            enListaDeseos={false}
                            mostrarBotones={false}
                        />
                    );
                })}
            </div>
        </div>
    );
};

export default Productos;
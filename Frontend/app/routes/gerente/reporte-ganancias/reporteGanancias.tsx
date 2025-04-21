import { useState, useEffect } from "react";
import { obtenerGananciasPorProducto, obtenerComparacionGananciasPorPeriodo, obtenerGananciasPorCategoria } from "../reporte-ganancias/Services/ventasService"; 
import { Bar } from "react-chartjs-2";
import "chart.js/auto";

// Función para obtener el primer y último día del mes actual
const getCurrentMonthDates = () => {
    const today = new Date();
    const firstDay = new Date(today.getFullYear(), today.getMonth(), 1).toISOString().split("T")[0];
    const lastDay = new Date(today.getFullYear(), today.getMonth() + 1, 0).toISOString().split("T")[0];
    return { firstDay, lastDay };
};

const ReporteGanancias = () => {
    const { firstDay, lastDay } = getCurrentMonthDates();

    const [productosGanados, setProductosGanados] = useState([]);
    const [gananciasCategorias, setGananciasCategorias] = useState([]);
    const [fechaInicio, setFechaInicio] = useState(firstDay);
    const [fechaFin, setFechaFin] = useState(lastDay);
    const [comparaciones, setComparaciones] = useState([]);
    const [mensajeReporte, setMensajeReporte] = useState(`Reporte del mes ${new Date().toLocaleString('default', { month: 'long' })} ${new Date().getFullYear()}`);
    const [modalOpen, setModalOpen] = useState(false);
    const [modalMessage, setModalMessage] = useState("");
    const [modalType, setModalType] = useState<"success" | "error">("success");

    // useEffect(() => {
    //     const fetchComparaciones = async () => {
    //         try {
    //             const comparacionesData = await obtenerComparacionGananciasPorPeriodo();
    //             setComparaciones(comparacionesData);

    //             if (comparacionesData.length === 1) {
    //                 setFechaInicio(comparacionesData[0].Periodo);
    //                 setFechaFin(comparacionesData[0].Periodo);
    //                 setMensajeReporte(`Reporte para el mes de ${comparacionesData[0].Periodo}`);
    //             }
    //         } catch (error) {
    //             console.error("Error al obtener las comparaciones de ganancias:", error);
    //             setModalMessage("Hubo un error al obtener las comparaciones de ganancias.");
    //             setModalType("error");
    //             setModalOpen(true);
    //         }
    //     };

    //     fetchComparaciones();
    // }, []);

    useEffect(() => {
        let isMounted = true;
        const fetchGanancias = async () => {
            try {
                const dataProducto = await obtenerGananciasPorProducto();
                const dataCategoria = await obtenerGananciasPorCategoria();
    
                if (isMounted) {
                    setProductosGanados(dataProducto);
                    setGananciasCategorias(dataCategoria);
                }


                try {
                    const comparacionesData = await obtenerComparacionGananciasPorPeriodo();
                    setComparaciones(comparacionesData);
    
                    if (comparacionesData.length === 1) {
                        setFechaInicio(comparacionesData[0].Periodo);
                        setFechaFin(comparacionesData[0].Periodo);
                        setMensajeReporte(`Reporte para el mes de ${comparacionesData[0].Periodo}`);
                    }
                } catch (error) {
                    console.error("Error al obtener las comparaciones de ganancias:", error);
                    setModalMessage("Hubo un error al obtener las comparaciones de ganancias.");
                    setModalType("error");
                    setModalOpen(true);
                }
                
            } catch (error) {
                if (isMounted) {
                    setModalMessage("Hubo un error al obtener las ganancias.");
                    setModalType("error");
                    setModalOpen(true);
                }
            }
        };
    
        fetchGanancias();
    
        return () => {
            isMounted = false; // Evita setState en un componente desmontado
        };
    }, [fechaInicio, fechaFin]);

    const obtenerGananciaTotal = (periodo: string) => {
        const periodoEncontrado = comparaciones.find(item => item.Periodo === periodo);
        return periodoEncontrado ? periodoEncontrado.Ganancias : 0;
    };

    return (
        <div className="max-w-6xl mx-auto p-6 bg-gray-800 text-white rounded-lg shadow-lg">
            <h1 className="text-3xl font-bold mb-6 text-center">Reporte de Ganancias</h1>

            {/* Información de margen de ganancia por producto */}
            <div className="mb-8">
                <h2 className="text-xl font-semibold mb-4">Margen de Ganancia por Producto</h2>
                <ul className="bg-gray-700 p-4 rounded-lg">
                    {productosGanados.length > 0 ? (
                        productosGanados.map((item, index) => (
                            <li key={index} className="flex flex-col md:flex-row md:justify-between border-b py-3">
                                <div>
                                    <p className="font-semibold">{item?.Producto }</p>
                                    {/* <p className="text-sm">Precio compra: {item?.Precio_compra ? `Q${parseFloat(item.Precio_compra).toFixed(2)}` : "N/A"}</p> */}
                                    <p className="text-sm">Precio venta: {item?.Precio_venta ? `Q${parseFloat(item.Precio_venta).toFixed(2)}` : "N/A"}</p>
                                    <p className="text-sm">Margen de ganancia: {item?.Margen_Ganancia ? `Q${parseFloat(item.Margen_Ganancia).toFixed(2)}` : "N/A"}</p>
                                </div>
                                <div className="text-right mt-2 md:mt-0">
                                    <span className="font-bold">Total vendido: {item?.Total_Vendido ?? 0}</span>
                                </div>
                            </li>
                        ))
                    ) : (
                        <p>No hay productos ganados disponibles.</p>
                    )}
                </ul>
            </div>

            {/* Gráfico de ganancias por categoría */}
            <div className="mb-8">
                <h2 className="text-xl font-semibold mb-4">Ganancias por Categoría</h2>
                <div className="bg-gray-700 p-4 rounded-lg">
                    <Bar
                        data={{
                            labels: gananciasCategorias?.map((item) => item?.Producto || "Categoría desconocida"),
                            datasets: [
                                {
                                    label: "Ganancia neta",
                                    data: gananciasCategorias?.map((item) => parseFloat(item?.Ganancia_Neta || "0")),
                                    backgroundColor: "rgba(75, 192, 192, 0.6)",
                                    borderColor: "rgba(75, 192, 192, 1)",
                                    borderWidth: 1,
                                },
                            ],
                        }}
                        options={{
                            responsive: true,
                            plugins: {
                                legend: {
                                    display: false,
                                },
                            },
                        }}
                    />
                </div>
            </div>

            {/* Comparación de ganancias por periodos */}
            <div className="mb-8">
                <h2 className="text-xl font-semibold mb-4">Comparación de Ganancias por Periodo</h2>
                <ul className="bg-gray-700 p-4 rounded-lg">
                    {comparaciones.length > 0 ? (
                        comparaciones.map((item, index) => (
                            <li key={index} className="flex justify-between border-b py-2">
                                <span>{item?.Periodo}</span>
                                <span className="font-bold">Ganancia: Q{parseFloat(item?.Ganancias || "0").toFixed(2)}</span>
                            </li>
                        ))
                    ) : (
                        <p>No hay comparaciones de ganancias disponibles.</p>
                    )}
                </ul>
            </div>
        </div>
    );
};

export default ReporteGanancias;

import { useState, useEffect } from "react";
import { ventas, ventasComparacion } from "../../gerente/reporte-ventas/Services/ventasService";
import { Bar } from "react-chartjs-2";
import "chart.js/auto";
import Modal from "~/common/components/Modal";

// Función para obtener el primer y último día del mes actual
const getCurrentMonthDates = () => {
    const today = new Date();
    const firstDay = new Date(today.getFullYear(), today.getMonth(), 1).toISOString().split("T")[0];
    const lastDay = new Date(today.getFullYear(), today.getMonth() + 1, 0).toISOString().split("T")[0];
    return { firstDay, lastDay };
};

const ReporteVentas = () => {
    // Obtener fechas del mes actual
    const { firstDay, lastDay } = getCurrentMonthDates();

    // Estados para los datos de ventas y filtros de fecha
    const [productosVendidos, setProductosVendidos] = useState([]);
    const [ventasCategorias, setVentasCategorias] = useState([]);
    const [fechaInicio, setFechaInicio] = useState(firstDay);
    const [fechaFin, setFechaFin] = useState(lastDay);
    const [comparaciones, setComparaciones] = useState([
        { id: Date.now(), fecha_inicio: firstDay, fecha_fin: lastDay, total_facturas: 0, total_ventas: 0 },
    ]);
    const [mensajeReporte, setMensajeReporte] = useState(`Reporte del mes ${new Date().toLocaleString('default', { month: 'long' })} ${new Date().getFullYear()}`);
    const [modalOpen, setModalOpen] = useState(false);
    const [modalMessage, setModalMessage] = useState("");
    const [modalType, setModalType] = useState<"success" | "error">("success");
    const [resultadosComparaciones, setResultadosComparaciones] = useState([]);

    // Efecto para cargar ventas con las fechas seleccionadas
    useEffect(() => {
        const fetchVentas = async () => {
            try {
                const data = await ventas({ fecha_inicio: fechaInicio, fecha_fin: fechaFin });
                setProductosVendidos(data?.productos_vendidos || []);
                setVentasCategorias(data?.volumen_Ventas_categorias || []);
            } catch (error) {
                console.error("Error al obtener las ventas:", error);
                setModalMessage("Hubo un error al obtener las ventas.");
                setModalType("error");
                setModalOpen(true);
            }
        };

        fetchVentas();
        if (fechaInicio === firstDay && fechaFin === lastDay) {
            setMensajeReporte(`Reporte del mes ${new Date().toLocaleString('default', { month: 'long' })} ${new Date().getFullYear()}`);
        } else {
            setMensajeReporte(`Reporte de ${fechaInicio} hasta ${fechaFin}`);
        }
    }, [fechaInicio, fechaFin]);

    // Función para manejar la comparación de ventas
    const handleComparar = async (index: number) => {
        try {
            const { fecha_inicio, fecha_fin, id } = comparaciones[index];

            if (!fecha_inicio || !fecha_fin) {
                console.log("Fechas no válidas");
                return;
            }

            // Verificar si las fechas son las mismas que las anteriores
            const existingResult = resultadosComparaciones.find((r) => r.id === id);

            // Hacer la petición de comparación
            const data = await ventasComparacion({ fecha_inicio, fecha_fin });

            // Si ya existe el resultado, actualizamos el estado
            if (existingResult) {
                setResultadosComparaciones((prev) =>
                    prev.map((r) =>
                        r.id === id
                            ? { ...r, total_facturas: data.total_facturas, total_ventas: data.total_ventas, fecha_inicio, fecha_fin }
                            : r
                    )
                );
            } else {
                // Si no existe, agregarlo como un nuevo resultado
                setResultadosComparaciones((prev) => [
                    ...prev,
                    {
                        id,
                        fecha_inicio,
                        fecha_fin,
                        total_facturas: data.total_facturas,
                        total_ventas: data.total_ventas,
                    },
                ]);
            }
        } catch (error) {
            console.error("Error al obtener comparación de ventas:", error);
            setModalMessage("Hubo un error al obtener la comparación de ventas.");
            setModalType("error");
            setModalOpen(true);
        }
    };

    // Agregar un nuevo cuadro de comparación de ventas
    const handleAddComparison = () => {
        setComparaciones([
            ...comparaciones,
            { id: Date.now(), fecha_inicio: firstDay, fecha_fin: lastDay, total_facturas: 0, total_ventas: 0 },
        ]);
    };

    // Función para limpiar todas las comparaciones
    const handleClearComparisons = () => {
        setComparaciones([]);
        setResultadosComparaciones([]);
    };

    // Función para resaltar los valores más altos y más bajos
    const getCellClassName = (value: number, isFacturas: boolean) => {
        if (isFacturas) {
            const max = Math.max(...resultadosComparaciones.map((r) => r.total_facturas));
            const min = Math.min(...resultadosComparaciones.map((r) => r.total_facturas));
            return value === max ? "bg-green-400" : value === min ? "bg-red-400" : "";
        } else {
            const max = Math.max(...resultadosComparaciones.map((r) => r.total_ventas));
            const min = Math.min(...resultadosComparaciones.map((r) => r.total_ventas));
            return value === max ? "bg-green-400" : value === min ? "bg-red-400" : "";
        }
    };

    // Función para cerrar el modal
    const handleModalClose = () => {
        setModalOpen(false);
    };

    return (
        <div className="max-w-6xl mx-auto p-6 bg-gray-800 text-white rounded-lg shadow-lg">
            <h1 className="text-3xl font-bold mb-6 text-center">Reporte de Ventas</h1>

            {/* Mensaje de tipo de reporte */}
            <div className="mb-4 text-center text-xl font-semibold">{mensajeReporte}</div>

            {/* Filtros por fecha */}
            <div className="flex gap-4 mb-6">
                <div>
                    <label className="block text-sm">Fecha de Inicio</label>
                    <input
                        type="date"
                        className="w-full px-4 py-2 rounded-md bg-gray-600 text-white border border-gray-500 focus:ring-2 focus:ring-blue-500"
                        value={fechaInicio}
                        onChange={(e) => setFechaInicio(e.target.value)}
                    />
                </div>
                <div>
                    <label className="block text-sm">Fecha de Fin</label>
                    <input
                        type="date"
                        className="w-full px-4 py-2 rounded-md bg-gray-600 text-white border border-gray-500 focus:ring-2 focus:ring-blue-500"
                        value={fechaFin}
                        onChange={(e) => setFechaFin(e.target.value)}
                    />
                </div>
            </div>

            {/* Lista de productos vendidos */}
            <div className="mb-8">
                <h2 className="text-xl font-semibold mb-4">Productos Vendidos</h2>
                <ul className="bg-gray-700 p-4 rounded-lg">
                    {productosVendidos.length > 0 ? (
                        productosVendidos.map((item, index) => (
                            <li key={index} className="flex justify-between border-b py-2">
                                <span>{item?.Producto || "Producto desconocido"}</span>
                                <span className="font-bold">{item?.TotalFacturas ?? 0}</span>
                            </li>
                        ))
                    ) : (
                        <p>No hay productos vendidos disponibles.</p>
                    )}
                </ul>
            </div>

            {/* Gráfico de ventas por categoría */}
            <div className="mb-8">
                <h2 className="text-xl font-semibold mb-4">Ventas por Categoría</h2>
                <div className="bg-gray-700 p-4 rounded-lg">
                    <Bar
                        data={{
                            labels: ventasCategorias?.map((item) => item?.Categoria) || [],
                            datasets: [
                                {
                                    label: "Ventas Totales",
                                    data: ventasCategorias?.map((item) => parseFloat(item?.VentasTotales || "0")) || [],
                                    backgroundColor: "rgba(75, 192, 192, 0.6)",
                                    borderColor: "rgba(75, 192, 192, 1)",
                                    borderWidth: 1,
                                },
                            ],
                        }}
                    />
                </div>
            </div>

            {/* Tabla de comparaciones */}
            <div className="mb-8">
                <h2 className="text-xl font-semibold mb-4">Resultados de Comparación</h2>
                <table className="w-full table-auto bg-gray-700 rounded-lg">
                    <thead>
                        <tr>
                            <th className="px-4 py-2">Fecha de Inicio</th>
                            <th className="px-4 py-2">Fecha de Fin</th>
                            <th className="px-4 py-2">Total Facturas</th>
                            <th className="px-4 py-2">Total Ventas</th>
                        </tr>
                    </thead>
                    <tbody>
                        {resultadosComparaciones.map((resultado) => (
                            <tr key={resultado.id} className="text-center">
                                <td className="px-4 py-2">{resultado.fecha_inicio}</td>
                                <td className="px-4 py-2">{resultado.fecha_fin}</td>
                                <td className={`px-4 py-2 ${getCellClassName(resultado.total_facturas, true)}`}>
                                    {resultado.total_facturas}
                                </td>
                                <td className={`px-4 py-2 ${getCellClassName(resultado.total_ventas, false)}`}>
                                    {resultado.total_ventas}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                {resultadosComparaciones.length === 0 && <p>No hay resultados de comparación disponibles.</p>}
            </div>

            {/* Comparación de ventas */}
            <div className="mb-8">
                <h2 className="text-xl font-semibold mb-4">Comparación de Ventas</h2>
                {comparaciones.map((comparacion, index) => (
                    <div key={comparacion.id} className="bg-gray-700 p-4 rounded-lg mb-4">
                        <div className="grid grid-cols-2 gap-4 mb-4">
                            <div>
                                <label className="block text-sm">Fecha de Inicio</label>
                                <input
                                    type="date"
                                    className="w-full px-4 py-2 rounded-md bg-gray-600 text-white border border-gray-500 focus:ring-2 focus:ring-blue-500"
                                    value={comparacion.fecha_inicio}
                                    onChange={(e) =>
                                        setComparaciones((prev) =>
                                            prev.map((c) =>
                                                c.id === comparacion.id ? { ...c, fecha_inicio: e.target.value } : c
                                            )
                                        )
                                    }
                                />
                            </div>
                            <div>
                                <label className="block text-sm">Fecha de Fin</label>
                                <input
                                    type="date"
                                    className="w-full px-4 py-2 rounded-md bg-gray-600 text-white border border-gray-500 focus:ring-2 focus:ring-blue-500"
                                    value={comparacion.fecha_fin}
                                    onChange={(e) =>
                                        setComparaciones((prev) =>
                                            prev.map((c) =>
                                                c.id === comparacion.id ? { ...c, fecha_fin: e.target.value } : c
                                            )
                                        )
                                    }
                                />
                            </div>
                        </div>
                        <div className="flex justify-end gap-4">
                            <button
                                onClick={() => handleComparar(index)}
                                className="bg-blue-600 px-4 py-2 rounded-lg"
                            >
                                Comparar
                            </button>
                        </div>
                    </div>
                ))}
                <button onClick={handleAddComparison} className="bg-green-600 px-4 py-2 rounded-lg">
                    Agregar Comparación
                </button>
            </div>

            {/* Botón Limpiar comparaciones */}
            <div className="mb-8">
                <button onClick={handleClearComparisons} className="bg-red-600 px-4 py-2 rounded-lg">
                    Limpiar Comparaciones
                </button>
            </div>

            {/* Modal */}
            <Modal open={modalOpen} onClose={handleModalClose} type={modalType} message={modalMessage} />
        </div>
    );
};

export default ReporteVentas;
import React, { useState, useEffect } from "react";
import { obtenerStockProductos } from "./services/alertaGeneralServices";
import "./alertasSupervisor.css";

// Define interfaces for Producto and Alerta
interface Producto {
  idProducto: number;
  Nombre: string;
  Stock: number;
}

interface Alerta {
  idProducto: number;
  Nombre: string;
  Stock: number;
  Minimo: number;
}

const alertasSupervisor = () => {
  // States with explicit types
  const [productos, setProductos] = useState<Producto[]>([]);
  const [stockGeneralMinimo, setStockGeneralMinimo] = useState<number>(0);
  const [stockPorProducto, setStockPorProducto] = useState<{ [key: number]: number }>({});
  const [alertas, setAlertas] = useState<Alerta[]>([]);

  // Load initial data from localStorage and the stock service
  useEffect(() => {
    // Load configurations from localStorage
    const storedGeneralMinimo = localStorage.getItem("stockGeneralMinimo");
    if (storedGeneralMinimo) {
      setStockGeneralMinimo(parseInt(storedGeneralMinimo, 10));
    }

    const storedStockPorProducto = localStorage.getItem("stockPorProducto");
    if (storedStockPorProducto) {
      setStockPorProducto(JSON.parse(storedStockPorProducto));
    }

    // Fetch product stock
    const fetchStock = async () => {
      try {
        const data = await obtenerStockProductos();
        console.log(data)
        // Assume the service returns an array of products
        setProductos(data["Stock en productos obtenidos"] || data);
      } catch (error) {
        console.error("Error al cargar stock de productos", error);
      }
    };
    fetchStock();
  }, []);

  // Calculate alerts when products or configurations change
  useEffect(() => {
    const nuevasAlertas: Alerta[] = [];
    productos.forEach((producto: Producto) => {
      // Determine the applicable minimum: product-specific or general
      const minimo = stockPorProducto[producto.idProducto] || stockGeneralMinimo;
      if (producto.Stock < minimo) {
        nuevasAlertas.push({
          idProducto: producto.idProducto,
          Nombre: producto.Nombre,
          Stock: producto.Stock,
          Minimo: minimo,
        });
      }
    });
    setAlertas(nuevasAlertas);
  }, [productos, stockGeneralMinimo, stockPorProducto]);

  // Render the component
  return (
    <div className="alertas-supervisor">
      <h1>Alertas de Stock</h1>
      {alertas.length === 0 ? (
        <p>No hay alertas activas.</p>
      ) : (
        <ul>
          {alertas.map((alerta: Alerta) => (
            <li key={alerta.idProducto}>
              {alerta.Nombre} - Stock actual: {alerta.Stock} (Mínimo requerido: {alerta.Minimo})
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default alertasSupervisor;
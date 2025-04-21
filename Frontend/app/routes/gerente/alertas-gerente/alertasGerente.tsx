import React, { useState, useEffect } from "react";
import Modal from "~/common/components/Modal";
import { obtenerStockProductos } from "./services/alertaGeneralServices";
import "./alertasGerente.css"; // Importa el archivo CSS

// Interfaces para tipado
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

const alertasGerente = () => {
  // Estados
  const [stockGeneralMinimo, setStockGeneralMinimo] = useState<number>(0); // Mínimo general por defecto
  const [stockPorProducto, setStockPorProducto] = useState<{ [key: number]: number }>({}); // Mínimos por producto
  const [productos, setProductos] = useState<Producto[]>([]); // Lista de productos con stock
  const [alertas, setAlertas] = useState<Alerta[]>([]); // Alertas actuales

  // Cargar configuraciones desde localStorage al montar el componente
  useEffect(() => {
    const storedGeneralMinimo = localStorage.getItem("stockGeneralMinimo");
    if (storedGeneralMinimo) {
      setStockGeneralMinimo(parseInt(storedGeneralMinimo, 0));
    }

    const storedStockPorProducto = localStorage.getItem("stockPorProducto");
    if (storedStockPorProducto) {
      setStockPorProducto(JSON.parse(storedStockPorProducto));
    }
  }, []);

  // Guardar configuraciones en localStorage cuando cambien
  useEffect(() => {
    localStorage.setItem("stockGeneralMinimo", stockGeneralMinimo.toString());
  }, [stockGeneralMinimo]);

  useEffect(() => {
    localStorage.setItem("stockPorProducto", JSON.stringify(stockPorProducto));
  }, [stockPorProducto]);

  // Cargar stock de productos al montar el componente
  useEffect(() => {
    const fetchStock = async () => {
      try {
        const data = await obtenerStockProductos();
        // Asumimos que el endpoint devuelve un objeto con una propiedad como "Stock en productos obtenidos"
        console.log(data);
        setProductos(data["Stock en productos obtenidos"] || data);
      } catch (error) {
        console.error("Error al cargar stock de productos", error);
      }
    };
    fetchStock();
  }, []);

  // Calcular alertas cuando cambian productos o configuraciones
  useEffect(() => {
    const nuevasAlertas: Alerta[] = [];
    productos.forEach((producto) => {
      // Usar el mínimo específico si existe, sino el general
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

  // Manejar la configuración general
  const handleSetGeneralMinimo = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const nuevoMinimo = parseInt(formData.get("generalMinimo") as string, 0);
    if (!isNaN(nuevoMinimo)) {
      setStockGeneralMinimo(nuevoMinimo);
    }
  };

  // Manejar la configuración por producto
  const handleSetProductoMinimo = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const idProducto = parseInt(formData.get("idProducto") as string, 0);
    const nuevoMinimo = parseInt(formData.get("productoMinimo") as string, 0);
    if (!isNaN(idProducto) && !isNaN(nuevoMinimo)) {
      setStockPorProducto((prev) => ({ ...prev, [idProducto]: nuevoMinimo }));
    }
  };

  // Resetear todas las alertas y configuraciones
  const handleResetAlertas = () => {
    setStockGeneralMinimo(0); // Restablecer el mínimo general a 0
    setStockPorProducto({}); // Eliminar todos los mínimos por producto
    localStorage.setItem("stockGeneralMinimo", "0"); // Actualizar localStorage
    localStorage.setItem("stockPorProducto", JSON.stringify({}));
  };

  return (
    <div className="alertas-gerente">
      <center>
        <h1>Alertas de Stock</h1>
      </center>

      {/* Formulario para configuración general */}
      <section>
        <h2>Configuración General</h2>
        <form onSubmit={handleSetGeneralMinimo}>
          <label>
            Mínimo de stock general:
            <input
              type="number"
              name="generalMinimo"
              defaultValue={stockGeneralMinimo}
              min="0"
            />
          </label>
          <button type="submit">Guardar</button>
        </form>
      </section>

      {/* Formulario para configuración por producto */}
      <section>
        <h2>Configuración por Producto</h2>
        <form onSubmit={handleSetProductoMinimo}>
          <label>
            ID del producto:
            <input type="number" name="idProducto" min="1" />
          </label>
          <label>
            Mínimo de stock:
            <input type="number" name="productoMinimo" min="0" />
          </label>
          <button type="submit">Guardar</button>
        </form>
      </section>

      {/* Visualización de alertas */}
      <section>
        <h2>Alertas Actuales</h2>
        {alertas.length === 0 ? (
          <p>No hay alertas activas.</p>
        ) : (
          <ul>
            {alertas.map((alerta) => (
              <li key={alerta.idProducto}>
                {alerta.Nombre} - Stock: {alerta.Stock} (Mínimo: {alerta.Minimo})
              </li>
            ))}
          </ul>
        )}
      </section>

      {/* Botón para resetear alertas */}
      <section>
        <button onClick={handleResetAlertas} className="reset-button">
          Resetear Alertas
        </button>
      </section>
    </div>  
  );
};

export default alertasGerente;
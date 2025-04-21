import { type RouteConfig, index } from "@react-router/dev/routes";

export default [
  index("routes/home.tsx"),
  {
    path: "login",
    file: "routes/login/login.tsx",
  },
  {
    path: "register",
    file: "routes/register/register.tsx",
  },
  {
    path: "productos",
    file: "routes/productos/productos.tsx",
  },
  {
    path: "gerente/*",
    file: "routes/gerente/gerente.tsx",
    children: [
        {
          path: "agregar-supervisor",
          file: "routes/gerente/agregar-supervisor/agregarSupervisor.tsx",
        },
        {
          path: "eliminar-supervisor",
          file: "routes/gerente/eliminar-supervisor/eliminarSupervisor.tsx",
        },
        {
          path: "modificar-supervisor",
          file: "routes/gerente/modificar-supervisor/modificarSupervisor.tsx",
        },
        {
          path: "ver-supervisores",
          file: "routes/gerente/ver-supervisores/verSupervisores.tsx",
        },
        {
          path: "ver_facturas",
          file: "routes/gerente/ver_facturas/ver_Facturas.tsx",
        },
        {
          path: "ver_ganancias",
          file: "routes/gerente/reporte-ganancias/reporteGanancias.tsx",
        },
        {
          path: "reporte-ventas",
          file: "routes/gerente/reporte-ventas/reporteVentas.tsx",
        },
        {
          path: "alertas-gerente",
          file: "routes/gerente/alertas-gerente/alertasGerente.tsx",
        },
        
      ],
  },
  {
    path: "supervisor/*",
    file: "routes/supervisor/supervisor.tsx",
    children: [
      {
        path: "agregar_producto",
        file: "routes/supervisor/agregar_producto/agregar_Producto.tsx",
      },
      {
        path: "agregar_libro",
        file: "routes/supervisor/agregar-libro/agregarLibro.tsx",
      },
      {
        path: "ver_producto",
        file: "routes/supervisor/ver_producto/ver_Producto.tsx",
      },
      {
        path: "ver_opiniones",
        file: "routes/supervisor/ver_opiniones/ver_Opiniones.tsx",
      },
      {
        path: "ver_facturas",
        file: "routes/supervisor/ver_facturas/ver_Facturas.tsx",
      },
      {
        path: "ver-empleados",
        file: "routes/supervisor/ver-empleados/verEmpleados.tsx",
      },
      {
        path: "eliminar-producto",
        file: "routes/supervisor/eliminar-producto/eliminarProducto.tsx",
      },
      {
        path: "agregar-empleado",
        file: "routes/supervisor/agregar-empleado/agregarEmpleado.tsx",
      },
      {
        path: "modificar-empleado",
        file: "routes/supervisor/modificar-empleado/modificarEmpleado.tsx",
      },
      {
        path: "eliminar-empleado",
        file: "routes/supervisor/eliminar-empleado/eliminarEmpleado.tsx",
      },
      {
        path: "modificar-libro",
        file: "routes/supervisor/modificar-libro/modificarLibro.tsx",
      },
      {
        path: "eliminar-libro",
        file: "routes/supervisor/eliminar-libro/eliminarLibro.tsx",
      },
      {
        path: "alertas-supervisor",
        file: "routes/supervisor/alertas-supervisor/alertasSupervisor.tsx",
      },
      {
        path: "modificar-producto",
        file: "routes/supervisor/modificar-producto/modificarProducto.tsx",
      },
      {
        path: "panel-soporte",
        file: "routes/supervisor/panel-soporte/Panel_soporte.tsx",
      }
    ],
  },
  {
    path: "empleado/*",
    file: "routes/empleado/empleado.tsx",
    children: [
      {
        path: "ver_facturas",
        file: "routes/empleado/ver_facturas/ver_Facturas.tsx",
      },
      {
        path: "consultar-articulo",
        file: "routes/empleado/consultar-articulo/consultarArticulo.tsx",
      },
      {
        path: "generar_facturas",
        file: "routes/empleado/generar_facturas/generar_Facturas.tsx",
      },
      {
        path: "vender-articulos",
        file: "routes/empleado/vender-articulos/venderArticulo.tsx",
      },
      {
        path: "ticket-empleado",
        file: "routes/empleado/ticket/ticket_empleado.tsx",
      },
      



    ],
  },
  {
    path: "cliente/*",
    file: "routes/cliente/cliente.tsx",
    children: [
      {
        path: "ver-libros",
        file: "routes/cliente/ver-libros/verLibros.tsx",
      },
      {
        path: "ver-lista-deseos",
        file: "routes/cliente/ver-lista-deseos/verListaDeseos.tsx",
      },
      {
        path: "buscar-libro",
        file: "routes/cliente/buscar-libro/buscarLibro.tsx",
      },
      {
        path: "ver-libros-mas-votados",
        file: "routes/cliente/ver-libros-mas-votados/verLibrosMasVotados.tsx",
      },
      {
        path: "realizar-compra",
        file: "routes/cliente/realizar-compra/realizarCompra.tsx",
      },
    ],
  },
] satisfies RouteConfig;

import { Link, useNavigate } from "react-router";
import { IoMdWarning } from "react-icons/io";
import { AiFillWarning } from "react-icons/ai";
import { FaTicketAlt } from "react-icons/fa";
import { FaUserPlus, FaTrash, FaEdit, FaFileInvoice,FaBookMedical ,FaMoneyBillWave , FaChartBar, FaSearch, FaBox, FaUsers, FaRegTrashAlt, FaBook, FaHeart, FaStar, FaCreditCard } from "react-icons/fa";



const menus = {
  gerente: [
    { name: "Agregar Supervisores", path: "/gerente/agregar-supervisor", icon: <FaUserPlus /> },
    { name: "Eliminar Supervisor", path: "/gerente/eliminar-supervisor", icon: <FaTrash /> },
    { name: "Modificar Supervisor", path: "/gerente/modificar-supervisor", icon: <FaEdit /> },
    { name: "Ver Supervisores", path: "/gerente/ver-supervisores", icon: <FaUsers /> },
    { name: "Ver Facturas", path: "/gerente/ver_facturas", icon: <FaFileInvoice /> },
    { name: "Reporte de Ganancias", path: "/gerente/ver_ganancias", icon: <FaMoneyBillWave  /> },
    { name: "Reporte de Ventas", path: "/gerente/reporte-ventas", icon: <FaChartBar /> },
    { name: "Configurar Alertas", path: "/gerente/alertas-gerente/", icon: <AiFillWarning  /> },
  ],
  supervisor: [
    { name: "Agregar Empleado", path: "/supervisor/agregar-empleado", icon: <FaUserPlus /> },
    { name: "Eliminar Empleado", path: "/supervisor/eliminar-empleado", icon: <FaTrash /> },
    { name: "Modificar Empleado", path: "/supervisor/modificar-empleado", icon: <FaEdit /> },
    { name: "Agregar Producto", path: "/supervisor/agregar_producto", icon: <FaUserPlus /> },
    { name: "Modificar Producto", path: "/supervisor/modificar-producto", icon: <FaEdit /> },
    { name: "Eliminar Productos", path: "/supervisor/eliminar-producto", icon: <FaRegTrashAlt /> },
    { name: "Agregar Libro", path: "/supervisor/agregar_libro", icon: <FaBookMedical  /> },
    { name: "Modificar Libro", path: "/supervisor/modificar-libro", icon: <FaEdit /> },
    { name: "Eliminar Libro", path: "/supervisor/eliminar-libro", icon: <FaRegTrashAlt /> },
    { name: "Ver Empleados", path: "/supervisor/ver-empleados", icon: <FaUsers /> },
    { name: "Ver Productos", path: "/supervisor/ver_producto", icon: <FaFileInvoice /> },
    { name: "Ver Facturas", path: "/supervisor/ver_facturas", icon: <FaFileInvoice /> },
    { name: "Ver opiniones", path: "/supervisor/ver_opiniones", icon: <FaFileInvoice /> },
    { name: "Ver alertas", path: "/supervisor/alertas-supervisor", icon: <IoMdWarning /> },
    { name: "Panel de Soporte", path: "/supervisor/panel-soporte", icon: <FaChartBar /> },

  ],
  empleado: [
    { name: "Vender Artículos", path: "/empleado/vender-articulos", icon: <FaBox /> },
    { name: "Generar Facturas", path: "/empleado/generar_facturas", icon: <FaBox /> },
    { name: "Consultar Artículo", path: "/empleado/consultar-articulo", icon: <FaSearch /> },
    { name: "Ver Facturas", path: "/empleado/ver_facturas", icon: <FaFileInvoice /> },
    { name: "Tickets", path: "/empleado/ticket-empleado", icon: <FaTicketAlt /> },

  ],
  cliente: [
    { name: "Ver Libros", path: "/cliente/ver-libros", icon: <FaBook /> },
    { name: "Lista de Deseos", path: "/cliente/ver-lista-deseos", icon: <FaHeart /> },
    { name: "Buscar Libro", path: "/cliente/buscar-libro", icon: <FaSearch /> },
    { name: "Más Votados", path: "/cliente/ver-libros-mas-votados", icon: <FaStar /> },
    { name: "Realizar Compra", path: "/cliente/realizar-compra", icon: <FaCreditCard /> },
  ]
};

interface SidebarProps {
  rol: "gerente" | "supervisor" | "empleado" | "cliente";
}

const Sidebar: React.FC<SidebarProps> = ({ rol }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
      Object.keys(localStorage).forEach((key) => {
        if (key.toLowerCase().includes("token")) {
          localStorage.removeItem(key);
        }
      });
    navigate("/login");
  };

  return (
    <div className="w-64 h-screen bg-gray-800 text-white p-5">
      <h2 className="text-xl font-bold mb-4">Menú</h2>
      <ul>
        {menus[rol]?.map((item, index) => (
          <li key={index} className="mt-3 flex items-center">
            <Link to={item.path} className="flex items-center hover:text-blue-400">
              <span className="mr-3">{item.icon}</span>
              {item.name}
            </Link>
          </li>
        ))}
      </ul>
      <button
        onClick={handleLogout}
        className="mt-4 w-full py-2 bg-red-500 text-white rounded hover:bg-red-600"
      >
        Cerrar sesión
      </button>
    </div>
  );
};

export default Sidebar;

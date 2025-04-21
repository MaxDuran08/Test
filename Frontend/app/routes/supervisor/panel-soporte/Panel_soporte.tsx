import React, { useEffect, useState } from "react";
import { ver_Tickets_Soporte, asignar_Ticket, cancelar_Ticket, aceptar_Resolucion } from "./services/panel_soporte";
import Swal from "sweetalert2";

interface Ticket {
  id_ticket: number;
  cliente: string;
  estado: string;
  fecha_creacion: string;
  empleado_asignado: string | null;
  motivo: string;
}

const Panel_soporte = () => {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [filteredTickets, setFilteredTickets] = useState<Ticket[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const fetchTickets = async () => {
      try {
        const data = await ver_Tickets_Soporte();
        const mappedTickets = data.map((ticket: any) => ({
          id_ticket: ticket.idTicket,
          cliente: ticket.NombreCliente,
          estado: ticket.Estado,
          fecha_creacion: ticket.Fecha_creacion,
          empleado_asignado: ticket.EmpleadoAsignado ? ticket.EmpleadoAsignado.toString() : null,
          motivo: ticket.Descripcion
        }));

        setTickets(mappedTickets);
        setFilteredTickets(mappedTickets);
      } catch (err) {
        setError("Error al obtener los tickets de soporte.");
      } finally {
        setLoading(false);
      }
    };

    fetchTickets();
  }, []);

  useEffect(() => {
    if (searchTerm === "") {
      setFilteredTickets(tickets);
    } else {
      const filtered = tickets.filter((ticket) => {
        const clienteMatch = ticket.cliente.toLowerCase().includes(searchTerm.toLowerCase());
        const estadoMatch = ticket.estado.toLowerCase().includes(searchTerm.toLowerCase());
        return clienteMatch || estadoMatch;
      });
      setFilteredTickets(filtered);
    }
  }, [searchTerm, tickets]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const handleAsignarTicketGeneral = async () => {
    const supervisorCui = localStorage.getItem("cui");

    if (!supervisorCui) {
      Swal.fire('Error', 'No se encontró el CUI del supervisor.', 'error');
      return;
    }

    const { value: formValues } = await Swal.fire({
      title: 'Asignar Ticket',
      html: ` 
        <input id="ticket_id" type="number" class="swal2-input" placeholder="ID del Ticket">
        <input id="empleado_cui" type="number" class="swal2-input" placeholder="CUI del Empleado">
      `,
      focusConfirm: false,
      preConfirm: () => {
        const ticketId = (document.getElementById('ticket_id') as HTMLInputElement).value;
        const empleadoCui = (document.getElementById('empleado_cui') as HTMLInputElement).value;
        if (!ticketId || !empleadoCui) {
          Swal.showValidationMessage('Debe ingresar ambos campos');
        }
        return { ticketId: Number(ticketId), empleadoCui: Number(empleadoCui) };
      },
      showCancelButton: true
    });

    if (formValues) {
      try {
        await asignar_Ticket(formValues.ticketId, formValues.empleadoCui, Number(supervisorCui));
        Swal.fire('Éxito', 'Ticket asignado correctamente', 'success');
      } catch (error) {
        Swal.fire('Error', 'No se pudo asignar el ticket', 'error');
      }
    }
  };

  const handleCancelar = async (idTicket: number) => {
    const supervisorCui = localStorage.getItem("cui");
  
    if (!supervisorCui) {
      Swal.fire('Error', 'No se encontró el CUI del supervisor.', 'error');
      return;
    }
  
    const { value } = await Swal.fire<string>({
      title: 'Cancelar Ticket',
      input: 'text',
      inputLabel: 'Razón de la cancelación',
      inputPlaceholder: 'Ingrese una razón',
      showCancelButton: true,
    });
  
    if (value !== undefined && value.trim() !== "") {
      try {
        const razonString = String(value);
        await cancelar_Ticket(idTicket, razonString, Number(supervisorCui));
        Swal.fire('Éxito', 'Ticket cancelado correctamente', 'success');
      } catch (error) {
        Swal.fire('Error', 'No se pudo cancelar el ticket', 'error');
      }
    } else {
      Swal.fire('Cancelado', 'Debe ingresar una razón válida.', 'info');
    }
  };

  const handleAceptarResolucion = async (idTicket: number) => {
    const supervisorCui = localStorage.getItem("cui");

    if (!supervisorCui) {
      Swal.fire('Error', 'No se encontró el CUI del supervisor.', 'error');
      return;
    }

    try {
      await aceptar_Resolucion(idTicket, Number(supervisorCui));
      Swal.fire('Éxito', 'Resolución aceptada', 'success');
    } catch (error) {
      Swal.fire('Error', 'No se pudo aceptar la resolución', 'error');
    }
  };

  if (loading) return <p className="text-center text-white">Cargando tickets...</p>;
  if (error) return <p className="text-center text-red-500">{error}</p>;

  return (
    <div className="max-w-6xl mx-auto p-6">
      <h2 className="text-2xl font-bold text-white text-center mb-6">🎫 Tickets de Soporte</h2>

      {/* Barra superior: buscar y asignar */}
      <div className="flex flex-col md:flex-row items-center justify-between mb-6 gap-4">
        <input
          type="text"
          placeholder="Buscar por cliente o estado"
          value={searchTerm}
          onChange={handleSearchChange}
          className="w-full md:w-2/3 p-3 bg-gray-700 text-white rounded-lg focus:outline-none"
        />
        <button
          onClick={handleAsignarTicketGeneral}
          className="px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
        >
          ➕ Asignar Ticket
        </button>
      </div>

      {/* Contenedor de tarjetas */}
      <div className="overflow-y-auto max-h-[80vh]">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 justify-center">
          {filteredTickets.length > 0 ? (
            filteredTickets.map((ticket) => (
              <div
                key={ticket.id_ticket}
                className="bg-gray-800 text-white p-6 rounded-2xl shadow-lg transform hover:scale-105 transition duration-300"
              >
                <h3 className="text-2xl font-semibold text-center">🎫 Ticket #{ticket.id_ticket}</h3>
                <p className="text-center text-gray-400">📅 {new Date(ticket.fecha_creacion).toLocaleDateString()}</p>
                <hr className="border-white-600 my-3" />
                <p><strong>🧑 Cliente:</strong> {ticket.cliente}</p>
                <p><strong>🏠 Empleado Asignado:</strong> {ticket.empleado_asignado || "No asignado"}</p>
                <p><strong>📄 Motivo:</strong> {ticket.motivo}</p>
                <p><strong>🔖 Estado:</strong> {ticket.estado}</p>

                {/* Botones específicos */}
                <div className="mt-4 flex flex-col gap-2">
                  {/* Solo se puede cancelar si el estado es 'Pendiente' */}
                  <button
                    onClick={() => handleCancelar(ticket.id_ticket)}
                    disabled={ticket.estado !== "En proceso" && ticket.estado !== "Pendiente"}
                    className={`w-full px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition ${ticket.estado !== "Pendiente" && ticket.estado !== "En proceso" ? "opacity-50 cursor-not-allowed" : ""}`}
                  >
                    Cancelar
                  </button>

                  {/* Solo se puede aceptar resolución si el estado es 'Pendiente' */}
                  <button
                    onClick={() => handleAceptarResolucion(ticket.id_ticket)}
                    disabled={ticket.estado !== "En proceso" && ticket.estado === "Pendiente"}
                    className={`w-full px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition ${ticket.estado !== "Pendiente" && ticket.estado !== "En proceso" ? "opacity-50 cursor-not-allowed" : ""}`}
                  >
                    Aceptar Resolución
                  </button>
                </div>
              </div>
            ))
          ) : (
            <p className="text-gray-400 text-center col-span-full">No hay tickets disponibles.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Panel_soporte;
import { useEffect, useState, useRef } from "react";
import { 
  obtenerIdUsuario, 
  obtenerTicketsEmpleado, 
  obtenerConversacionTicket,
  conversacionTicket,
  aprobacion_ticket
} from "./services/services_ticket_empleado";

const Ejemplo = () => {
  const [empleadoCui, setEmpleadoCui] = useState(null);
  const [tickets, setTickets] = useState([]);
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [nuevoMensaje, setNuevoMensaje] = useState("");
  const [errorEnvio, setErrorEnvio] = useState(null);
  const [loading, setLoading] = useState(false);
  
  const mensajesRef = useRef(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const id = await obtenerIdUsuario();
        setEmpleadoCui(id);
      } catch (error) {
        console.error("Error al obtener el CUI:", error);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    if (empleadoCui) {
      const fetchTickets = async () => {
        try {
          setLoading(true);
          const ticketsData = await obtenerTicketsEmpleado(empleadoCui);
          setTickets(ticketsData);
        } catch (error) {
          console.error("Error cargando tickets:", error);
        } finally {
          setLoading(false);
        }
      };
      fetchTickets();
    }
  }, [empleadoCui]);

  const openModal = async (ticket) => {
    try {
      setLoading(true);
      const mensajes = await obtenerConversacionTicket(ticket.idTicket);
      const mensajesOrdenados = mensajes.sort((a, b) => 
        new Date(a.FechaMensaje) - new Date(b.FechaMensaje)
      );
      setSelectedTicket({ ...ticket, Mensajes: mensajesOrdenados });
      setTimeout(scrollToBottom, 0);
    } catch (error) {
      console.error("Error cargando conversación:", error);
    } finally {
      setLoading(false);
    }
  };

  const closeModal = () => {
    setSelectedTicket(null);
    setNuevoMensaje("");
    setErrorEnvio(null);
  };

  const scrollToBottom = () => {
    if (mensajesRef.current) {
      mensajesRef.current.scrollTop = mensajesRef.current.scrollHeight;
    }
  };

  useEffect(() => {
    if (selectedTicket) {
      scrollToBottom();
    }
  }, [selectedTicket]);

  const enviarMensaje = async () => {
    if (!nuevoMensaje.trim()) {
      setErrorEnvio("El mensaje no puede estar vacío");
      return;
    }
    
    let tempMensaje;
    
    try {
      setErrorEnvio(null);
      
      tempMensaje = {
        idMensaje: Date.now(),
        Remitente: "Empleado",
        Empleado_CUI: empleadoCui,
        Mensaje: nuevoMensaje,
        FechaMensaje: new Date().toLocaleString('en-US', {
          year: 'numeric',
          month: '2-digit',
          day: '2-digit',
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
          hour12: false,
          timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone
        })
      };
      
      setSelectedTicket(prev => ({
        ...prev,
        Mensajes: [...prev.Mensajes, tempMensaje]
      }));
      
      await conversacionTicket(
        selectedTicket.idTicket, 
        empleadoCui, 
        nuevoMensaje
      );
      
      const mensajesActualizados = await obtenerConversacionTicket(selectedTicket.idTicket);
      const mensajesOrdenados = mensajesActualizados.sort((a, b) => 
        new Date(a.FechaMensaje) - new Date(b.FechaMensaje)
      );
      setSelectedTicket(prev => ({ ...prev, Mensajes: mensajesOrdenados }));
      
      setNuevoMensaje("");
      scrollToBottom();
      
    } catch (error) {
      console.error("Error enviando mensaje:", error);
      setErrorEnvio(error.message || "Error al enviar el mensaje");
      
      if (tempMensaje) {
        setSelectedTicket(prev => ({
          ...prev,
          Mensajes: prev.Mensajes.filter(m => m.idMensaje !== tempMensaje.idMensaje)
        }));
      }
    }
  };

  const handleAprobacion = async (ticketId) => {
    try {
      setLoading(true);
      await aprobacion_ticket(ticketId);
      // Actualizar el estado del ticket en la lista
      setTickets(prevTickets => 
        prevTickets.map(ticket => 
          ticket.idTicket === ticketId 
            ? { ...ticket, Estado: 'En proceso...' }
            : ticket
        )
      );
      if (selectedTicket && selectedTicket.idTicket === ticketId) {
        setSelectedTicket(prev => ({ ...prev, Estado: 'En proceso...' }));
      }
      alert('Ticket aprobado exitosamente');
    } catch (error) {
      console.error("Error al aprobar ticket:", error);
      setErrorEnvio(error.message || "Error al aprobar el ticket");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 p-6">
      <h1 className="text-3xl font-bold mb-8">Tickets Asignados</h1>
      
      {loading && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      )}

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {tickets.map((ticket) => (
          <div 
            key={ticket.idTicket}
            className="bg-gray-800 rounded-lg p-6 shadow-xl hover:shadow-2xl transition-shadow"
          >
            <h2 className="text-xl font-semibold mb-2 text-blue-400">{ticket.Asunto}</h2>
            <p className="text-gray-300 mb-4">{ticket.Descripcion}</p>
            
            <div className="flex flex-wrap gap-2 mb-4">
              <span className={`px-3 py-1 rounded-full text-sm ${
                ticket.Estado === 'Pendiente' ? 'bg-red-600 text-red-100' 
                : ticket.Estado === 'En proceso' ? 'bg-green-600 text-green-100'
                : 'bg-blue-600 text-blue-100'
              }`}>
                {ticket.Estado}
              </span>
              <span className="bg-gray-700 px-3 py-1 rounded-full text-sm">
                {new Date(ticket.Fecha_creacion).toLocaleDateString()}
              </span>
            </div>
            
            <div className="flex gap-2">
              <button
                onClick={() => openModal(ticket)}
                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-colors"
              >
                Ver Conversación
              </button>
              {(ticket.Estado === 'Pendiente' || ticket.Estado === 'En proceso') && (
                <button
                  onClick={() => handleAprobacion(ticket.idTicket)}
                  className="flex-1 bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-4 rounded-lg transition-colors"
                >
                  Realizar Aprobación
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {!loading && tickets.length === 0 && (
        <div className="text-center py-12">
          <p className="text-xl text-gray-400">No hay tickets asignados</p>
        </div>
      )}

      {selectedTicket && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center p-4">
          <div className="bg-gray-800 rounded-xl w-full max-w-2xl flex flex-col max-h-[90vh]">
            <div className="p-6 border-b border-gray-700 flex justify-between items-center">
              <h2 className="text-2xl font-bold">
                {selectedTicket.Asunto}
              </h2>
              <button
                onClick={closeModal}
                className="text-gray-400 hover:text-white transition-colors"
              >
                ✕
              </button>
            </div>

            <div
              ref={mensajesRef}
              className="flex-1 overflow-y-auto p-6 flex flex-col"
              style={{ scrollBehavior: 'smooth' }}
            >
              <div className="space-y-4 flex-1">
                {selectedTicket.Mensajes.map((mensaje) => (
                  <div
                    key={mensaje.idMensaje}
                    className={`flex ${mensaje.Remitente === 'Empleado' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-[70%] rounded-lg p-4 ${
                        mensaje.Remitente === 'Empleado'
                          ? 'bg-blue-600 text-white'
                          : 'bg-gray-700 text-gray-100'
                      }`}
                    >
                      <div className="flex items-center gap-2 mb-2">
                        <span className="font-medium">{mensaje.Remitente}</span>
                        <span className="text-xs opacity-75">
                          {new Date(mensaje.FechaMensaje).toLocaleTimeString('es-US', {
                            hour: '2-digit',
                            minute: '2-digit',
                            hour12: true,
                            timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone
                          })}
                        </span>
                      </div>
                      <p className="break-words">{mensaje.Mensaje}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="p-6 border-t border-gray-700">
              {errorEnvio && (
                <div className="text-red-400 text-sm mb-2">{errorEnvio}</div>
              )}
              
              <div className="flex gap-4">
                <input
                  type="text"
                  value={nuevoMensaje}
                  onChange={(e) => {
                    setNuevoMensaje(e.target.value);
                    setErrorEnvio(null);
                  }}
                  onKeyPress={(e) => e.key === 'Enter' && enviarMensaje()}
                  placeholder="Escribe un mensaje..."
                  className="flex-1 bg-gray-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button
                  onClick={enviarMensaje}
                  disabled={!nuevoMensaje.trim()}
                  className="bg-blue-600 hover:bg-blue-700 px-6 py-2 rounded-lg font-medium disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  Enviar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Ejemplo;
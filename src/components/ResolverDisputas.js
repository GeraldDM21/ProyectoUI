import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css'; 
import React, { useState, useEffect } from 'react';
import { FaCheckCircle, FaGavel } from 'react-icons/fa';
import Swal from 'sweetalert2';
import '../Styles/ResolverDisputas.css';
import HeaderJuez from './HeaderJuez'; 

function ResolverDisputas() {
    const [disputas, setDisputas] = useState([]);
    const [filteredDisputas, setFilteredDisputas] = useState([]); // Disputas filtradas
    const [filtro, setFiltro] = useState(''); // Texto del filtro
    const [error, setError] = useState('');
    const [detailsVisible, setDetailsVisible] = useState({});
    const [multaDetails, setMultaDetails] = useState({});
    const [officialDetails, setOfficialDetails] = useState({});
    const [infracciones, setInfracciones] = useState([]);
    const userId = localStorage.getItem('userId');

    useEffect(() => {
        fetchDisputas();
        fetchInfracciones();
    }, [userId]);

    const fetchDisputas = async () => {
        try {
            const response = await fetch(`https://localhost:7201/api/Disputas/IdJuez/${userId}/NotResolved`);
            if (!response.ok) throw new Error('No se pudo cargar la lista de disputas.');
            
            const data = await response.json();
            setDisputas(data);
            setFilteredDisputas(data); // Inicialmente, mostrar todas las disputas
        } catch (err) {
            console.error("Error al cargar disputas:", err);
            toast.error('No se pudieron cargar las disputas.');
        }
    };

    const fetchInfracciones = async () => {
        try {
            const response = await fetch('https://localhost:7201/api/CatalogoInfracciones');
            if (!response.ok) {
                throw new Error('Error al cargar las infracciones');
            }
            const data = await response.json();
            setInfracciones(data);
        } catch (error) {
            console.error('Error al cargar infracciones:', error);
        }
    };

    const fetchMultaDetails = async (idMulta) => {
        try {
            const response = await fetch(`https://localhost:7201/api/Multas/${idMulta}`);
            if (!response.ok) throw new Error('No se pudo cargar los detalles de la multa.');
            
            const data = await response.json();
            setMultaDetails((prevDetails) => ({
                ...prevDetails,
                [idMulta]: data
            }));
            fetchOfficialDetails(data.idOficial);
        } catch (error) {
            console.error('Error fetching multa details:', error);
        }
    };

    const fetchOfficialDetails = async (idOficial) => {
        try {
            const response = await fetch(`https://localhost:7201/api/Usuarios/${idOficial}`);
            if (!response.ok) throw new Error('No se pudo cargar los detalles del oficial.');
            
            const data = await response.json();
            setOfficialDetails((prevDetails) => ({
                ...prevDetails,
                [idOficial]: data
            }));
        } catch (error) {
            console.error('Error fetching official details:', error);
        }
    };

    const handleVerDetallesClick = (idMulta) => {
        setDetailsVisible((prevVisible) => ({
            ...prevVisible,
            [idMulta]: !prevVisible[idMulta]
        }));
        if (!detailsVisible[idMulta]) {
            fetchMultaDetails(idMulta);
        }
    };

    const notificacionCambioDeEstado = async (idUsuario, disputaID) => {
        const notificacionUsuarioFinal = await fetch('https://localhost:7201/api/Notificaciones', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                titulo: `Cambio de estado de disputa.`,
                descripcion: `Ha habido un cambio de estado de la disputa ${disputaID}.`,
                fecha: new Date().toISOString(),
                leido: false,
                idUsuario: idUsuario
            }),
        });

        if (notificacionUsuarioFinal.ok) {
            console.log('Notificación creada exitosamente.');
        } else {
            console.error('Error al crear la notificación.');
        }
    }

    const notificacionNecesitaDeclaracion = async (idUsuario, disputaID) => {
        const notificacionUsuarioFinal = await fetch('https://localhost:7201/api/Notificaciones', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                titulo: `Necesita declaración para disputa.`,
                descripcion: `Se necesita una declaración para la disputa ${disputaID}.`,
                fecha: new Date().toISOString(),
                leido: false,
                idUsuario: idUsuario
            }),
        });

        if (notificacionUsuarioFinal.ok) {
            console.log('Notificación creada exitosamente.');
        }
        else {
            console.error('Error al crear la notificación.');
        }
    }

    const handleUpdateDisputa = async (disputa, estado, necesitaDeclaracion, resolucion) => {
        const { id, razon, descripcion, fecha, declaracion, idMulta, idUsuarioFinal, idOficial, idJuez } = disputa;
        const disputaData = {
            id, 
            razon, 
            descripcion, 
            fecha,
            estado,
            resolucion,
            necesitaDeclaracion,
            declaracion,
            idMulta,
            idUsuarioFinal,
            idOficial,
            idJuez,
        };

        try {
            const response = await fetch(`https://localhost:7201/api/Disputas/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(disputaData),
            });

            if (response.ok) {

                notificacionCambioDeEstado(idUsuarioFinal, disputaData.id);
                notificacionCambioDeEstado(idJuez, disputaData.id);
                
               // alert("¡Disputa actualizada con éxito!");
                toast.success('¡Disputa actualizada con éxito!');
                setDisputas(disputas.map(d => 
                    d.id === id ? { ...d, estado, resolucion } : d
                ));
              
                setSelectedDisputa(null);
                setNewStatus('');

                if (resolucion === 'Anulación de Multa') {
                    const multaResponse = await fetch(`https://localhost:7201/api/Multas/${idMulta}`);
                    if (!multaResponse.ok) throw new Error('No se pudo cargar los detalles de la multa.');

                    const multaData = await multaResponse.json();
                    multaData.resuelta = true;

                    const updateMultaResponse = await fetch(`https://localhost:7201/api/Multas/${idMulta}`, {
                        method: 'PUT',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify(multaData),
                    });

                    if (!updateMultaResponse.ok) throw new Error('No se pudo actualizar la multa.');
                }

            } else {
                toast.error('No se pudo actualizar el estado de la disputa.');
            }
        } catch (error) {
            console.error("Error al actualizar disputa:", error);
            toast.error('Error al actualizar el estado de la disputa.');
        }
    };

    const handleResolverClick = (disputa) => {
        Swal.fire({
            title: 'Resolver Disputa',
            html: `
                <select id="resolution-dropdown" class="swal2-select">
                    <option value="Pendiente" disabled selected>Pendiente</option>
                    <option value="Anulación de Multa">Anulación de Multa</option>
                    <option value="Multa Validada">Multa Validada</option>
                </select>
            `,
            showCancelButton: true,
            cancelButtonText: 'Cancelar',
            confirmButtonText: 'Resolver Disputa',
            customClass: {
                confirmButton: 'swal2-confirm-button',
            },
            preConfirm: () => {
                const resolution = Swal.getPopup().querySelector('#resolution-dropdown').value;
                return { resolution };
            }
        }).then((result) => {
            if (result.isConfirmed) {
                handleUpdateDisputa(disputa, 'Resuelta', disputa.necesitaDeclaracion, result.value.resolution);
            }
        });
    };

    // Filtrar disputas según el texto ingresado
    useEffect(() => {
        if (filtro.trim() === '') {
            setFilteredDisputas(disputas); // Mostrar todas las disputas si no hay filtro
        } else {
            setFilteredDisputas(
                disputas.filter((disputa) =>
                    `${disputa.razon} ${disputa.descripcion} ${disputa.estado} ${disputa.resolucion}`
                        .toLowerCase()
                        .includes(filtro.toLowerCase())
                )
            );
        }
    }, [filtro, disputas]);

    return (
        <div className="ver-disputas-background">
            <HeaderJuez />

            <div className="ver-disputas-container">
                <h2><FaGavel /> Lista de Disputas</h2>
                {error && <p className="error-message">{error}</p>}

                {/* Barra de búsqueda */}
                <input
                    type="text"
                    placeholder="Buscar por razón, descripción, estado o resolución..."
                    value={filtro}
                    onChange={(e) => setFiltro(e.target.value)}
                    className="filtro-input"
                />

                <table className="ver-disputas-table">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Razón</th>
                            <th>Descripción</th>
                            <th>Fecha</th>
                            <th>Estado</th>
                            <th>Resolución</th>
                            <th>Detalles de Multa</th>
                            <th>Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredDisputas.length > 0 ? (
                            filteredDisputas.map((disputa) => (
                                <React.Fragment key={disputa.id}>
                                    <tr>
                                        <td>{disputa.id}</td>
                                        <td>{disputa.razon}</td>
                                        <td>{disputa.descripcion}</td>
                                        <td>{new Date(disputa.fecha).toLocaleDateString()}</td>
                                        <td>{disputa.estado}</td>
                                        <td>{disputa.resolucion}</td>
                                        <td>
                                            <button className='resolver-button' onClick={() => handleVerDetallesClick(disputa.idMulta)}>
                                                {detailsVisible[disputa.idMulta] ? 'Ocultar Detalles' : 'Ver Detalles'}
                                            </button>
                                        </td>
                                        <td>
                                            <button className="resolver-button" onClick={() => {
                                                handleUpdateDisputa(disputa, 'Esperando Declaración del Oficial', true ,disputa.resolucion);
                                                notificacionNecesitaDeclaracion(disputa.idOficial, disputa.id);
                                            }}>
                                                Solicitar Declaración
                                            </button>
                                            <button className="resolver-button" onClick={() => handleResolverClick(disputa)}>
                                                Resolver
                                            </button>
                                        </td>
                                    </tr>
                                    {detailsVisible[disputa.idMulta] && multaDetails[disputa.idMulta] && (
                                        <tr className="multa-details-row">
                                            <td colSpan="7">
                                                {/* Detalles de la multa */}
                                            </td>
                                        </tr>
                                    )}
                                </React.Fragment>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="7" className="no-data">No se encontraron disputas.</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
            <ToastContainer />
        </div>
    );
}

export default ResolverDisputas;

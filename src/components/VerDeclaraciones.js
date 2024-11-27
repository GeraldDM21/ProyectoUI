import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css'; 
import React, { useState, useEffect } from 'react';
import { FaExclamationTriangle } from 'react-icons/fa';
import './VerDeclaraciones.css';
import HeaderOficial from './HeaderOficial'; // Importa el Header del Oficial

function VerDeclaraciones() {
    const [disputas, setDisputas] = useState([]);
    const [filteredDisputas, setFilteredDisputas] = useState([]); // Disputas filtradas
    const [filtro, setFiltro] = useState(''); // Texto del filtro
    const [declaraciones, setDeclaraciones] = useState({});
    const [error, setError] = useState('');
    const [expandedDisputaId, setExpandedDisputaId] = useState(null);
    const userId = localStorage.getItem('userId');

    useEffect(() => {
        fetchDisputas();
    }, []);

    const fetchDisputas = async () => {
        try {
            const response = await fetch(`https://localhost:7201/api/Disputas/IdOficial/${userId}/NeedsDeclaration`);
            if (!response.ok) throw new Error('No se pudo cargar la lista de disputas.');
            
            const data = await response.json();
            setDisputas(data);
            setFilteredDisputas(data); // Inicialmente todas las disputas están disponibles
        } catch (err) {
            console.error("Error al cargar disputas:", err);
            toast.error('No se pudieron cargar las disputas.');
        }
    };

    // Filtrar disputas según el texto ingresado
    useEffect(() => {
        if (filtro.trim() === '') {
            setFilteredDisputas(disputas); // Si no hay filtro, mostrar todas las disputas
        } else {
            setFilteredDisputas(
                disputas.filter((disputa) => (
                    `${disputa.razon} ${disputa.descripcion} ${disputa.estado} ${disputa.resolucion}`
                        .toLowerCase()
                        .includes(filtro.toLowerCase())
                ))
            );
        }
    }, [filtro, disputas]);

    const toggleExpandDisputa = (id) => {
        setExpandedDisputaId(expandedDisputaId === id ? null : id);
    };

    const notificacionCambioDeEstado = async (idUsuario, disputaID) => {
        const notificacionUsuarioFinal = await fetch('https://localhost:7201/api/Notificaciones', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                titulo: `Oficial ha actualizado una disputa`,
                descripcion: `El oficial ha actualizado la disputa ${disputaID}.`,
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

    const handleEnviarDeclaracion = async (idDisputa) => {
        try {
            const declaracion = declaraciones[idDisputa] || '';
            const disputa = disputas.find(d => d.id === idDisputa);
            const updatedDisputa = { ...disputa, declaracion, estado: 'Declaración Recibida', necesitaDeclaracion: false };

            const response = await fetch(`https://localhost:7201/api/Disputas/${idDisputa}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(updatedDisputa),
            });

            if (response.ok) {
                notificacionCambioDeEstado(disputa.idUsuarioFinal, disputa.id);
                notificacionCambioDeEstado(disputa.idJuez, disputa.id);

               // alert('Declaración enviada con éxito.');
                toast.success('Declaración enviada con éxito.');
                setDisputas(disputas.map(d => d.id === idDisputa ? updatedDisputa : d));
                setFilteredDisputas(filteredDisputas.map(d => d.id === idDisputa ? updatedDisputa : d)); // Actualizar las disputas filtradas
                setDeclaraciones((prev) => ({ ...prev, [idDisputa]: '' }));
            } else {
                throw new Error('No se pudo actualizar la disputa.');
            }
        } catch (err) {
            console.error("Error al enviar declaración:", err);
            toast.error('No se pudo enviar la declaración.');
        }
    };

    const handleChangeDeclaracion = (idDisputa, value) => {
        setDeclaraciones((prev) => ({ ...prev, [idDisputa]: value }));
    };

    return (
        <div className="ver-declaraciones-background">
            <HeaderOficial />
            <div className="shape-background"></div>
            <div className="ver-declaraciones-container">
                <h2><FaExclamationTriangle /> Disputas Pendientes por Declarar</h2>
                {error && <p className="error-message">{error}</p>}

                {/* Barra de búsqueda */}
                <input
                    type="text"
                    placeholder="Buscar por razón, descripción, estado o resolución..."
                    value={filtro}
                    onChange={(e) => setFiltro(e.target.value)}
                    className="filtro-input"
                />

                <table className="ver-declaraciones-table">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Razón</th>
                            <th>Descripción</th>
                            <th>Estado</th>
                            <th>Resolución</th>
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
                                        <td>{disputa.estado}</td>
                                        <td>{disputa.resolucion}</td>
                                        <td>
                                            <button
                                                className="resolver-button"
                                                onClick={() => toggleExpandDisputa(disputa.id)}
                                            >
                                                Declarar
                                            </button>
                                        </td>
                                    </tr>
                                    {expandedDisputaId === disputa.id && (
                                        <tr className="declaracion-row">
                                            <td colSpan="6">
                                                <textarea
                                                    value={declaraciones[disputa.id] || ''}
                                                    onChange={(e) => handleChangeDeclaracion(disputa.id, e.target.value)}
                                                    placeholder="Escriba su declaración aquí..."
                                                    className="declaracion-textarea"
                                                />
                                                <button
                                                    className="send-button"
                                                    onClick={() => handleEnviarDeclaracion(disputa.id)}
                                                >
                                                    Enviar
                                                </button>
                                            </td>
                                        </tr>
                                    )}
                                </React.Fragment>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="6" className="no-data">No hay disputas pendientes por declarar.</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
            <ToastContainer />
        </div>
    );
}

export default VerDeclaraciones;

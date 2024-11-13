import React, { useEffect, useState } from 'react';
import { FaDollarSign, FaExclamationCircle } from 'react-icons/fa';
import '../Styles/VerMultas.css';
import { useNavigate } from 'react-router-dom';
import HeaderUsuario from './HeaderUsuario'; // Importamos HeaderUsuario

function VerMultas() {
    const [multas, setMultas] = useState([]);
    const [disputas, setDisputas] = useState([]);
    const [infracciones, setInfracciones] = useState({});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [infracciones, setInfracciones] = useState([]);
    const [pastMultas, setPastMultas] = useState([]);
    const userId = localStorage.getItem('userId');
    const navigate = useNavigate();

    useEffect(() => {
        fetchMultas();
        fetchInfracciones();
        fetchDisputas();
        fetchPastMultas();
    }, []);

    const fetchMultas = async () => {
        try {
            const response = await fetch(`https://localhost:7201/api/Multas/IdInfractor/${userId}/NotResolved`); // Reemplaza con la URL correcta de tu API
            if (!response.ok) {
                throw new Error('Error al cargar las multas');
            }
            const data = await response.json();
            setMultas(data);
        } catch (error) {
            setError('Error al cargar multas.');
            console.error(error);
        }
    };

    const fetchInfracciones = async () => {
        try {
            const response = await fetch('https://localhost:7201/api/CatalogoInfracciones');
            if (!response.ok) throw new Error('Error al cargar infracciones');
            const data = await response.json();
            const infraccionesMap = data.reduce((map, infraccion) => {
                map[infraccion.id] = infraccion.nombre;
                return map;
            }, {});
            setInfracciones(infraccionesMap);
        } catch (error) {
            setError('Error al cargar infracciones.');
            console.error(error);
        }
    };

    const fetchDisputas = async () => {
        try {
            const response = await fetch(`https://localhost:7201/api/Disputas/IdInfractor/${userId}`);
            if (!response.ok) throw new Error('Error al cargar disputas');
            const data = await response.json();
            setDisputas(data);
        } catch (error) {
            console.error('Error al cargar disputas:', error);
        }
    };

    // Función para obtener las multas pasadas desde el backend
    const fetchPastMultas = async () => {
        try {
            const response = await fetch(`https://localhost:7201/api/Multas/IdInfractor/${userId}/Resolved`);
            if (!response.ok) {
                throw new Error('Error al cargar las multas pasadas');
            }
            const data = await response.json();
            setPastMultas(data);
        } catch (error) {
            console.error('Error al cargar multas pasadas:', error);
        }
    };

    // Función para manejar el pago de una multa
    const handlePago = (id) => {
        alert(`Procesando pago para la multa con ID: ${id}`);
        // Aquí agregarías la lógica real para procesar el pago
    };

    const handleDisputa = (multa) => {
        const existingDisputa = disputas.find(disputa => disputa.idMulta === multa.id);
        if (existingDisputa) {
            alert('Ya existe una disputa para esta multa.');
        } else {
            navigate('/iniciar-disputa', { state: { multa } });
        }
    };

    if (loading) return <p>Cargando multas...</p>;
    if (error) return <p className="error-message">{error}</p>;

    return (
        <div className="ver-multas-page">
            {/* Aquí colocamos el HeaderUsuario */}
            <HeaderUsuario />

            <div className="ver-multas-container">
                <h2><FaExclamationCircle /> Mis Multas Pendientes</h2>
                {error && <p className="error-message">{error}</p>}
                <table className="multas-table">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Cédula</th>
                            <th>Nombre</th>
                            <th>Apellido</th>
                            <th>Fecha</th>
                            <th>Placas</th>
                            <th>Infracciones</th>
                            <th>Monto Total</th>
                            <th>Pagada</th>
                            <th>Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {multas.length > 0 ? (
                            multas.map((multa) => (
                                <tr key={multa.id}>
                                    <td>{multa.id}</td>
                                    <td>{multa.cedulaInfractor}</td>
                                    <td>{multa.nombreInfractor}</td>
                                    <td>{multa.apellidoInfractor}</td>
                                    <td>{new Date(multa.fecha).toLocaleDateString()}</td>
                                    <td>{multa.multaPlacas.map(placa => placa.placasId).join(', ')}</td>
                                    <td>
                                        {multa.infraccionMultas.map((infraccion, index) => (
                                            <span key={index}>
                                                {infracciones[infraccion.catalogoInfraccionesId] || infraccion.catalogoInfraccionesId}
                                                <br />
                                            </span>
                                        ))}
                                    </td>
                                    <td>{`₡${(multa.total ?? 0).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}</td>
                                    <td>{multa.pagada ? 'Sí' : 'No'}</td>
                                    <td className="action-buttons">
                                        <button
                                            className="pay-button"
                                            onClick={() => handlePago(multa.id)}
                                            title="Pagar"
                                        >
                                            <FaDollarSign />
                                        </button>
                                        <button
                                            className="dispute-button"
                                            onClick={() => handleDisputa(multa)}
                                            title="Disputar"
                                        >
                                            <FaExclamationCircle />
                                        </button>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="10">No hay multas disponibles</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            <div className="ver-multas-container">
                <h2><FaDollarSign /> Mis Multas Pasadas</h2>
                <table className="multas-table">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Cédula</th>
                            <th>Nombre</th>
                            <th>Apellido</th>
                            <th>Fecha</th>
                            <th>Placas</th>
                            <th>Infracciones</th>
                            <th>Monto Total</th>
                            <th>Pagada</th>
                        </tr>
                    </thead>
                    <tbody>
                        {pastMultas.length > 0 ? (
                            pastMultas.map((multa) => (
                                <tr key={multa.id}>
                                    <td>{multa.id}</td>
                                    <td>{multa.cedulaInfractor}</td>
                                    <td>{multa.nombreInfractor}</td>
                                    <td>{multa.apellidoInfractor}</td>
                                    <td>{new Date(multa.fecha).toLocaleDateString()}</td>
                                    <td>{multa.multaPlacas.map(placa => placa.placasId).join(', ')}</td>
                                    <td>
                                        {multa.infraccionMultas.map(infraccion => {
                                            const infraccionDetail = infracciones.find(i => i.id === infraccion.catalogoInfraccionesId);
                                            return infraccionDetail ? infraccionDetail.nombre : infraccion.catalogoInfraccionesId;
                                        }).map((nombre, index) => (
                                            <span key={index}>
                                                {nombre}
                                                <br />
                                            </span>
                                        ))}
                                    </td>
                                    <td>{`₡${(multa.total ?? 0).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}</td>
                                    <td>{multa.pagada ? 'Sí' : 'No'}</td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="9">No hay multas pasadas disponibles</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export default VerMultas;
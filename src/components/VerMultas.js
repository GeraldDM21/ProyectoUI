import React, { useEffect, useState } from 'react';
import { FaDollarSign, FaExclamationCircle } from 'react-icons/fa';
import '../Styles/VerMultas.css';
import { useNavigate } from 'react-router-dom';

function VerMultas() {
    const [multas, setMultas] = useState([]);
    const [disputas, setDisputas] = useState([]);
    const [infracciones, setInfracciones] = useState({});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const userId = localStorage.getItem('userId');
    const navigate = useNavigate();

    useEffect(() => {
        const fetchData = async () => {
            try {
                await Promise.all([fetchMultas(), fetchInfracciones(), fetchDisputas()]);
                setLoading(false);
            } catch (error) {
                setError('No se pudo cargar la información.');
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    const fetchMultas = async () => {
        try {
            const response = await fetch(`https://localhost:7201/api/Multas/IdInfractor/${userId}`);
            if (!response.ok) throw new Error('Error al cargar multas');
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
            <div className="ver-multas-container">
                <h2><FaExclamationCircle /> Mis Multas</h2>
                <table className="multas-table">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Cédula</th>
                            <th>Nombre</th>
                            <th>Apellido</th>
                            <th>Fecha</th>
                            <th>Pagada</th>
                            <th>Placas</th>
                            <th>Infracciones</th>
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
                                    <td>{multa.pagada ? 'Sí' : 'No'}</td>
                                    <td>{multa.multaPlacas.map(placa => placa.placasId).join(', ')}</td>
                                    <td>
                                        {multa.infraccionMultas.map((infraccion, index) => (
                                            <span key={index}>
                                                {infracciones[infraccion.catalogoInfraccionesId] || infraccion.catalogoInfraccionesId}
                                                <br />
                                            </span>
                                        ))}
                                    </td>
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
                                <td colSpan="9">No hay multas disponibles</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export default VerMultas;

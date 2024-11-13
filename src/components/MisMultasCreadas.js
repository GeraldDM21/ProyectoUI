import React, { useEffect, useState } from 'react';
import { FaDollarSign, FaExclamationCircle } from 'react-icons/fa';
import '../Styles/MisMultasCreadas.css';
import { useNavigate } from 'react-router-dom';

function MisMultasCreadas() {
    const [multas, setMultas] = useState([]);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(true);
    const oficialId = localStorage.getItem('oficialId'); // Obtén el ID del oficial autenticado
    const navigate = useNavigate();

    useEffect(() => {
        const fetchMultasCreadas = async () => {
            try {
                const response = await fetch(`https://localhost:7201/api/Multas/IdOficial/${oficialId}`);
                if (!response.ok) throw new Error('Error al cargar las multas');
                const data = await response.json();
                setMultas(data);
                setLoading(false);
            } catch (error) {
                setError('No se pudo cargar las multas creadas.');
                setLoading(false);
            }
        };
        fetchMultasCreadas();
    }, [oficialId]);

    const handlePago = (id) => {
        alert(`Pagar multa con ID: ${id}`);
    };

    const handleDisputa = (multa) => {
        navigate('/iniciar-disputa', { state: { multa } });
    };

    if (loading) return <p>Cargando multas creadas...</p>;

    return (
        <div className="mis-multas-creadas-page">
            <div className="mis-multas-creadas-container">
                <h2><FaExclamationCircle /> Mis Multas Creadas</h2>
                {error ? (
                    <p className="error-message">{error}</p>
                ) : (
                    <table className="multas-table">
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>CÉDULA</th>
                                <th>NOMBRE</th>
                                <th>APELLIDO</th>
                                <th>FECHA</th>
                                <th>PAGADA</th>
                                <th>PLACAS</th>
                                <th>INFRACCIONES</th>
                                <th>ACCIONES</th>
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
                                                    {infraccion.catalogoInfraccionesId}
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
                                    <td colSpan="9" className="no-data">No hay multas disponibles</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                )}
            </div>
        </div>
    );
}

export default MisMultasCreadas;

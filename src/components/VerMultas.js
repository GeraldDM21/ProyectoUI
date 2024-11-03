import React, { useEffect, useState } from 'react';
import { FaDollarSign, FaExclamationCircle } from 'react-icons/fa';
import '../Styles/VerMultas.css';

function VerMultas() {
    const [multas, setMultas] = useState([]);
    const [error, setError] = useState('');

    useEffect(() => {
        fetchMultas();
    }, []);

    // Función para obtener las multas desde el backend
    const fetchMultas = async () => {
        try {
            const response = await fetch('https://localhost:7201/api/multas'); // Reemplaza con la URL correcta de tu API
            if (!response.ok) {
                throw new Error('Error al cargar las multas');
            }
            const data = await response.json();
            setMultas(data);
        } catch (error) {
            console.error('Error al cargar multas:', error);
            setError('No se pudo cargar las multas.');
        }
    };

    // Función para manejar el pago de una multa
    const handlePago = (id) => {
        alert(`Pagar multa con ID: ${id}`);
        // Lógica real para procesar el pago
    };

    // Función para crear una disputa para una multa
    const handleDisputa = (id) => {
        alert(`Crear disputa para la multa con ID: ${id}`);
        // Lógica real para redireccionar a un formulario de disputa o llamada API
    };

    return (
        <div className="ver-multas-page">
            <div className="ver-multas-container">
                <h2><FaExclamationCircle /> Mis Multas</h2>
                {error && <p className="error-message">{error}</p>}
                <table className="multas-table">
                    <thead>
                        <tr>
                            <th>Infracción</th>
                            <th>Monto</th>
                            <th>Estado</th>
                            <th>Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {multas.length > 0 ? (
                            multas.map((multa) => (
                                <tr key={multa.id}>
                                    <td>{multa.infraccion}</td>
                                    <td>${multa.monto.toFixed(2)}</td>
                                    <td>{multa.estado}</td>
                                    <td className="action-buttons">
                                        <button className="pay-button" onClick={() => handlePago(multa.id)}>
                                            <FaDollarSign /> Pagar
                                        </button>
                                        <button className="dispute-button" onClick={() => handleDisputa(multa.id)}>
                                            <FaExclamationCircle /> Crear Disputa
                                        </button>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="4" className="no-data">No se encontraron multas.</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export default VerMultas;

import React, { useState, useEffect } from 'react';
import { FaExclamationTriangle, FaEye } from 'react-icons/fa';
import '../Styles/VerDisputas.css';

function VerDisputas() {
    const [disputas, setDisputas] = useState([]);
    const [error, setError] = useState('');

    // Obtiene las disputas desde el backend
    useEffect(() => {
        const fetchDisputas = async () => {
            try {
                const response = await fetch('https://localhost:7201/api/Disputas');
                if (!response.ok) throw new Error('No se pudo cargar la lista de disputas.');
                
                const data = await response.json();
                setDisputas(data);
            } catch (err) {
                console.error("Error al cargar disputas:", err);
                setError('No se pudieron cargar las disputas.');
            }
        };
        fetchDisputas();
    }, []);

    return (
        <div className="ver-disputas-background">
            <div className="shape-background"></div>
            <div className="ver-disputas-container">
                <h2><FaExclamationTriangle /> Lista de Disputas</h2>
                {error && <p className="error-message">{error}</p>}
                <table className="disputas-table">
                    <thead>
                        <tr>
                            <th>Razón</th>
                            <th>Descripción</th>
                            <th>Estado</th>
                            <th>Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {disputas.length > 0 ? (
                            disputas.map((disputa) => (
                                <tr key={disputa.id}>
                                    <td>{disputa.razon}</td>
                                    <td>{disputa.descripcion}</td>
                                    <td>{disputa.estado}</td>
                                    <td>
                                        <button className="view-button">
                                            <FaEye /> Ver Detalles
                                        </button>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="4" className="no-data">No se encontraron disputas.</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export default VerDisputas;

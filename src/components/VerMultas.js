import React, { useEffect, useState } from 'react';
import { FaFileAlt } from 'react-icons/fa';
import '../Styles/VerMultas.css';

function VerMultas() {
    const [multas, setMultas] = useState([]);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchMultas = async () => {
            try {
                const response = await fetch('https://localhost:7201/api/Multas');
                if (!response.ok) {
                    throw new Error("No se pudieron cargar las multas. Intente de nuevo más tarde.");
                }
                const data = await response.json();
                setMultas(data);
            } catch (error) {
                setError(error.message);
            }
        };
        fetchMultas();
    }, []);

    return (
        <div className="ver-multas-page">
            <div className="ver-multas-container">
                <h2>
                    <FaFileAlt /> Mis Multas
                </h2>
                {error && <p className="error-message">{error}</p>}
                {multas.length === 0 ? (
                    <p>No se encontraron multas.</p>
                ) : (
                    <table className="multas-table">
                        <thead>
                            <tr>
                                <th>Infracción</th>
                                <th>Monto</th>
                                <th>Fecha</th>
                            </tr>
                        </thead>
                        <tbody>
                            {multas.map((multa) => (
                                <tr key={multa.id}>
                                    <td>{multa.descripcion}</td>
                                    <td>{multa.monto}</td>
                                    <td>{new Date(multa.fecha).toLocaleDateString()}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>
        </div>
    );
}

export default VerMultas;

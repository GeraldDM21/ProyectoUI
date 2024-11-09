import React, { useState, useEffect } from 'react';
import { FaCheckCircle, FaTimesCircle, FaGavel } from 'react-icons/fa';
import '../Styles/ResolverDisputas.css';

function ResolverDisputas() {
    const [disputas, setDisputas] = useState([]);
    const [error, setError] = useState('');
    const [selectedDisputa, setSelectedDisputa] = useState(null);
    const [newStatus, setNewStatus] = useState('');
    const userId = localStorage.getItem('userId');


    // Obtiene las disputas desde el backend
    useEffect(() => {
        const fetchDisputas = async () => {
            try {
                const response = await fetch(`https://localhost:7201/api/Disputas/IdJuez/${userId}/NotResolved`);
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

    // Función para resolver o cambiar el estado de una disputa
    const handleUpdateDisputa = async (id) => {
        try {
            const response = await fetch(`https://localhost:7201/api/Disputas/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ estado: newStatus }),
            });

            if (response.ok) {
                setDisputas(disputas.map(disputa => 
                    disputa.id === id ? { ...disputa, estado: newStatus } : disputa
                ));
                setSelectedDisputa(null);
                setNewStatus('');
            } else {
                setError('No se pudo actualizar el estado de la disputa.');
            }
        } catch (error) {
            console.error("Error al actualizar disputa:", error);
            setError('Error al actualizar el estado de la disputa.');
        }
    };

    return (
        <div className="ver-disputas-background">
            <div className="shape-background"></div>
            <div className="ver-disputas-container">
                <h2><FaGavel /> Lista de Disputas</h2>
                {error && <p className="error-message">{error}</p>}
                <table className="ver-disputas-table">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Razón</th>
                            <th>Descripción</th>
                            <th>Estado</th>
                            <th>ID Multa</th>
                            <th>Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {disputas.length > 0 ? (
                            disputas.map((disputa) => (
                                <tr key={disputa.id}>
                                    <td>{disputa.id}</td>
                                    <td>{disputa.razon}</td>
                                    <td>{disputa.descripcion}</td>
                                    <td>{disputa.estado}</td>
                                    <td>{disputa.idMulta}</td>
                                    <td>
                                        <button className="resolve-button" onClick={() => setSelectedDisputa(disputa)}>
                                            <FaCheckCircle /> Resolver
                                        </button>
                                        <button className="reject-button" onClick={() => setNewStatus('Rechazada')}>
                                            <FaTimesCircle /> Rechazar
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
                
                {selectedDisputa && (
                    <div className="update-status-container">
                        <h3>Actualizar Estado de la Disputa</h3>
                        <p><strong>Razón:</strong> {selectedDisputa.razon}</p>
                        <p><strong>Descripción:</strong> {selectedDisputa.descripcion}</p>
                        <select value={newStatus} onChange={(e) => setNewStatus(e.target.value)}>
                            <option value="">Selecciona un nuevo estado</option>
                            <option value="Resuelta">Resuelta</option>
                            <option value="En Revisión">En Revisión</option>
                        </select>
                        <button onClick={() => handleUpdateDisputa(selectedDisputa.id)} className="btn-submit">Actualizar Estado</button>
                    </div>
                )}
            </div>
        </div>
    );
}

export default ResolverDisputas;

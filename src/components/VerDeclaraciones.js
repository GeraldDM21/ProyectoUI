import React, { useState, useEffect } from 'react';
import { FaExclamationTriangle, FaChevronDown, FaChevronUp } from 'react-icons/fa';
import './VerDeclaraciones.css';
import HeaderOficial from './HeaderOficial'; // Importa el Header del Oficial

function VerDeclaraciones() {
    const [disputas, setDisputas] = useState([]);
    const [declaraciones, setDeclaraciones] = useState({});
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [expandedDisputaId, setExpandedDisputaId] = useState(null);
    const userId = "12345"; // Puedes quemar un userId aquí para pruebas

    useEffect(() => {
        // Comentar o eliminar el fetch real para usar datos quemados
        /* const fetchDisputas = async () => {
            try {
                const response = await fetch(`https://localhost:7201/api/Disputas/IdOficial/${userId}/Pendientes`);
                if (!response.ok) throw new Error('No se pudo cargar la lista de disputas.');
                
                const data = await response.json();
                setDisputas(data);
            } catch (err) {
                console.error("Error al cargar disputas:", err);
                setError('No se pudieron cargar las disputas.');
            }
        };
        fetchDisputas(); */

        // Datos de prueba quemados
        setDisputas([
            { id: 1, razon: 'Exceso de velocidad', descripcion: 'Excedió el límite de velocidad en zona escolar.' },
            { id: 2, razon: 'Uso de celular', descripcion: 'Usó el celular mientras conducía.' },
            { id: 3, razon: 'Paso en rojo', descripcion: 'No respetó la luz roja del semáforo.' },
            { id: 4, razon: 'Estacionamiento prohibido', descripcion: 'Estacionó en lugar prohibido.' },
            { id: 5, razon: 'Exceso de velocidad', descripcion: 'Excedió el límite de velocidad en zona escolar.' },
        ]);
    }, []);

    const toggleExpandDisputa = (id) => {
        setExpandedDisputaId(expandedDisputaId === id ? null : id);
    };

    const handleEnviarDeclaracion = async (idDisputa) => {
        try {
            const declaracion = declaraciones[idDisputa] || '';
            // Simula un envío exitoso
            console.log(`Enviando declaración para disputa ${idDisputa}: ${declaracion}`);
            
            setSuccess('Declaración enviada con éxito.');
            setDeclaraciones((prev) => ({ ...prev, [idDisputa]: '' }));
        } catch (err) {
            console.error("Error al enviar declaración:", err);
            setError('No se pudo enviar la declaración.');
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
                {success && <p className="success-message">{success}</p>}
                
                <table className="ver-declaraciones-table">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Razón</th>
                            <th>Descripción</th>
                            <th>Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {disputas.length > 0 ? (
                            disputas.map((disputa) => (
                                <React.Fragment key={disputa.id}>
                                    <tr>
                                        <td>{disputa.id}</td>
                                        <td>{disputa.razon}</td>
                                        <td>{disputa.descripcion}</td>
                                        <td>
                                            <button
                                                className="expand-button"
                                                onClick={() => toggleExpandDisputa(disputa.id)}
                                            >
                                                {expandedDisputaId === disputa.id ? <FaChevronUp /> : <FaChevronDown />}
                                            </button>
                                        </td>
                                    </tr>
                                    {expandedDisputaId === disputa.id && (
                                        <tr className="declaracion-row">
                                            <td colSpan="4">
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
                                <td colSpan="4" className="no-data">No se encontraron disputas.</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export default VerDeclaraciones;

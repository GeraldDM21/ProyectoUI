import React, { useEffect, useState } from 'react';
import { FaDollarSign, FaExclamationCircle } from 'react-icons/fa';
import '../Styles/VerMultas.css';
import { useNavigate } from 'react-router-dom';
import HeaderUsuario from './HeaderUsuario'; // Importamos HeaderUsuario

function VerMultas() {
    const [multas, setMultas] = useState([]);
    const [disputas, setDisputas] = useState([]);
    const [error, setError] = useState('');
    const [infracciones, setInfracciones] = useState([]);
    const userId = localStorage.getItem('userId');
    const navigate = useNavigate();
    
    useEffect(() => {
        fetchMultas();
        fetchInfracciones();
        fetchDisputas();
    }, []);

    // Función para obtener las multas desde el backend
    const fetchMultas = async () => {
        try {
            const response = await fetch(`https://localhost:7201/api/Multas/IdInfractor/${userId}`); // Reemplaza con la URL correcta de tu API
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

    // Función para obtener las infracciones desde el backend
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

    // Función para obtener las disputas desde el backend
    const fetchDisputas = async () => {
        try {
            const response = await fetch(`https://localhost:7201/api/Disputas/IdInfractor/${userId}`);
            if (!response.ok) {
                throw new Error('Error al cargar las disputas');
            }
            const data = await response.json();
            setDisputas(data);
        } catch (error) {
            console.error('Error al cargar disputas:', error);
        }
    };

    // Función para manejar el pago de una multa
    const handlePago = (id) => {
        alert(`Pagar multa con ID: ${id}`);
        // Lógica real para procesar el pago
    };

    // Función para crear una disputa para una multa
    const handleDisputa = (multa) => {
        const existingDisputa = disputas.find(disputa => disputa.idMulta === multa.id);
        if (existingDisputa) {
            alert('Ya existe una disputa para esta multa.');
        } else {
            navigate('/iniciar-disputa', { state: { multa } });
        }
    };

    return (
        <div className="ver-multas-page">
            {/* Aquí colocamos el HeaderUsuario */}
            <HeaderUsuario />

            <div className="ver-multas-container">
                <h2><FaExclamationCircle /> Mis Multas</h2>
                {error && <p className="error-message">{error}</p>}
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
                                    <td className="action-buttons">
                                        <button className="pay-button" onClick={() => handlePago(multa.id)}>Pagar</button>
                                        <button className="dispute-button" onClick={() => handleDisputa(multa)}>Disputar</button>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="8">No hay multas disponibles</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export default VerMultas;

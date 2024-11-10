import React, { useState, useEffect } from 'react';
import { FaBook } from 'react-icons/fa';
import '../Styles/CatalogoInfraccionesOficial.css';
import HeaderOficial from './HeaderOficial'; // Importamos HeaderOficial

function CatalogoInfraccionesOficial() {
    const [infracciones, setInfracciones] = useState([]);
    const [error, setError] = useState('');

    useEffect(() => {
        fetchInfracciones();
    }, []);

    // Función para obtener las infracciones desde el backend
    const fetchInfracciones = async () => {
        try {
            const response = await fetch('https://localhost:7201/api/CatalogoInfracciones');
            const data = await response.json();
            setInfracciones(data);
        } catch (error) {
            console.error("Error al cargar el catálogo de infracciones:", error);
            setError("No se pudo cargar el catálogo. Intente nuevamente más tarde.");
        }
    };

    return (
        <div className="catalogo-infracciones-oficial-page">
            <HeaderOficial /> 
            <div className="catalogo-infracciones-oficial-container">
                <h2><FaBook /> Catálogo de Infracciones</h2>
                {error && <p className="error-message">{error}</p>}
                <table className="infracciones-table">
                    <thead>
                        <tr>
                            <th>Infracción</th>
                            <th>Monto</th>
                        </tr>
                    </thead>
                    <tbody>
                        {infracciones.length > 0 ? (
                            infracciones.map((infraccion) => (
                                <tr key={infraccion.id}>
                                    <td>{infraccion.nombre}</td>
                                    <td>{`₡${(infraccion.costo ?? 0).toFixed(2)}`}</td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="2" className="no-data">No se encontraron infracciones.</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export default CatalogoInfraccionesOficial;

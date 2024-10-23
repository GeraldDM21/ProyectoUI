import React, { useState, useEffect } from 'react';

function CatalogoInfracciones() {
    const [infracciones, setInfracciones] = useState([]);

    useEffect(() => {
        // Simulación de una lista de infracciones
        const infraccionesSimuladas = [
            { id: 1, tipo: 'Exceso de velocidad', descripcion: 'Sobrepasar el límite de velocidad en 20 km/h o más', monto: 100 },
            { id: 2, tipo: 'Estacionamiento prohibido', descripcion: 'Estacionar en una zona no permitida', monto: 50 },
            { id: 3, tipo: 'Pasar semáforo en rojo', descripcion: 'No detenerse ante una luz roja', monto: 150 },
        ];
        setInfracciones(infraccionesSimuladas);
    }, []);

    return (
        <div className="container mt-5">
            <h2>Catálogo de Infracciones</h2>
            <table className="table">
                <thead>
                    <tr>
                        <th>Tipo de Infracción</th>
                        <th>Descripción</th>
                        <th>Monto</th>
                    </tr>
                </thead>
                <tbody>
                    {infracciones.map((infraccion) => (
                        <tr key={infraccion.id}>
                            <td>{infraccion.tipo}</td>
                            <td>{infraccion.descripcion}</td>
                            <td>${infraccion.monto}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

export default CatalogoInfracciones;

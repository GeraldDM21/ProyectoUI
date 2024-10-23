import React, { useState, useEffect } from 'react';

function DashboardUsuario() {
    const [multas, setMultas] = useState([]);
    const [historialVisible, setHistorialVisible] = useState(false);  // Controla la visibilidad del historial

    useEffect(() => {
        // Simulación de multas del usuario, en un sistema real esto vendría del backend
        const multasSimuladas = [
            { id: 1, infraccion: 'Exceso de velocidad', fecha: '2024-01-01', estado: 'Pendiente', monto: 100 },
            { id: 2, infraccion: 'Estacionamiento prohibido', fecha: '2024-01-15', estado: 'Pagada', monto: 50 },
            { id: 3, infraccion: 'No respetar señal de stop', fecha: '2023-12-20', estado: 'Pendiente', monto: 75 },
        ];
        setMultas(multasSimuladas);
    }, []);

    // Función para iniciar el pago de una multa
    const pagarMulta = (id) => {
        const nuevaListaMultas = multas.map((multa) =>
            multa.id === id ? { ...multa, estado: 'Pagada' } : multa
        );
        setMultas(nuevaListaMultas);
        alert(`Multa con ID ${id} ha sido pagada`);
    };

    // Función para alternar el historial de multas
    const toggleHistorial = () => {
        setHistorialVisible(!historialVisible);
    };

    return (
        <div className="container mt-5">
            <h2 className="text-primary">Dashboard Usuario Final</h2>
            <h3>Mis Multas</h3>
            <table className="table">
                <thead>
                    <tr>
                        <th>Infracción</th>
                        <th>Fecha</th>
                        <th>Estado</th>
                        <th>Monto</th>
                        <th>Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    {multas.filter(multa => multa.estado === 'Pendiente').map((multa) => (
                        <tr key={multa.id}>
                            <td>{multa.infraccion}</td>
                            <td>{multa.fecha}</td>
                            <td>{multa.estado}</td>
                            <td>${multa.monto}</td>
                            <td>
                                <button className="btn btn-success mr-2" onClick={() => pagarMulta(multa.id)}>
                                    Pagar Multa
                                </button>
                                <button className="btn btn-warning" onClick={() => alert('Iniciando disputa')}>
                                    Iniciar Disputa
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            {/* Botón para alternar la visualización del historial */}
            <button className="btn btn-secondary mt-3" onClick={toggleHistorial}>
                {historialVisible ? 'Ocultar Historial' : 'Ver Historial de Multas'}
            </button>

            {/* Historial de multas */}
            {historialVisible && (
                <div className="mt-4">
                    <h3>Historial de Multas</h3>
                    <table className="table">
                        <thead>
                            <tr>
                                <th>Infracción</th>
                                <th>Fecha</th>
                                <th>Estado</th>
                                <th>Monto</th>
                            </tr>
                        </thead>
                        <tbody>
                            {multas.map((multa) => (
                                <tr key={multa.id}>
                                    <td>{multa.infraccion}</td>
                                    <td>{multa.fecha}</td>
                                    <td>{multa.estado}</td>
                                    <td>${multa.monto}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}

export default DashboardUsuario;

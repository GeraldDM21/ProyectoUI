import React, { useState, useEffect } from 'react';

function ListaDisputasJuez() {
    const [disputas, setDisputas] = useState([]);

    useEffect(() => {
        // Simulación de disputas pendientes
        const disputasSimuladas = [
            { id: 1, multaId: 'M123', descripcion: 'No estaba en el lugar', estado: 'Pendiente' },
            { id: 2, multaId: 'M456', descripcion: 'Multa injusta', estado: 'Pendiente' },
        ];
        setDisputas(disputasSimuladas);
    }, []);

    const manejarDisputa = (id, decision) => {
        setDisputas(disputas.map(disputa =>
            disputa.id === id ? { ...disputa, estado: decision } : disputa
        ));
        console.log(`Disputa ${id} ha sido ${decision}`);
    };

    return (
        <div className="container mt-5">
            <h2>Disputas Pendientes</h2>
            <table className="table">
                <thead>
                    <tr>
                        <th>ID Multa</th>
                        <th>Descripción</th>
                        <th>Estado</th>
                        <th>Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    {disputas.map((disputa) => (
                        <tr key={disputa.id}>
                            <td>{disputa.multaId}</td>
                            <td>{disputa.descripcion}</td>
                            <td>{disputa.estado}</td>
                            <td>
                                {disputa.estado === 'Pendiente' && (
                                    <>
                                        <button
                                            className="btn btn-success"
                                            onClick={() => manejarDisputa(disputa.id, 'Aprobada')}
                                        >
                                            Aprobar
                                        </button>
                                        <button
                                            className="btn btn-danger ml-2"
                                            onClick={() => manejarDisputa(disputa.id, 'Rechazada')}
                                        >
                                            Rechazar
                                        </button>
                                    </>
                                )}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

export default ListaDisputasJuez;

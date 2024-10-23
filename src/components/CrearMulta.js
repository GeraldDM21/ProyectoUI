import React, { useState } from 'react';

function CrearMulta() {
    const [matricula, setMatricula] = useState('');
    const [infraccion, setInfraccion] = useState('');
    const [monto, setMonto] = useState('');
    const [fecha, setFecha] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        const nuevaMulta = { matricula, infraccion, monto, fecha };
        console.log('Multa creada:', nuevaMulta);
        // Aquí se enviaría la multa al backend
        setMatricula('');
        setInfraccion('');
        setMonto('');
        setFecha('');
    };

    return (
        <div className="container mt-5">
            <h2>Crear Multa</h2>
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label>Matrícula del Vehículo</label>
                    <input
                        type="text"
                        className="form-control"
                        value={matricula}
                        onChange={(e) => setMatricula(e.target.value)}
                        required
                    />
                </div>
                <div className="form-group">
                    <label>Tipo de Infracción</label>
                    <input
                        type="text"
                        className="form-control"
                        value={infraccion}
                        onChange={(e) => setInfraccion(e.target.value)}
                        required
                    />
                </div>
                <div className="form-group">
                    <label>Monto</label>
                    <input
                        type="number"
                        className="form-control"
                        value={monto}
                        onChange={(e) => setMonto(e.target.value)}
                        required
                    />
                </div>
                <div className="form-group">
                    <label>Fecha</label>
                    <input
                        type="date"
                        className="form-control"
                        value={fecha}
                        onChange={(e) => setFecha(e.target.value)}
                        required
                    />
                </div>
                <button type="submit" className="btn btn-primary mt-3">Crear Multa</button>
            </form>
        </div>
    );
}

export default CrearMulta;

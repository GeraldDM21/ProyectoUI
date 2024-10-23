import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';

function IniciarDisputa() {
    const [descripcion, setDescripcion] = useState('');
    const location = useLocation();
    const params = new URLSearchParams(location.search);
    const multaId = params.get('multaId');

    const handleSubmit = (e) => {
        e.preventDefault();
        const nuevaDisputa = { multaId, descripcion, estado: 'Pendiente' };
        console.log('Disputa iniciada:', nuevaDisputa);
        // Aquí enviarías la disputa al backend
        setDescripcion('');
    };

    return (
        <div className="container mt-5">
            <h2>Iniciar Disputa</h2>
            <p>ID de la Multa: {multaId}</p>
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label>Descripción de la Disputa</label>
                    <textarea
                        className="form-control"
                        value={descripcion}
                        onChange={(e) => setDescripcion(e.target.value)}
                        required
                    />
                </div>
                <button type="submit" className="btn btn-warning mt-3">Enviar Disputa</button>
            </form>
        </div>
    );
}

export default IniciarDisputa;

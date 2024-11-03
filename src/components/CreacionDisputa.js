import React, { useState } from 'react';
import { FaEdit, FaAlignLeft, FaInfoCircle } from 'react-icons/fa';
import '../Styles/CreacionDisputa.css';

function CreacionDisputa() {
    const [razon, setRazon] = useState('');
    const [descripcion, setDescripcion] = useState('');
    const [estado, setEstado] = useState('Pendiente'); 
    const [message, setMessage] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();

        const disputaData = { 
            razon, 
            descripcion, 
            estado 
        };

        try {
            const response = await fetch('https://localhost:7201/api/Disputas', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(disputaData),
            });

            if (response.ok) {
                setMessage("Disputa creada exitosamente.");
                setRazon('');
                setDescripcion('');
            } else {
                setMessage("Error al crear la disputa.");
            }
        } catch (error) {
            console.error("Error al conectar con el servidor:", error);
            setMessage("Error de conexión. Intente nuevamente más tarde.");
        }
    };

    return (
        <div className="crear-disputa-page">
            <div className="crear-disputa-container">
                <h2><FaEdit /> Crear Disputa</h2>
                <form onSubmit={handleSubmit}>
                    <div className="form-group-disputa">
                        <label>
                            <FaInfoCircle className="icon" /> Razón de la Disputa
                        </label>
                        <input
                            type="text"
                            value={razon}
                            onChange={(e) => setRazon(e.target.value)}
                            placeholder="Ingrese la razón de la disputa"
                            required
                        />
                    </div>
                    <div className="form-group-disputa">
                        <label>
                            <FaAlignLeft className="icon" /> Descripción
                        </label>
                        <textarea
                            value={descripcion}
                            onChange={(e) => setDescripcion(e.target.value)}
                            placeholder="Describa los detalles de la disputa"
                            required
                        ></textarea>
                    </div>
                    <button type="submit" className="btn-submit">Crear Disputa</button>
                    {message && <p className="message">{message}</p>}
                </form>
            </div>
        </div>
    );
}

export default CreacionDisputa;

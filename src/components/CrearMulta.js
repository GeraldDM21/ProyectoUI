import React, { useState } from 'react';
import { FaUser, FaCalendarAlt, FaMapMarkerAlt } from 'react-icons/fa';
import '../Styles/CrearMulta.css';

function CrearMulta() {
    const [nombreInfractor, setNombreInfractor] = useState('');
    const [apellidoInfractor, setApellidoInfractor] = useState('');
    const [cedulaInfractor, setCedulaInfractor] = useState('');
    const [longitud, setLongitud] = useState('');
    const [latitud, setLatitud] = useState('');
    const [fecha, setFecha] = useState('');
    const [infraccion, setInfraccion] = useState('');
    const [message, setMessage] = useState('');

    // Maneja el envío del formulario
    const handleSubmit = async (e) => {
        e.preventDefault();

        const multaData = {
            nombreInfractor,
            apellidoInfractor,
            cedulaInfractor,
            longitud: parseFloat(longitud),
            latitud: parseFloat(latitud),
            fecha,
            infraccion
        };

        try {
            const response = await fetch('https://localhost:7201/api/Multas', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(multaData)
            });

            if (response.ok) {
                setMessage('Multa creada exitosamente');
                // Resetea los campos
                setNombreInfractor('');
                setApellidoInfractor('');
                setCedulaInfractor('');
                setLongitud('');
                setLatitud('');
                setFecha('');
                setInfraccion('');
            } else {
                setMessage('Error al crear la multa');
            }
        } catch (error) {
            setMessage('Error de conexión con el servidor');
            console.error(error);
        }
    };

    return (
        <div className="crear-multa-background">
            <div className="shape-background"></div>
            <div className="crear-multa-container">
                <h2>Crear Multa</h2>
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <FaUser className="icon" />
                        <input
                            type="text"
                            placeholder="Nombre del Infractor"
                            value={nombreInfractor}
                            onChange={(e) => setNombreInfractor(e.target.value)}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <FaUser className="icon" />
                        <input
                            type="text"
                            placeholder="Apellido del Infractor"
                            value={apellidoInfractor}
                            onChange={(e) => setApellidoInfractor(e.target.value)}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <FaUser className="icon" />
                        <input
                            type="text"
                            placeholder="Cédula del Infractor"
                            value={cedulaInfractor}
                            onChange={(e) => setCedulaInfractor(e.target.value)}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <FaMapMarkerAlt className="icon" />
                        <input
                            type="text"
                            placeholder="Longitud"
                            value={longitud}
                            onChange={(e) => setLongitud(e.target.value)}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <FaMapMarkerAlt className="icon" />
                        <input
                            type="text"
                            placeholder="Latitud"
                            value={latitud}
                            onChange={(e) => setLatitud(e.target.value)}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <FaCalendarAlt className="icon" />
                        <input
                            type="date"
                            placeholder="Fecha de la Infracción"
                            value={fecha}
                            onChange={(e) => setFecha(e.target.value)}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label>Tipo de Infracción:</label>
                        <select
                            value={infraccion}
                            onChange={(e) => setInfraccion(e.target.value)}
                            required
                        >
                            <option value="">Seleccione una infracción</option>
                            <option value="Exceso de Velocidad">Exceso de Velocidad</option>
                            <option value="Uso del Celular">Uso del Celular</option>
                            <option value="Estacionamiento Prohibido">Estacionamiento Prohibido</option>
                        </select>
                    </div>
                    <button type="submit" className="btn-submit">Registrar Multa</button>
                    {message && <p className="message">{message}</p>}
                </form>
            </div>
        </div>
    );
}

export default CrearMulta;

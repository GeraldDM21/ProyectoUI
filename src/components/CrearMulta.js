import React, { useState, useEffect } from 'react';
import { FaUser, FaCalendarAlt, FaMapMarkerAlt, FaIdCard } from 'react-icons/fa';
import '../Styles/CrearMulta.css';
import { set } from '@cloudinary/url-gen/actions/variable';

function CrearMulta() {
    const [placasId, setIdPlaca] = useState('');
    const [nombreInfractor, setNombreInfractor] = useState('');
    const [apellidoInfractor, setApellidoInfractor] = useState('');
    const [cedulaInfractor, setCedulaInfractor] = useState('');
    const [longitud, setLongitud] = useState('');
    const [latitud, setLatitud] = useState('');
    const [fecha, setFecha] = useState('');
    const [infraccion, setInfraccion] = useState([]);
    const [message, setMessage] = useState('');
    const [selectedInfracciones, setSelectedInfracciones] = useState([]);
    const userId = localStorage.getItem('userId');

    const fetchInfractions = async () => {
        try {
            const response = await fetch('https://localhost:7201/api/CatalogoInfracciones');
            if (response.ok) {
                const data = await response.json();
                setInfraccion(data);
            } else {
                throw new Error('No se pudo cargar la información de las infracciones.');
            }
        } catch (error) {
            console.error(error);
        }
    };

    useEffect(() => {
        fetchInfractions();
    }, []);

    const checkUserExists = async (cedula) => {
        try {
            const response = await fetch(`https://localhost:7201/api/Usuarios/Cedula/${cedula}`);
            if (response.ok) {
                const user = await response.json();
                return user; // Assuming the user object has an 'id' property
            } else {
                return null;
            }
        } catch (error) {
            console.log('Error checking user:', error);
            return null;
        }
    };

    const checkAndAddPlaca = async (placasId) => {
        try {
            // Check if the placa exists
            const response = await fetch(`https://localhost:7201/api/Placas/${placasId}`);
            if (response.ok) {
                // Placa exists
                return true;
            } else if (response.status === 404) {
                // Placa does not exist, add it
                const addResponse = await fetch('https://localhost:7201/api/Placas', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ id: placasId })
                });
                return addResponse.ok;
            } else {
                throw new Error('Error checking placa');
            }
        } catch (error) {
            console.log('Error checking or adding placa:', error);
            return false;
        }
    };

    useEffect(() => {
        const fetchUserData = async () => {
            if (cedulaInfractor) {
                const user = await checkUserExists(cedulaInfractor);
                if (user) {
                    setNombreInfractor(user.nombre); // Assuming the user object has a 'nombre' property
                    setApellidoInfractor(user.apellido); // Assuming the user object has an 'apellido' property
                } else {
                    setNombreInfractor('');
                    setApellidoInfractor('');
                }
            }
        };

        fetchUserData();
    }, [cedulaInfractor]);

    // Maneja el envío del formulario
    const handleSubmit = async (e) => {
        e.preventDefault();

        // Verifica si la placa existe
        const placaExists = await checkAndAddPlaca(placasId);
        if (!placaExists) {
            console.log('Error: La placa no existe o no se pudo agregar');
            return;
        }

        // Verifica si el usuario ya existe
        const userIdInfractor = await checkUserExists(cedulaInfractor);

        const multaData = {
            nombreInfractor,
            apellidoInfractor,
            cedulaInfractor,
            longitud: parseFloat(longitud),
            latitud: parseFloat(latitud),
            fecha,
            pagada: false,
            fotoSinpe: "string",
            total: 0,
            idOficial: userId,
            idInfractor: userIdInfractor.id,
            infraccionMultas: selectedInfracciones.map(id => ({ catalogoInfraccionesId: id })),
            multaPlacas: [{
                placasId,
            }]
        };

        console.log(multaData);

        try {
            const response = await fetch('https://localhost:7201/api/Multas', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(multaData)
            });

            if (response.ok) {
                alert('Multa creada exitosamente');
                // Resetea los campos
                setNombreInfractor('');
                setApellidoInfractor('');
                setCedulaInfractor('');
                setLongitud('');
                setLatitud('');
                setFecha('');
                setIdPlaca('');
                setSelectedInfracciones([]); // Reset selected infracciones
            }
        } catch (error) {
            console.error('Error:', error);
        }
    };

    return (
        <div className="crear-multa-background">
            <div className="shape-background"></div>
            <div className="crear-multa-container">
                <h2>Crear Multa</h2>
                <form onSubmit={handleSubmit}>
                <div className="form-group">
                        <FaIdCard className="icon" />
                        <input
                            type="text"
                            placeholder="Numero de Placa"
                            value={placasId}
                            onChange={(e) => setIdPlaca(e.target.value)}
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
                        <select multiple value={selectedInfracciones} onChange={(e) => {
                            const options = e.target.options;
                            const selectedValues = [];
                            for (let i = 0; i < options.length; i++) {
                                if (options[i].selected) {
                                    selectedValues.push(options[i].value);
                                }
                            }
                            setSelectedInfracciones(selectedValues);
                        }}>
                            {infraccion.map((infraccion) => (
                                <option key={infraccion.id} value={infraccion.id}>
                                    {infraccion.nombre}
                                </option>
                            ))}
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

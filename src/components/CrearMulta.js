import React, { useState, useEffect } from 'react';
import { FaUser, FaCalendarAlt, FaMapMarkerAlt, FaIdCard } from 'react-icons/fa';
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import '../Styles/CrearMulta.css';
import { set } from '@cloudinary/url-gen/actions/variable';
import { cat } from '@cloudinary/url-gen/qualifiers/focusOn';
import HeaderOficial from './HeaderOficial';

function CrearMulta() {
    const [placasId, setIdPlaca] = useState('');
    const [nombreInfractor, setNombreInfractor] = useState('');
    const [apellidoInfractor, setApellidoInfractor] = useState('');
    const [cedulaInfractor, setCedulaInfractor] = useState('');
    const [longitud, setLongitud] = useState('');
    const [latitud, setLatitud] = useState('');
    const [fecha, setFecha] = useState('');
    const [infraccion, setInfraccion] = useState([]);
    const [selectedInfracciones, setSelectedInfracciones] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [locationSuggestions, setLocationSuggestions] = useState([]);
    const [selectedPosition, setSelectedPosition] = useState([9.7489, -83.7534]); // Coordenadas iniciales de Costa Rica

    const userId = localStorage.getItem('userId');

    const markerIcon = new L.Icon({
        iconUrl: require('leaflet/dist/images/marker-icon.png'),
        iconSize: [25, 41],
        iconAnchor: [12, 41]
    });

    const fetchInfractions = async () => {
        try {
            const response = await fetch('https://localhost:7201/api/CatalogoInfracciones');
            const data = await response.json();
            setInfraccion(data);
        } catch (error) {
            console.error(error);
        }
    };

    useEffect(() => {
        fetchInfractions();
    }, []);

    // Buscar la ubicación actual del usuario y centrar el mapa en ella
    const searchLocation = () => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const { latitude, longitude } = position.coords;
                    setLatitud(latitude);
                    setLongitud(longitude);
                    setSelectedPosition([latitude, longitude]);
                },
                (error) => {
                    console.error('Error al obtener la ubicación:', error);
                }
            );
        } else {
            console.error('La geolocalización no es compatible con este navegador.');
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const multaData = {
            nombreInfractor,
            apellidoInfractor,
            cedulaInfractor,
            longitud: parseFloat(longitud),
            latitud: parseFloat(latitud),
            fecha,
            pagada: false,
            resuelta: false,
            fotoSinpe: "string",
            total: selectedInfracciones.reduce((accumulator, id) => {
                const infra = infraccion.find(item => item.id == id);
                return accumulator + (infra ? infra.costo : 0);
            }, 0),
            idOficial: userId,
            infraccionMultas: selectedInfracciones.map(id => ({ catalogoInfraccionesId: id })),
            multaPlacas: [{ placasId }]
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
                alert('Multa creada exitosamente');
                setNombreInfractor('');
                setApellidoInfractor('');
                setCedulaInfractor('');
                setLongitud('');
                setLatitud('');
                setFecha('');
                setIdPlaca('');
                setSelectedInfracciones([]);
            }
        } catch (error) {
            console.error('Error al crear multa:', error);
        }
    };

    // Componente para manejar eventos en el mapa (clic para seleccionar ubicación)
    function LocationMarker() {
        useMapEvents({
            click(e) {
                setLatitud(e.latlng.lat);
                setLongitud(e.latlng.lng);
                setSelectedPosition([e.latlng.lat, e.latlng.lng]);
            },
        });
        return selectedPosition ? (
            <Marker position={selectedPosition} icon={markerIcon}></Marker>
        ) : null;
    }

    return (
        <div className="crear-multa-background">
            <HeaderOficial />
            <div className="shape-background"></div>
            <div className="crear-multa-container">
                <h2>Crear Multa</h2>
                <form onSubmit={handleSubmit}>
                    <div className="form-group-login input-icon">
                        <FaMapMarkerAlt className="icon" />
                        <input
                            type="text"
                            placeholder="Buscar ubicación por nombre"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                        <button type="button" onClick={searchLocation} className="search-button">Buscar</button>
                    </div>

                    <div className="form-group-login input-icon">
                        <FaIdCard className="icon" />
                        <input type="text" placeholder="Número de Placa" value={placasId} onChange={(e) => setIdPlaca(e.target.value)} required />
                    </div>
                    <div className="form-group-login input-icon">
                        <FaUser className="icon" />
                        <input type="text" placeholder="Cédula del Infractor" value={cedulaInfractor} onChange={(e) => setCedulaInfractor(e.target.value)} required />
                    </div>
                    <div className="form-group-login input-icon">
                        <FaUser className="icon" />
                        <input type="text" placeholder="Nombre del Infractor" value={nombreInfractor} onChange={(e) => setNombreInfractor(e.target.value)} required />
                    </div>
                    <div className="form-group-login input-icon">
                        <FaUser className="icon" />
                        <input type="text" placeholder="Apellido del Infractor" value={apellidoInfractor} onChange={(e) => setApellidoInfractor(e.target.value)} required />
                    </div>
                    <div className="form-group-login input-icon">
                        <FaCalendarAlt className="icon" />
                        <input type="date" placeholder="Fecha de la Infracción" value={fecha} onChange={(e) => setFecha(e.target.value)} required />
                    </div>

                    <label>Selecciona la Ubicación:</label>
                    <MapContainer center={selectedPosition} zoom={13} className="leaflet-container">
                        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                        <LocationMarker />
                    </MapContainer>

                    <div className="form-group-login">
                        <label>Tipo de Infracción:</label>
                        <select multiple value={selectedInfracciones} onChange={(e) => setSelectedInfracciones([...e.target.selectedOptions].map(opt => opt.value))}>
                            {infraccion.map((inf) => (
                                <option key={inf.id} value={inf.id}>{inf.nombre}</option>
                            ))}
                        </select>
                    </div>

                    <button type="submit" className="btn-login">Registrar Multa</button>
                </form>
            </div>
        </div>
    );
}

export default CrearMulta;

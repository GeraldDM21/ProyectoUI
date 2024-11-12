import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import L from 'leaflet';
import { FaUser, FaCalendarAlt, FaMapMarkerAlt, FaIdCard, FaSearchLocation } from 'react-icons/fa';
import '../Styles/CrearMulta.css';

const markerIcon = new L.Icon({
    iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
    shadowSize: [41, 41],
});

function LocationMarker({ setLatitud, setLongitud }) {
    const [position, setPosition] = useState(null);

    useMapEvents({
        click(e) {
            setPosition(e.latlng);
            setLatitud(e.latlng.lat);
            setLongitud(e.latlng.lng);
        },
    });

    return position === null ? null : (
        <Marker position={position} icon={markerIcon}></Marker>
    );
}

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
    const [searchLocation, setSearchLocation] = useState('');
    const [locationSuggestions, setLocationSuggestions] = useState([]);
    const userId = localStorage.getItem('userId');

    useEffect(() => {
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
        fetchInfractions();
    }, []);

    const fetchLocationSuggestions = async (query) => {
        try {
            const response = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${query}`);
            const data = await response.json();
            setLocationSuggestions(data);
        } catch (error) {
            console.error('Error al obtener sugerencias de ubicación:', error);
        }
    };

    const handleSearchLocationChange = (e) => {
        const query = e.target.value;
        setSearchLocation(query);
        if (query.length > 2) {
            fetchLocationSuggestions(query);
        } else {
            setLocationSuggestions([]);
        }
    };

    const handleSuggestionClick = (lat, lon) => {
        setLatitud(lat);
        setLongitud(lon);
        setLocationSuggestions([]);
        setSearchLocation('');
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
            fotoSinpe: "string",
            total: selectedInfracciones.reduce((acc, id) => {
                const infra = infraccion.find(item => item.id === id);
                return acc + (infra ? infra.costo : 0);
            }, 0),
            idOficial: userId,
            infraccionMultas: selectedInfracciones.map(id => ({ catalogoInfraccionesId: id })),
            multaPlacas: [{ placasId }]
        };

        try {
            const response = await fetch('https://localhost:7201/api/Multas', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
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
            console.error('Error:', error);
        }
    };

    return (
        <div className="crear-multa-background">
            <div className="crear-multa-container">
                <h2>Crear Multa</h2>
                <form onSubmit={handleSubmit}>
                    <div className="form-group search-location-group">
                        <FaSearchLocation className="icon" />
                        <input
                            type="text"
                            placeholder="Buscar ubicación por nombre"
                            value={searchLocation}
                            onChange={handleSearchLocationChange}
                        />
                        {locationSuggestions.length > 0 && (
                            <ul className="suggestions-list">
                                {locationSuggestions.map((suggestion, index) => (
                                    <li
                                        key={index}
                                        onClick={() => handleSuggestionClick(suggestion.lat, suggestion.lon)}
                                    >
                                        {suggestion.display_name}
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>

                    <div className="form-group">
                        <FaIdCard className="icon" />
                        <input
                            type="text"
                            placeholder="Número de Placa"
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
                        <label>Selecciona la Ubicación:</label>
                        <MapContainer center={[10.0, -84.0]} zoom={13} className="leaflet-container">
                            <TileLayer
                                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                                attribution='&copy; <a href="https://osm.org/copyright">OpenStreetMap'
                            />
                            <LocationMarker setLatitud={setLatitud} setLongitud={setLongitud} />
                        </MapContainer>
                    </div>

                    <div className="form-group">
                        <label>Tipo de Infracción:</label>
                        <select
                            multiple
                            value={selectedInfracciones}
                            onChange={(e) => {
                                const selectedValues = Array.from(e.target.selectedOptions, option => option.value);
                                setSelectedInfracciones(selectedValues);
                            }}
                        >
                            {infraccion.map((inf) => (
                                <option key={inf.id} value={inf.id}>
                                    {inf.nombre}
                                </option>
                            ))}
                        </select>
                    </div>
                    <button type="submit" className="btn-submit">Registrar Multa</button>
                </form>
            </div>
        </div>
    );
}

export default CrearMulta;

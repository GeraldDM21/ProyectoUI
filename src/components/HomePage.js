import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MapContainer, TileLayer } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import HeatMap from './HeatMap';
import './HomePage.css';

function HomePage() {
    const navigate = useNavigate();
    const [plate, setPlate] = useState('');
    const [results, setResults] = useState([]);

    const teamMembers = [
        { name: 'Gerald Delgado', role: 'Desarrollador Frontend' },
        { name: 'Jose Mario', role: 'Desarrollador Frontend' },
        { name: 'Carolina Gutierrez', role: 'Scrum Master' },
        { name: 'Fabian Chacon', role: 'Ingeniero de DevOps' },
    ];

    const heatmapPoints = [
        [9.934819, -84.088046, 0.5], // San José
        [34.0522, -118.2437, 0.4],   // Los Ángeles
        [40.7128, -74.0060, 0.8],    // Nueva York
    ];

    const handleLogin = () => navigate('/login');
    const handleRegister = () => navigate('/register');

    const handleSearch = () => {
        // Se simula un resultado de búsqueda, se puede conectar con una API o base de datos.
        setResults([
            { name: 'Carlos Pérez', infraction: 'Exceso de velocidad', location: 'San José', date: '2023-10-29' },
            { name: 'Ana López', infraction: 'Estacionamiento indebido', location: 'Alajuela', date: '2023-10-15' },
        ]);
    };

    return (
        <body className="container mt-5">
            <header className="header">
                <div className="header-left">
                    <button className="nav-button" onClick={() => window.location.reload()}>Tránsito 360</button>
                    <button className="nav-button" onClick={() => navigate('/next-code')}>Next Code Solutions</button>
                </div>
                <div className="header-right">
                    <button onClick={handleLogin}>Iniciar Sesión</button>
                    <button onClick={handleRegister}>Registrarse</button>
                </div>
            </header>

            

            <div className="transito-container">
                <h1 className="transito-title">Tránsito 360</h1>
            </div>


            <h2></h2>
            <div className="mapa-calor-container">
            <h3 className="mapa-calor-title">Mapa de Calor de Multas</h3>
            </div>

            <div className="mapa-calor-container">
                 <MapContainer center={[9.934819, -84.088046]} zoom={5} className="map-container">
                      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                      <HeatMap points={heatmapPoints} />
                </MapContainer>
           </div>

        


            <div className="section-container">
            <h3 className="consulta-placa-title">Consulta por Placa</h3>
                <div className="consulta-form">
                    <input
                        type="text"
                        placeholder="Ingresa el número de placa"
                        value={plate}
                        onChange={(e) => setPlate(e.target.value)}
                    />
                    <button onClick={handleSearch}>Buscar</button>
                </div>
                <table className="results-table">
                    <thead>
                        <tr>
                            <th>Nombre</th>
                            <th>Apellido</th>
                            <th>Cédula</th>
                            <th>Longitud</th>
                            <th>Latitud</th>
                            <th>Fecha</th>
                        </tr>
                    </thead>
                    <tbody>
                        {results.map((result, index) => (
                            <tr key={index}>
                                <td>{result.name}</td>
                                <td>{result.infraction}</td>
                                <td>{result.location}</td>
                                <td>{result.date}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            <footer>  <h2 className="footer-title">Next Code Solutions</h2></footer>
        </body>
    );
}

export default HomePage;

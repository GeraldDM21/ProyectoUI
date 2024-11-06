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


    const heatmapPoints = [
        [9.934819, -84.088046], // San José
        [34.0522, -118.2437, 0.4],   // Los Ángeles
        [40.7128, -74.0060, 0.8],    // Nueva York
    ];

    const handleLogin = () => navigate('/login');
    const handleRegister = () => navigate('/register');

    const handleSearch = () => {
        // Se simula un resultado de búsqueda, se puede conectar con una API o base de datos.
        setResults([
            { nombre: 'Fabio', apellido: 'Chacon', cedula: '111222333',Placa:'BGP-000',Infracciones:'Exceso de velocidad', longitud: -84.088046,latitud: 7.634416,fecha:'2024-05-15'},
        
        ]);
    };


    return (
        <body className="container mt-5">
            <header className="header">
                <div className="header-left">
                    <button className="nav-button" onClick={() => window.location.reload()}>Tránsito 360</button>
                    <button className="nav-button" onClick={() => navigate('/NextCodeSolutions')}>NextCodeSolutions</button>
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
                            <th>Placa</th>
                            <th>Infracciones</th>
                            <th>Longitud</th>
                            <th>Latitud</th>
                            <th>Fecha</th>
                        </tr>
                    </thead>
                    <tbody>
                        {results.map((result, index) => (
                            <tr key={index}>
                                <td>{result.nombre}</td>
                                <td>{result.apellido}</td>
                                <td>{result.cedula}</td>
                                <td>{result.Placa}</td>
                                <td>{result.Infracciones}</td>
                                <td>{result.longitud}</td>
                                <td>{result.latitud}</td>
                                <td>{result.fecha}</td>
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

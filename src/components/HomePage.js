import React from 'react';
import { useNavigate } from 'react-router-dom';
import { MapContainer, TileLayer } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import HeatMap from './HeatMap';  // Importa el componente HeatMap
import './HomePage.css';

function HomePage() {
    const navigate = useNavigate();

    // Datos de los miembros del equipo
    const teamMembers = [
        { name: 'Gerald Delgado', role: 'Desarrollador Frontend' },
        { name: 'Jose Mario', role: 'Desarrollador Frontend' },
        { name: 'Carolina Guitierrez', role: 'Scrum Master' },
        { name: 'Fabian Chacon', role: 'Ingeniero de DevOps' },
    ];

    // Datos simulados para el mapa de calor (latitud, longitud, intensidad)
    const heatmapPoints = [
        [9.934819, -84.088046, 0.5], // San José
        [34.0522, -118.2437, 0.4], // Los Ángeles
        [40.7128, -74.0060, 0.8],  // Nueva York
    ];

    // Función para manejar la navegación
    const handleLogin = () => {
        navigate('/login'); // Redirige a la página de inicio de sesión
    };

    const handleRegister = () => {
        navigate('/register'); // Redirige a la página de registro
    };

    return (
        <div className="container mt-5">
            <h2>Página Principal</h2>

            {/* Botones de Inicio de Sesión y Registro */}
            <div className="mt-4 text-center">
                <button className="btn btn-primary" onClick={handleLogin}>Iniciar Sesión</button>
                <button className="btn btn-secondary ml-3" onClick={handleRegister}>Registrarse</button>
            </div>

            {/* Sección del Mapa de Calor */}
            <div className="mt-5">
                <h3>Mapa de Calor de Multas</h3>
                <MapContainer center={[9.934819, -84.088046]} zoom={5} style={{ height: '400px', width: '100%' }}>
                    <TileLayer
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    />
                    <HeatMap points={heatmapPoints} />
                </MapContainer>
            </div>

            {/* Sección de Miembros del Equipo */}
            <div className="mt-5">
                <h3>Miembros del Equipo</h3>
                <ul>
                    {teamMembers.map((member, index) => (
                        <li key={index}>
                            {member.name} - {member.role}
                        </li>
                    ))}
                </ul>
            </div>

            {/* Sección de Preguntas Frecuentes */}
            <div className="mt-5">
                <h3>Preguntas Frecuentes (FAQ)</h3>
                <div>
                    <h5>¿Cómo puedo pagar mis multas?</h5>
                    <p>Puedes pagar tus multas en línea a través de nuestra plataforma utilizando tu tarjeta de crédito o PayPal.</p>
                </div>
                <div>
                    <h5>¿Dónde puedo ver mis multas?</h5>
                    <p>Una vez que hayas iniciado sesión, puedes ver el historial de tus multas desde tu dashboard.</p>
                </div>
                <div>
                    <h5>¿Qué hago si tengo una multa que considero injusta?</h5>
                    <p>Puedes presentar una apelación directamente desde el sistema, y un juez revisará tu caso.</p>
                </div>
            </div>
        </div>
    );
}

export default HomePage;

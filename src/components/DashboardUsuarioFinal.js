import React from 'react';
import { useNavigate } from 'react-router-dom';
import LogoutButton from './LogoutButton';
import '../Styles/Dashboard.css';

function DashboardUsuarioFinal() {
    const navigate = useNavigate();

    return (
        <div className="dashboard-layout">
            <aside className="sidebar">
                <h2>Usuario Final</h2>
                <button onClick={() => navigate('/ver-multas')} className="sidebar-button">
                    <i className="fas fa-file-invoice"></i> Ver Multas
                </button>
                <button onClick={() => navigate('/iniciar-disputa')} className="sidebar-button">
                    <i className="fas fa-exclamation-circle"></i> Crear Disputa
                </button>
                <button onClick={() => navigate('/perfil')} className="sidebar-button">
                    <i className="fas fa-user-edit"></i> Editar Perfil
                </button>
                <LogoutButton />
            </aside>

            <main className="main-content">
                <header className="content-header">
                    <h2>Dashboard - Usuario Final</h2>
                </header>
                <div className="content-body">
                    <p>Bienvenido al panel de usuario final. Aquí puedes ver tus multas y crear disputas si es necesario.</p>
                </div>
            </main>
        </div>
    );
}

export default DashboardUsuarioFinal;

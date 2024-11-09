import React from 'react';
import { useNavigate } from 'react-router-dom';
import LogoutButton from './LogoutButton';
import '../Styles/Dashboard.css';

function DashboardJuez() {
    const navigate = useNavigate();

    return (
        <div className="dashboard-layout">
            <aside className="sidebar">
                <h2>Juez</h2>
                <button onClick={() => navigate('/resolver-disputas')} className="sidebar-button">
                    <i className="fas fa-check-circle"></i> Gestionar Disputas
                </button>
                <button onClick={() => navigate('/ver-disputas-juez')} className="sidebar-button">
                    <i className="fas fa-gavel"></i> Disputas Resueltas
                </button>
                <button onClick={() => navigate('/perfil')} className="sidebar-button">
                    <i className="fas fa-user-edit"></i> Editar Perfil
                </button>
                <LogoutButton />
            </aside>

            <main className="main-content">
                <header className="content-header">
                    <h2>Panel - Juez</h2>
                </header>
                <div className="content-body">
                    <p>Bienvenido al panel de juez. Aquí puedes revisar y resolver disputas.</p>
                </div>
            </main>
        </div>
    );
}

export default DashboardJuez;

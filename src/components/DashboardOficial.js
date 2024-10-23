import React from 'react';
import { useNavigate } from 'react-router-dom';

function DashboardOficial() {
    const navigate = useNavigate();

    return (
        <div className="container mt-5">
            <h2>Dashboard Oficial de Tránsito</h2>
            <button className="btn btn-primary" onClick={() => navigate('/crear-multa')}>
                Crear Nueva Multa
            </button>
            <button className="btn btn-secondary ml-3" onClick={() => navigate('/catalogo-infracciones')}>
                Ver Catálogo de Infracciones 
            </button>
        </div>
    );
}

export default DashboardOficial;

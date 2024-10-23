import React from 'react';
import { useNavigate } from 'react-router-dom';

function DashboardJuez() {
    const navigate = useNavigate();

    return (
        <div className="container mt-5">
            <h2>Dashboard Juez</h2>
            <button className="btn btn-primary" onClick={() => navigate('/disputas-juez')}>
                Ver Disputas Pendientes
            </button>
        </div>
    );
}

export default DashboardJuez;

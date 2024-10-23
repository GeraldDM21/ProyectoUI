import React from 'react';

function DashboardAdmin() {
    return (
        <div className="container mt-5">
            <h2>Dashboard Administrador</h2>
            <p>Aquí puedes gestionar los usuarios, roles y ver reportes del sistema.</p>
            <button className="btn btn-primary mt-3">Gestionar Usuarios</button>
            <button className="btn btn-secondary mt-3 ml-3">Gestionar Roles</button>
        </div>
    );
}

export default DashboardAdmin;

import React from 'react';
import { Navigate } from 'react-router-dom';

function ProtectedRoute({ children, role }) {
    const token = localStorage.getItem('token');
    const userRole = localStorage.getItem('role');

    // Si no hay token o el rol no coincide, redirige a login
    if (!token || userRole !== role) {
        return <Navigate to="/login" />;
    }

    return children;
}

export default ProtectedRoute;

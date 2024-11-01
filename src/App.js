import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import HomePage from './components/HomePage';
import Login from './components/Login';
import ForgotPassword from './components/ForgotPassword';
import Register from './components/Register';
import DashboardUsuario from './components/DashboardUsuario';
import DashboardOficial from './components/DashboardOficial';
import DashboardJuez from './components/DashboardJuez';
import DashboardAdmin from './components/DashboardAdmin';
import CrearMulta from './components/CrearMulta';
import IniciarDisputa from './components/IniciarDisputa';
import ListaDisputasJuez from './components/ListaDisputasJuez';
import CatalogoInfracciones from './components/CatalogoInfracciones';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/login" element={<Login />} />
                <Route path="/forgot-password" element={<ForgotPassword />} />
                <Route path="/register" element={<Register />} />

                {/* Rutas protegidas para cada rol */}
                <Route path="/usuario" element={<ProtectedRoute role="UsuarioFinal"><DashboardUsuario /></ProtectedRoute>} />
                <Route path="/oficial" element={<ProtectedRoute role="Oficial"><DashboardOficial /></ProtectedRoute>} />
                <Route path="/juez" element={<ProtectedRoute role="Juez"><DashboardJuez /></ProtectedRoute>} />
                <Route path="/admin" element={<ProtectedRoute role="Admin"><DashboardAdmin /></ProtectedRoute>} />

                {/* Otras funcionalidades protegidas */}
                <Route path="/crear-multa" element={<ProtectedRoute role="UsuarioFinal"><CrearMulta /></ProtectedRoute>} />
                <Route path="/iniciar-disputa" element={<ProtectedRoute role="UsuarioFinal"><IniciarDisputa /></ProtectedRoute>} />
                <Route path="/disputas-juez" element={<ProtectedRoute role="Juez"><ListaDisputasJuez /></ProtectedRoute>} />

                {/* Catálogo de infracciones protegido */}
                <Route path="/catalogo-infracciones" element={<ProtectedRoute role="usuario"><CatalogoInfracciones /></ProtectedRoute>} />
            </Routes>
        </Router>
    );
}

export default App;

import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import HomePage from './components/HomePage';
import Login from './components/Login';
import ForgotPassword from './components/ForgotPassword';
import Register from './components/Register';
import DashboardUsuarioFinal from './components/DashboardUsuarioFinal';
import DashboardOficial from './components/DashboardOficial';
import DashboardJuez from './components/DashboardJuez';
import DashboardAdmin from './components/DashboardAdmin';
import CrearMulta from './components/CrearMulta';
import CreacionDisputa from './components/CreacionDisputa';
import CatalogoInfracciones from './components/CatalogoInfracciones';
import CatalogoInfraccionesOficial from './components/CatalogoInfraccionesOficial';
import GestionUsuariosAdmin from './components/GestionUsuariosAdmin';
import GestionRoles from './components/GestionRoles';
import Perfil from './components/Perfil';
import VerMultas from './components/VerMultas';
import VerDisputas from './components/VerDisputas'; // Nuevo componente para Ver Disputas
import ResolverDisputas from './components/ResolverDisputas'; // Nuevo componente para Resolver Disputas
import ProtectedRoute from './components/ProtectedRoute';

function App() {
    return (
        <Router>
            <Routes>
                {/* Rutas públicas */}
                <Route path="/" element={<HomePage />} />
                <Route path="/login" element={<Login />} />
                <Route path="/forgot-password" element={<ForgotPassword />} />
                <Route path="/register" element={<Register />} />

                {/* Dashboard para cada rol */}
                <Route path="/admin" element={<ProtectedRoute role="admin"><DashboardAdmin /></ProtectedRoute>} />
                <Route path="/usuario" element={<ProtectedRoute role="usuario"><DashboardUsuarioFinal /></ProtectedRoute>} />
                <Route path="/oficial" element={<ProtectedRoute role="oficial"><DashboardOficial /></ProtectedRoute>} />
                <Route path="/juez" element={<ProtectedRoute role="juez"><DashboardJuez /></ProtectedRoute>} />

                {/* Funcionalidades específicas para cada rol */}
                <Route path="/catalogo-infracciones" element={<ProtectedRoute role="admin"><CatalogoInfracciones /></ProtectedRoute>} />
                <Route path="/catalogo-infracciones-oficial" element={<ProtectedRoute role="oficial"><CatalogoInfraccionesOficial /></ProtectedRoute>} />
                <Route path="/crear-usuario" element={<ProtectedRoute role="admin"><GestionUsuariosAdmin /></ProtectedRoute>} />
                <Route path="/roles" element={<ProtectedRoute role="admin"><GestionRoles /></ProtectedRoute>} />
                <Route path="/perfil" element={<ProtectedRoute role="all"><Perfil /></ProtectedRoute>} />
                
                {/* Funcionalidades para oficial */}
                <Route path="/crear-multa" element={<ProtectedRoute role="oficial"><CrearMulta /></ProtectedRoute>} />

                {/* Funcionalidades para usuario final */}
                <Route path="/ver-multas" element={<ProtectedRoute role="usuario"><VerMultas /></ProtectedRoute>} />
                <Route path="/iniciar-disputa" element={<ProtectedRoute role="usuario"><CreacionDisputa /></ProtectedRoute>} />

                {/* Funcionalidades para juez */}
                <Route path="/ver-disputas" element={<ProtectedRoute role="juez"><VerDisputas /></ProtectedRoute>} /> {/* Ver disputas */}
                <Route path="/resolver-disputas" element={<ProtectedRoute role="juez"><ResolverDisputas /></ProtectedRoute>} /> {/* Resolver disputas */}
            </Routes>
        </Router>
    );
}

export default App;

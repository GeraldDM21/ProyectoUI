import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import HomePage from './components/HomePage';
import Login from './components/Login';
import Register from './components/Register';
import DashboardUsuario from './components/DashboardUsuario';
import DashboardOficial from './components/DashboardOficial';
import DashboardJuez from './components/DashboardJuez';
import DashboardAdmin from './components/DashboardAdmin';
import CrearMulta from './components/CrearMulta';
import IniciarDisputa from './components/IniciarDisputa';
import ListaDisputasJuez from './components/ListaDisputasJuez';
import CatalogoInfracciones from './components/CatalogoInfracciones'; //Importa el catalogo
import ProtectedRoute from './components/ProtectedRoute';

function App() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                
                {/* Rutas protegidas para cada rol */}
                <Route path="/usuario" element={<ProtectedRoute role="usuario"><DashboardUsuario /></ProtectedRoute>} />
                <Route path="/oficial" element={<ProtectedRoute role="oficial"><DashboardOficial /></ProtectedRoute>} />
                <Route path="/juez" element={<ProtectedRoute role="juez"><DashboardJuez /></ProtectedRoute>} />
                <Route path="/admin" element={<ProtectedRoute role="admin"><DashboardAdmin /></ProtectedRoute>} />

                {/* Otras funcionalidades */}
                <Route path="/crear-multa" element={<ProtectedRoute role="oficial"><CrearMulta /></ProtectedRoute>} />
                <Route path="/iniciar-disputa" element={<ProtectedRoute role="usuario"><IniciarDisputa /></ProtectedRoute>} />
                <Route path="/disputas-juez" element={<ProtectedRoute role="juez"><ListaDisputasJuez /></ProtectedRoute>} />
                
                {/* Catálogo de infracciones */}
                <Route path="/catalogo-infracciones" element={<CatalogoInfracciones />} />
            </Routes>
        </Router>
    );
}

export default App;

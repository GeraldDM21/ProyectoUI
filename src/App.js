import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import HomePage from './components/HomePage';
import Login from './components/Login';
import ForgotPassword from './components/ForgotPassword';
import Register from './components/Register';
import NextCodeSolutions from './components/NextCodeSolutions';
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
import MisMultasCreadas from './components/MisMultasCreadas'; 
import VerDisputas from './components/VerDisputas'; 
import VerDisputasJuez from './components/VerDisputasJuez';
import ResolverDisputas from './components/ResolverDisputas'; 
import ProtectedRoute from './components/ProtectedRoute';
import { Cloudinary } from '@cloudinary/url-gen';
import { auto } from '@cloudinary/url-gen/actions/resize';
import { autoGravity } from '@cloudinary/url-gen/qualifiers/gravity';
import { AdvancedImage } from '@cloudinary/react';

function App() {
    return (
        <Router>
            <Routes>
                {/* Rutas públicas */}
                <Route path="/" element={<HomePage />} />
                <Route path="/login" element={<Login />} />
                <Route path="/forgot-password" element={<ForgotPassword />} />
                <Route path="/register" element={<Register />} />
                <Route path="/NextCodeSolutions" element={<NextCodeSolutions />} />

                {/* Dashboard para cada rol */}
                <Route path="/admin" element={<ProtectedRoute role="Administrativo"><DashboardAdmin /></ProtectedRoute>} />
                <Route path="/usuario" element={<ProtectedRoute role="UsuarioFinal"><DashboardUsuarioFinal /></ProtectedRoute>} />
                <Route path="/oficial" element={<ProtectedRoute role="Oficial"><DashboardOficial /></ProtectedRoute>} />
                <Route path="/juez" element={<ProtectedRoute role="Juez"><DashboardJuez /></ProtectedRoute>} />

                {/* Funcionalidades específicas para cada rol */}
                <Route path="/catalogo-infracciones" element={<ProtectedRoute role="Administrativo"><CatalogoInfracciones /></ProtectedRoute>} />
                <Route path="/catalogo-infracciones-oficial" element={<ProtectedRoute role="Oficial"><CatalogoInfraccionesOficial /></ProtectedRoute>} />
                <Route path="/crear-usuario" element={<ProtectedRoute role="Administrativo"><GestionUsuariosAdmin /></ProtectedRoute>} />
                <Route path="/roles" element={<ProtectedRoute role="Administrativo"><GestionRoles /></ProtectedRoute>} />
                <Route path="/perfil" element={<ProtectedRoute role={["Juez", "UsuarioFinal", "Oficial", "Administrativo"]}><Perfil /></ProtectedRoute>} />
                
                {/* Funcionalidades para oficial */}
                <Route path="/crear-multa" element={<ProtectedRoute role="Oficial"><CrearMulta /></ProtectedRoute>} />
                <Route path="/mis-multas-creadas" element={<ProtectedRoute role="Oficial"><MisMultasCreadas /></ProtectedRoute>} /> {/* Nueva Ruta */}

                {/* Funcionalidades para usuario final */}
                <Route path="/ver-multas" element={<ProtectedRoute role="UsuarioFinal"><VerMultas /></ProtectedRoute>} />
                <Route path="/iniciar-disputa" element={<ProtectedRoute role="UsuarioFinal"><CreacionDisputa /></ProtectedRoute>} />
                
                {/* Funcionalidades compartidas entre usuario final y juez */}
                <Route path="/ver-disputas" element={<ProtectedRoute role={["UsuarioFinal"]}><VerDisputas /></ProtectedRoute>} /> {/* Ver disputas */}
                
                {/* Funcionalidades exclusivas para juez */}
                <Route path="/ver-disputas-juez" element={<ProtectedRoute role="Juez"><VerDisputasJuez /></ProtectedRoute>} /> {/* Ver disputas */}
                <Route path="/resolver-disputas" element={<ProtectedRoute role="Juez"><ResolverDisputas /></ProtectedRoute>} /> {/* Resolver disputas */}

            </Routes>
        </Router>
    );
}

const Cloud = () => {
    const cld = new Cloudinary({ cloud: { cloudName: 'dvdag5roy' } });
    
    // Use this sample image or upload your own via the Media Explorer
    const img = cld
          .image('cld-sample-5')
          .format('auto') // Optimize delivery by resizing and applying auto-format and auto-quality
          .quality('auto')
          .resize(auto().gravity(autoGravity()).width(500).height(500)); // Transform the image: auto-crop to square aspect_ratio
  
    return (<AdvancedImage cldImg={img}/>);
  };
  

export default App;
export { Cloud };

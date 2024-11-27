import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import React, { useEffect, useState } from 'react';
import { FaDollarSign, FaExclamationCircle } from 'react-icons/fa';
import '../Styles/VerMultas.css';
import { useNavigate } from 'react-router-dom';
import HeaderUsuario from './HeaderUsuario'; // Importamos HeaderUsuario

function VerMultas() {
    const [multas, setMultas] = useState([]);
    const [disputas, setDisputas] = useState([]);
    const [error, setError] = useState('');
    const [infracciones, setInfracciones] = useState([]);
    const [pastMultas, setPastMultas] = useState([]);
    const [filtroPendientes, setFiltroPendientes] = useState(''); // Filtro para multas pendientes
    const [filtroPasadas, setFiltroPasadas] = useState(''); // Filtro para multas pasadas
    const userId = localStorage.getItem('userId');
    const navigate = useNavigate();

    useEffect(() => {
        fetchMultas();
        fetchInfracciones();
        fetchDisputas();
        fetchPastMultas();
    }, []);

    // Función para obtener las multas desde el backend
    const fetchMultas = async () => {
        try {
            const response = await fetch(`https://localhost:7201/api/Multas/IdInfractor/${userId}/NotResolved`);
            if (!response.ok) {
                throw new Error('Error al cargar las multas');
            }
            const data = await response.json();
            setMultas(data);
        } catch (error) {
            console.error('Error al cargar multas:', error);
            toast.error('No se pudo cargar las multas.');
        }
    };

    // Función para obtener las infracciones desde el backend
    const fetchInfracciones = async () => {
        try {
            const response = await fetch('https://localhost:7201/api/CatalogoInfracciones');
            if (!response.ok) {
                throw new Error('Error al cargar las infracciones');
            }
            const data = await response.json();
            setInfracciones(data);
        } catch (error) {
            console.error('Error al cargar infracciones:', error);
        }
    };

    // Función para obtener las disputas desde el backend
    const fetchDisputas = async () => {
        try {
            const response = await fetch(`https://localhost:7201/api/Disputas/IdInfractor/${userId}`);
            if (!response.ok) {
                throw new Error('Error al cargar las disputas');
            }
            const data = await response.json();
            setDisputas(data);
        } catch (error) {
            console.error('Error al cargar disputas:', error);
        }
    };

    // Función para obtener las multas pasadas desde el backend
    const fetchPastMultas = async () => {
        try {
            const response = await fetch(`https://localhost:7201/api/Multas/IdInfractor/${userId}/Resolved`);
            if (!response.ok) {
                throw new Error('Error al cargar las multas pasadas');
            }
            const data = await response.json();
            setPastMultas(data);
        } catch (error) {
            console.error('Error al cargar multas pasadas:', error);
        }
    };

    // Función para manejar el pago de una multa
    const handlePago = (multa) => {
        navigate('/pago', { state: { multa } });
    };

    // Función para crear una disputa para una multa
    const handleDisputa = (multa) => {
        const existingDisputa = disputas.find(disputa => disputa.idMulta === multa.id);
        if (existingDisputa) {
            toast.warn('Ya existe una disputa para esta multa.');
        } else {
            navigate('/iniciar-disputa', { state: { multa } });
        }
    };

    // Filtrar multas pendientes
    const multasPendientesFiltradas = multas.filter((multa) =>
        `${multa.cedulaInfractor} ${multa.nombreInfractor} ${multa.apellidoInfractor}`
            .toLowerCase()
            .includes(filtroPendientes.toLowerCase())
    );

    // Filtrar multas pasadas
    const multasPasadasFiltradas = pastMultas.filter((multa) =>
        `${multa.cedulaInfractor} ${multa.nombreInfractor} ${multa.apellidoInfractor}`
            .toLowerCase()
            .includes(filtroPasadas.toLowerCase())
    );

    return (
        <div className="ver-multas-page">
            <HeaderUsuario />

            <div className="ver-multas-container">
                <h2><FaExclamationCircle /> Mis Multas Pendientes</h2>
                <input
                    type="text"
                    placeholder="Buscar en multas pendientes..."
                    value={filtroPendientes}
                    onChange={(e) => setFiltroPendientes(e.target.value)}
                    className="filtro-input"
                />
                <table className="multas-table">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Cédula</th>
                            <th>Nombre</th>
                            <th>Apellido</th>
                            <th>Fecha</th>
                            <th>Placas</th>
                            <th>Infracciones</th>
                            <th>Monto Total</th>
                            <th>Pagada</th>
                            <th>Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {multasPendientesFiltradas.length > 0 ? (
                            multasPendientesFiltradas.map((multa) => (
                                <tr key={multa.id}>
                                    <td>{multa.id}</td>
                                    <td>{multa.cedulaInfractor}</td>
                                    <td>{multa.nombreInfractor}</td>
                                    <td>{multa.apellidoInfractor}</td>
                                    <td>{new Date(multa.fecha).toLocaleDateString()}</td>
                                    <td>{multa.multaPlacas.map(placa => placa.placasId).join(', ')}</td>
                                    <td>
                                        {multa.infraccionMultas.map(infraccion => {
                                            const infraccionDetail = infracciones.find(i => i.id === infraccion.catalogoInfraccionesId);
                                            return infraccionDetail ? infraccionDetail.nombre : infraccion.catalogoInfraccionesId;
                                        }).join(', ')}
                                    </td>
                                    <td>{`₡${(multa.total ?? 0).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}</td>
                                    <td>{multa.pagada ? 'Sí' : 'No'}</td>
                                    <td>
                                        <button onClick={() => handlePago(multa)}>Pagar</button>
                                        <button onClick={() => handleDisputa(multa)}>Disputar</button>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="10">No hay multas disponibles</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            <div className="ver-multas-container">
                <h2><FaDollarSign /> Mis Multas Pasadas</h2>
                <input
                    type="text"
                    placeholder="Buscar en multas pasadas..."
                    value={filtroPasadas}
                    onChange={(e) => setFiltroPasadas(e.target.value)}
                    className="filtro-input"
                />
                <table className="multas-table">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Cédula</th>
                            <th>Nombre</th>
                            <th>Apellido</th>
                            <th>Fecha</th>
                            <th>Placas</th>
                            <th>Infracciones</th>
                            <th>Monto Total</th>
                            <th>Pagada</th>
                        </tr>
                    </thead>
                    <tbody>
                        {multasPasadasFiltradas.length > 0 ? (
                            multasPasadasFiltradas.map((multa) => (
                                <tr key={multa.id}>
                                    <td>{multa.id}</td>
                                    <td>{multa.cedulaInfractor}</td>
                                    <td>{multa.nombreInfractor}</td>
                                    <td>{multa.apellidoInfractor}</td>
                                    <td>{new Date(multa.fecha).toLocaleDateString()}</td>
                                    <td>{multa.multaPlacas.map(placa => placa.placasId).join(', ')}</td>
                                    <td>
                                        {multa.infraccionMultas.map(infraccion => {
                                            const infraccionDetail = infracciones.find(i => i.id === infraccion.catalogoInfraccionesId);
                                            return infraccionDetail ? infraccionDetail.nombre : infraccion.catalogoInfraccionesId;
                                        }).join(', ')}
                                    </td>
                                    <td>{`₡${(multa.total ?? 0).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}</td>
                                    <td>{multa.pagada ? 'Sí' : 'No'}</td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="9">No hay multas pasadas disponibles</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
            <ToastContainer />
        </div>
    );
}

export default VerMultas;

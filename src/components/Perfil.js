import React, { useState, useEffect } from 'react';
import { FaUser, FaEnvelope, FaPhone, FaCamera, FaLock } from 'react-icons/fa';
import LogoutButton from './LogoutButton'; // Componente de logout existente
import '../Styles/Perfil.css';

function Perfil() {
    const [nombre, setNombre] = useState('');
    const [apellido, setApellido] = useState('');
    const [correo, setCorreo] = useState('');
    const [telefono, setTelefono] = useState('');
    const [fotoPerfil, setFotoPerfil] = useState(null); // Foto de perfil actual
    const [nuevaFoto, setNuevaFoto] = useState(null); // Nueva foto seleccionada
    const [mensaje, setMensaje] = useState('');
    const userId = localStorage.getItem('userId'); 

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const response = await fetch(`https://localhost:7201/api/usuarios/${userId}`);
                if (response.ok) {
                    const data = await response.json();
                    setNombre(data.nombre);
                    setApellido(data.apellido);
                    setCorreo(data.correo);
                    setTelefono(data.telefono);
                    setFotoPerfil(data.fotoPerfil); // Cargar la foto de perfil desde la API
                } else {
                    throw new Error('No se pudo cargar la información del perfil.');
                }
            } catch (error) {
                console.error(error);
            }
        };
        fetchUserData();
    }, []);

    const handleUpdateProfile = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch(`https://localhost:7201/api/usuarios/${userId}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ nombre, apellido, correo, telefono }),
            });

            if (response.ok) {
                setMensaje('Perfil actualizado con éxito.');
            } else {
                throw new Error('No se pudo actualizar el perfil.');
            }
        } catch (error) {
            setMensaje(error.message);
        }
    };

    const handleFotoChange = (e) => {
        setNuevaFoto(e.target.files[0]);
    };

    const handleFotoUpload = async () => {
        const formData = new FormData();
        formData.append('file', nuevaFoto);

        try {
            const response = await fetch(`https://localhost:7201/api/usuarios/${userId}/fotoPerfil`, {
                method: 'POST',
                body: formData,
            });

            if (response.ok) {
                setMensaje('Foto de perfil actualizada con éxito.');
                setFotoPerfil(URL.createObjectURL(nuevaFoto));
                setNuevaFoto(null); // Limpiar la nueva foto
            } else {
                throw new Error('No se pudo actualizar la foto de perfil.');
            }
        } catch (error) {
            setMensaje(error.message);
        }
    };

    return (
        <div className="dashboard-layout">
            <aside className="sidebar">
                <h2>Mi Perfil</h2>
                {/* Foto de perfil e información personal en la barra lateral */}
                <div className="perfil-sidebar">
                    <img src={fotoPerfil || 'https://via.placeholder.com/100'} alt="Foto de perfil" className="foto-perfil-lateral" />
                    <p><strong>{nombre} {apellido}</strong></p>
                    <p><FaEnvelope /> {correo}</p>
                    <p><FaPhone /> {telefono}</p>
                </div>
                <LogoutButton /> {/* Botón de cerrar sesión */}
            </aside>

            <main className="main-content">
                <header className="content-header">
                    <h2>Configuración de Perfil</h2>
                </header>
                <div className="content-body">
                    {/* Foto de perfil con opción de actualización */}
                    <div className="foto-perfil">
                        <img src={fotoPerfil || 'https://via.placeholder.com/150'} alt="Foto de perfil" />
                        <input type="file" onChange={handleFotoChange} />
                        <button onClick={handleFotoUpload} className="btn-upload">Actualizar Foto</button>
                    </div>

                    {/* Formulario de edición de perfil */}
                    <form onSubmit={handleUpdateProfile} className="perfil-form">
                        <div className="form-group">
                            <label>Nombre</label>
                            <input
                                type="text"
                                className="form-control"
                                value={nombre}
                                onChange={(e) => setNombre(e.target.value)}
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label>Apellido</label>
                            <input
                                type="text"
                                className="form-control"
                                value={apellido}
                                onChange={(e) => setApellido(e.target.value)}
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label>Correo Electrónico</label>
                            <input
                                type="email"
                                className="form-control"
                                value={correo}
                                onChange={(e) => setCorreo(e.target.value)}
                                required
                                readOnly
                            />
                        </div>
                        <div className="form-group">
                            <label>Teléfono</label>
                            <input
                                type="tel"
                                className="form-control"
                                value={telefono}
                                onChange={(e) => setTelefono(e.target.value)}
                                required
                            />
                        </div>
                        <button type="submit" className="btn btn-primary">Guardar Cambios</button>
                    </form>

                    {/* Cambiar Contraseña */}
                    <div className="cambiar-password">
                        <h3>Opciones de Seguridad</h3>
                        <button className="btn btn-secondary">Cambiar Contraseña</button>
                    </div>

                    {mensaje && <p className="text-info">{mensaje}</p>}
                </div>
            </main>
        </div>
    );
}

export default Perfil;

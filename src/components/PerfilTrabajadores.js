import React, { useState, useEffect } from 'react';
import { FaUser, FaEnvelope, FaPhone, FaCamera, FaLock } from 'react-icons/fa';
import LogoutButton from './LogoutButton'; // Componente de logout existente
import UploadWidget from './UploadWidget'; // Import the Cloudinary UploadWidget
import Swal from 'sweetalert2';
import '../Styles/Perfil.css';

function Perfil() {
    const [userData, setUserData] = useState({
        id: '',
        cedula: '',
        nombre: '',
        apellido: '',
        correo: '',
        telefono: '',
        fotoCedula: '',
        fotoPerfil: '',
        idRol: '',
        placas: []
    });
    const [mensaje, setMensaje] = useState('');
    const userId = localStorage.getItem('userId'); 

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const response = await fetch(`https://localhost:7201/api/usuarios/${userId}`);
                if (response.ok) {
                    const data = await response.json();
                    setUserData(data);
                } else {
                    throw new Error('No se pudo cargar la información del perfil.');
                }
            } catch (error) {
                console.error(error);
            }
        };
        fetchUserData();
    }, [userId]);

    const handleUpdateProfile = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch(`https://localhost:7201/api/usuarios/${userId}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(userData),
            });

            if (response.ok) {
                console.log(userData);
                alert('Perfil actualizado con éxito.');
                window.location.reload();
            } else {
                throw new Error('No se pudo actualizar el perfil.');
            }
        } catch (error) {
            setMensaje(error.message);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setUserData(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    const handleChangePassword = () => {
        Swal.fire({
            title: 'Cambiar Contraseña',
            html: `
                <input type="password" id="new-password" class="swal2-input" placeholder="Contraseña Nueva" />
                <input type="password" id="confirm-password" class="swal2-input" placeholder="Confirmar Contraseña" />
            `,
            showCancelButton: true,
            cancelButtonText: 'Cancelar',
            confirmButtonText: 'Guardar Contraseña',
            customClass: {
                confirmButton: 'swal2-guardar-button'
            },
            preConfirm: () => {
                const newPassword = document.getElementById('new-password').value;
                const confirmPassword = document.getElementById('confirm-password').value;

                if (newPassword !== confirmPassword) {
                    Swal.showValidationMessage('Las contraseñas no coinciden');
                    return false;
                }

                return { newPassword };
            }
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    const response = await fetch(`https://localhost:7201/api/Auth/UpdatePassword?userName=${encodeURIComponent(userData.correo)}&newPassword=${encodeURIComponent(result.value.newPassword)}`, {
                        method: 'PUT',
                        headers: { 'Content-Type': 'application/json' }
                    });

                    if (response.ok) {
                        Swal.fire('Contraseña actualizada con éxito', '', 'success');
                    } else {
                        throw new Error('No se pudo actualizar la contraseña.');
                    }
                } catch (error) {
                    Swal.fire('Error', error.message, 'error');
                }
            }
        });
    };

    return (
        <div className="dashboard-layout-perfil">
            <aside className="sidebar-perfil">
                <h2>Mi Perfil</h2>
                {/* Foto de perfil e información personal en la barra lateral */}
                <div className="perfil-sidebar">
                    <img src={userData.fotoPerfil || 'https://via.placeholder.com/100'} alt="Foto de perfil" className="foto-perfil-lateral" />
                    <p><strong>{userData.nombre} {userData.apellido}</strong></p>
                    <p><FaEnvelope /> {userData.correo}</p>
                    <p><FaPhone /> {userData.telefono}</p>
                </div>
                <LogoutButton /> {/* Botón de cerrar sesión */}
            </aside>

            <main className="main-content-perfil">
                <div className="content-body-perfil">
                    {/* Foto de perfil con opción de actualización */}
                    <div className="foto-perfil">
                        <img src={userData.fotoPerfil || 'https://via.placeholder.com/150'} alt="Foto de perfil" />
                        <UploadWidget onUpload={(url) => setUserData(prevState => ({ ...prevState, fotoPerfil: url }))} /> {/* Cloudinary Upload Widget */}
                    </div>

                    {/* Formulario de edición de perfil */}
                    <form onSubmit={handleUpdateProfile} className="perfil-form">
                        <div className="form-group-perfil">
                            <label>Nombre</label>
                            <input
                                type="text"
                                className="form-control-perfil"
                                name="nombre"
                                value={userData.nombre}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <div className="form-group-perfil">
                            <label>Apellido</label>
                            <input
                                type="text"
                                className="form-control-perfil"
                                name="apellido"
                                value={userData.apellido}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <div className="form-group-perfil">
                            <label>Teléfono</label>
                            <input
                                type="tel"
                                className="form-control-perfil"
                                name="telefono"
                                value={userData.telefono}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <div className="form-group-perfil">
                            <button type="submit" className="btn-primary-perfil">Guardar Cambios</button>
                        </div>
                    </form>

                    {/* Cambiar Contraseña */}
                    <div className="cambiar-password">
                        <h3>Opciones de Seguridad</h3>
                        <button className="btn btn-secondary-perfil" onClick={handleChangePassword}>Cambiar Contraseña</button>
                    </div>

                    {mensaje && <p className="text-info-perfil">{mensaje}</p>}
                </div>
            </main>
        </div>
    );
}

export default Perfil;
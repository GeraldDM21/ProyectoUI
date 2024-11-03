import React, { useState } from 'react';
import { FaUserPlus, FaUser, FaIdCard, FaEnvelope, FaLock, FaPhoneAlt, FaBriefcase } from 'react-icons/fa';
import '../Styles/GestionUsuariosAdmin.css';

function GestionUsuariosAdmin() {
    const [cedula, setCedula] = useState('');
    const [nombre, setNombre] = useState('');
    const [apellido, setApellido] = useState('');
    const [correo, setCorreo] = useState('');
    const [contrasena, setContrasena] = useState('');
    const [telefono, setTelefono] = useState('');
    const [fotoCedula, setFotoCedula] = useState(null);
    const [rol, setRol] = useState('');
    const [message, setMessage] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append("Cedula", cedula);
        formData.append("Nombre", nombre);
        formData.append("Apellido", apellido);
        formData.append("Correo", correo);
        formData.append("Contrasena", contrasena);
        formData.append("Telefono", telefono);
        formData.append("FotoCedula", fotoCedula);
        formData.append("Rol", rol);

        try {
            const response = await fetch('https://localhost:7201/api/usuarios', {
                method: 'POST',
                body: formData
            });

            if (response.ok) {
                setMessage("Usuario creado exitosamente.");
                setCedula('');
                setNombre('');
                setApellido('');
                setCorreo('');
                setContrasena('');
                setTelefono('');
                setFotoCedula(null);
                setRol('');
            } else {
                setMessage("Error al crear el usuario.");
            }
        } catch (error) {
            setMessage("Error de conexión con el servidor.");
            console.error(error);
        }
    };

    return (
        <div className="crear-usuario-background">
            <div className="shape-background"></div>
            <div className="crear-usuario-container">
                <div className="profile-image">
                    <FaUserPlus size={50} />
                </div>
                <h2>Crear Usuario Administrativo</h2>
                <form onSubmit={handleSubmit}>
                    <div className="input-icon">
                        <FaIdCard className="icon" />
                        <input
                            type="text"
                            placeholder="Cédula"
                            value={cedula}
                            onChange={(e) => setCedula(e.target.value)}
                            required
                        />
                    </div>
                    <div className="input-icon">
                        <FaUser className="icon" />
                        <input
                            type="text"
                            placeholder="Nombre"
                            value={nombre}
                            onChange={(e) => setNombre(e.target.value)}
                            required
                        />
                    </div>
                    <div className="input-icon">
                        <FaUser className="icon" />
                        <input
                            type="text"
                            placeholder="Apellido"
                            value={apellido}
                            onChange={(e) => setApellido(e.target.value)}
                            required
                        />
                    </div>
                    <div className="input-icon">
                        <FaEnvelope className="icon" />
                        <input
                            type="email"
                            placeholder="Correo Electrónico"
                            value={correo}
                            onChange={(e) => setCorreo(e.target.value)}
                            required
                        />
                    </div>
                    <div className="input-icon">
                        <FaLock className="icon" />
                        <input
                            type="password"
                            placeholder="Contraseña"
                            value={contrasena}
                            onChange={(e) => setContrasena(e.target.value)}
                            required
                        />
                    </div>
                    <div className="input-icon">
                        <FaPhoneAlt className="icon" />
                        <input
                            type="tel"
                            placeholder="Teléfono"
                            value={telefono}
                            onChange={(e) => setTelefono(e.target.value)}
                            required
                        />
                    </div>
                    <label>Foto de Cédula:</label>
                    <input
                        type="file"
                        onChange={(e) => setFotoCedula(e.target.files[0])}
                        required
                    />
                    <div className="input-icon">
                        <FaBriefcase className="icon" />
                        <select value={rol} onChange={(e) => setRol(e.target.value)} required>
                            <option value="">Seleccione un rol</option>
                            <option value="Admin">Admin</option>
                            <option value="Juez">Juez</option>
                            <option value="Oficial">Oficial</option>
                            <option value="Usuario">Usuario</option>
                        </select>
                    </div>
                    <button type="submit" className="btn-submit">Agregar Usuario</button>
                </form>
                {message && <p className="message">{message}</p>}
            </div>
        </div>
    );
}

export default GestionUsuariosAdmin;

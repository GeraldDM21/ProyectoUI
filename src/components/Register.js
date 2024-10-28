import React, { useState } from 'react';
import AuthFormContainer from './AuthFormContainer';

function Register() {
    const [cedula, setCedula] = useState('');
    const [nombre, setNombre] = useState('');
    const [apellido, setApellido] = useState('');
    const [correo, setCorreo] = useState('');
    const [contrasena, setContrasena] = useState('');
    const [telefono, setTelefono] = useState('');
    const [fotoCedula, setFotoCedula] = useState(null);
    const [fotoPerfil, setFotoPerfil] = useState(null);
    const [message, setMessage] = useState('');

    const handleRegister = async (e) => {
        e.preventDefault();
        // Aquí puedes manejar la lógica de envío al backend
        setMessage('Registro exitoso.');
    };

    return (
        <div className="login-background">
            <div className="shape-background"></div>
            <AuthFormContainer title="Registro">
                <form onSubmit={handleRegister}>
                    <div className="form-group input-icon">
                        <i className="fas fa-id-card"></i>
                        <input
                            type="text"
                            className="form-control"
                            placeholder="Cédula"
                            value={cedula}
                            onChange={(e) => setCedula(e.target.value)}
                            required
                        />
                    </div>
                    <div className="form-group input-icon">
                        <i className="fas fa-user"></i>
                        <input
                            type="text"
                            className="form-control"
                            placeholder="Nombre"
                            value={nombre}
                            onChange={(e) => setNombre(e.target.value)}
                            required
                        />
                    </div>
                    <div className="form-group input-icon">
                        <i className="fas fa-user"></i>
                        <input
                            type="text"
                            className="form-control"
                            placeholder="Apellido"
                            value={apellido}
                            onChange={(e) => setApellido(e.target.value)}
                            required
                        />
                    </div>
                    <div className="form-group input-icon">
                        <i className="fas fa-envelope"></i>
                        <input
                            type="email"
                            className="form-control"
                            placeholder="Correo Electrónico"
                            value={correo}
                            onChange={(e) => setCorreo(e.target.value)}
                            required
                        />
                    </div>
                    <div className="form-group input-icon">
                        <i className="fas fa-lock"></i>
                        <input
                            type="password"
                            className="form-control"
                            placeholder="Contraseña"
                            value={contrasena}
                            onChange={(e) => setContrasena(e.target.value)}
                            required
                        />
                    </div>
                    <div className="form-group input-icon">
                        <i className="fas fa-phone"></i>
                        <input
                            type="tel"
                            className="form-control"
                            placeholder="Teléfono"
                            value={telefono}
                            onChange={(e) => setTelefono(e.target.value)}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label>Foto de Cédula</label>
                        <input
                            type="file"
                            className="form-control-file"
                            onChange={(e) => setFotoCedula(e.target.files[0])}
                        />
                    </div>
                    <div className="form-group">
                        <label>Foto de Perfil</label>
                        <input
                            type="file"
                            className="form-control-file"
                            onChange={(e) => setFotoPerfil(e.target.files[0])}
                        />
                    </div>
                    <button type="submit" className="btn-login">Registrarse</button>
                    {message && <p className="text-info mt-3">{message}</p>}
                </form>
            </AuthFormContainer>
        </div>
    );
}

export default Register;

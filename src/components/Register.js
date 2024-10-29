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

        const convertirBase64 = (file) => {
            return new Promise((resolve, reject) => {
                const fileReader = new FileReader();
                fileReader.readAsDataURL(file);
                fileReader.onload = () => {
                    resolve(fileReader.result.split(',')[1]);
                };
                fileReader.onerror = (error) => {
                    reject(error);
                };
            });
        };

        // Aquí puedes manejar la lógica de envío al backend
        try {
            const usuarioFinal = {
                cedula,
                nombre,
                apellido,
                email: correo,
                password: contrasena,
                telefono,
                fotoCedula: await convertirBase64(fotoCedula),
                fotoPerfil: await convertirBase64(fotoPerfil),
                idRol: 1
            };

            console.log(usuarioFinal);

            const response = await fetch('https://localhost:7201/api/Auth/Register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Accept: 'application/json',
                },
                body: JSON.stringify(usuarioFinal) // Aquí se envía el objeto FormData
            });

            if (!response.ok) {
                throw new Error('Error al registrar el usuario.');
            }
        } catch (error) {
            setMessage(error.message);
            return;
        }

        setMessage('Registro exitoso.');

        setCedula('');
        setNombre('');
        setApellido('');
        setCorreo('');
        setContrasena('');
        setTelefono('');
        setFotoCedula(null);
        setFotoPerfil(null);
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
                        <label className="file-label">Foto de Cédula</label>
                        <input
                            type="file"
                            className="form-control-file"
                            onChange={(e) => setFotoCedula(e.target.files[0])}
                        />
                    </div>
                    <div className="form-group">
                        <label className="file-label">Foto de Perfil</label>
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

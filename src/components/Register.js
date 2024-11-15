import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';  // Importa los estilos de react-toastify
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from './Header'; // Importa el Header
import AuthFormContainer from './AuthFormContainer';
import UploadWidget from './UploadWidget';

function Register() {
    const [cedula, setCedula] = useState('');
    const [nombre, setNombre] = useState('');
    const [apellido, setApellido] = useState('');
    const [correo, setCorreo] = useState('');
    const [contrasena, setContrasena] = useState('');
    const [telefono, setTelefono] = useState('');
    const [fotoCedula, setFotoCedula] = useState(null);
    const [fotoPerfil, setFotoPerfil] = useState(null);
    const [numPlaca, setPlaca] = useState('');
    const [alertMessage, setAlertMessage] = useState('');
    const [alertType, setAlertType] = useState('');
    const navigate = useNavigate();

    // Función para mostrar alertas
    const showAlert = (message, type) => {
        setAlertMessage(message);
        setAlertType(type);
        setTimeout(() => {
            setAlertMessage('');
        }, 5000); // La alerta desaparece después de 5 segundos
    };

    // Lógica de registro
    const handleRegister = async (e) => {
        e.preventDefault();

        // Aquí puedes manejar la lógica de envío al backend
        try {
            const usuarioFinal = {
                cedula,
                nombre,
                apellido,
                email: correo,
                password: contrasena,
                telefono,
                fotoCedula,
                fotoPerfil,
                idRol: 1,
                placas: [
                    {
                        id: numPlaca,
                    }
                ]
            };

            console.log(usuarioFinal);

            const response = await fetch('https://localhost:7201/api/Auth/Register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Accept: 'application/json',
                },
                body: JSON.stringify(usuarioFinal)
            });

            if (response.ok) {
              //  showAlert('¡Registro exitoso!', 'success');
                toast.succes('¡Registro exitoso!', 'success');
                navigate('/login');
            } else {
                //showAlert('Error al registrar el usuario.', 'error');
                toast.error('Error al registrar el usuario.', 'error');
            }
        } catch (error) {
            console.log(error);
          //  showAlert('Hubo un error con la solicitud. Intenta de nuevo más tarde.', 'error');
            toast.error('Hubo un error con la solicitud. Intenta de nuevo más tarde.', 'error');
        }

        // Limpiar los campos después de enviar el formulario
        setCedula('');
        setNombre('');
        setApellido('');
        setCorreo('');
        setContrasena('');
        setTelefono('');
        setPlaca('');
        setFotoCedula(null);
        setFotoPerfil(null);
    };

    return (
        <div className="login-background">
            <div className="shape-background"></div>
            
            {/* Agregar el Header aquí */}
            <Header />

            {/* Mostrar alerta aquí */}
            {alertMessage && (
                <div className={`alert ${alertType === 'success' ? 'alert-success' : 'alert-error'}`}>
                    {alertMessage}
                </div>
            )}

            <AuthFormContainer title="Registro">
                <form onSubmit={handleRegister}>
                    <div className="form-group-login input-icon">
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
                    <div className="form-group-login input-icon">
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
                    <div className="form-group-login input-icon">
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
                    <div className="form-group-login input-icon">
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
                    <div className="form-group-login input-icon">
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
                    <div className="form-group-login input-icon">
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
                    <div className="form-group-login input-icon">
                        <i className="fas fa-id-card"></i>
                        <input
                            type="text"
                            className="form-control"
                            placeholder="Número de Placa"
                            value={numPlaca}
                            onChange={(e) => setPlaca(e.target.value)}
                            required
                        />
                    </div>
                    <div className="form-group-login">
                        <label className="file-label">Foto de Cédula</label>
                        <UploadWidget onUpload={setFotoCedula} />
                    </div>
                    <div className="form-group-login">
                        <label className="file-label">Foto de Perfil</label>
                        <UploadWidget onUpload={setFotoPerfil} />
                    </div>
                    <button type="submit" className="btn-login">Registrarse</button>
                </form>
            </AuthFormContainer>
        </div>
    );
}

export default Register;
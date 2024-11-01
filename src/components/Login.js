import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
//import AuthFormContainer from './AuthFormContainer';

function Login() {
    const [userName, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch('https://localhost:7201/api/Auth/Login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ userName, password }),
            });

            if (!response.ok) {
                alert('Usuario o contraseña incorrectos');
            }

            const data = await response.json();
            localStorage.setItem('token', data.token);
            localStorage.setItem('role', data.role);

            // Navegar según el rol del usuario
            if (data.role === 'Administrativo') {
                navigate('/admin');
            } else if (data.role === 'UsuarioFinal') {
                navigate('/usuario');
            } else if (data.role === 'Oficial') {
                navigate('/oficial');
            } else if (data.role === 'Juez') {
                navigate('/juez');
            }
        } catch (error) {
            setError(error.message);
        }
    };

    return (
        <div className="login-background">
            <div className="shape-background"></div>
            <div className="login-container">
                <div className="profile-image">
                    <i className="fas fa-user-circle"></i>
                </div>
                <div className="login-header">
                    <h2>Mi Cuenta</h2>
                </div>
                <form onSubmit={handleLogin}>
                    <div className="form-group">
                        <div className="input-icon">
                            <i className="fas fa-user"></i>
                            <input
                                type="email"
                                placeholder="Correo electrónico"
                                className="form-control"
                                value={userName}
                                onChange={(e) => setUsername(e.target.value)}
                                required
                            />
                        </div>
                    </div>
                    <div className="form-group">
                        <div className="input-icon">
                            <i className="fas fa-lock"></i>
                            <input
                                type="password"
                                placeholder="Contraseña"
                                className="form-control"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                        </div>
                    </div>
                    {error && <p className="text-danger">{error}</p>}
                    <button type="submit" className="btn-login">Iniciar Sesión</button>
                    <button
                        type="button"
                        className="btn-link"
                        onClick={() => navigate('/forgot-password')}
                    >
                        ¿Olvidaste tu contraseña?
                    </button>
                </form>
            </div>
        </div>
    );
}

export default Login;

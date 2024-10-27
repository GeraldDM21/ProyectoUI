import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

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
                throw new Error('Usuario o contraseña incorrectos');
            }

            const data = await response.json();
            localStorage.setItem('token', data.token);
            localStorage.setItem('role', data.role);

            // Navegar según el rol del usuario
            if (data.role === 'admin') {
                navigate('/admin');
            } else if (data.role === 'User') {
                navigate('/usuario');
            } else if (data.role === 'oficial') {
                navigate('/oficial');
            } else if (data.role === 'juez') {
                navigate('/juez');
            }
        } catch (error) {
            setError(error.message);
        }
    };

    return (
        <div className="container mt-5">
            <h2>Iniciar Sesión</h2>
            <form onSubmit={handleLogin}>
                <div className="form-group">
                    <label>Nombre de Usuario</label>
                    <input
                        type="text"
                        className="form-control"
                        value={userName}
                        onChange={(e) => setUsername(e.target.value)}
                        required
                    />
                </div>
                <div className="form-group">
                    <label>Contraseña</label>
                    <input
                        type="password"
                        className="form-control"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                </div>
                {error && <p className="text-danger">{error}</p>}
                <button type="submit" className="btn btn-primary">Iniciar Sesión</button>
            </form>
        </div>
    );
}

export default Login;

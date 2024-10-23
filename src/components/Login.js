import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function Login() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleLogin = (e) => {
        e.preventDefault();
        // Aquí harías la validación real en el backend
        if (username === 'admin' && password === 'admin123') {
            localStorage.setItem('token', 'user-token');
            localStorage.setItem('role', 'admin');
            navigate('/admin');
        } else if (username === 'usuario' && password === 'usuario123') {
            localStorage.setItem('token', 'user-token');
            localStorage.setItem('role', 'usuario');
            navigate('/usuario');
        } else if (username === 'oficial' && password === 'oficial123') {
            localStorage.setItem('token', 'user-token');
            localStorage.setItem('role', 'oficial');
            navigate('/oficial');
        } else if (username === 'juez' && password === 'juez123') {
            localStorage.setItem('token', 'user-token');
            localStorage.setItem('role', 'juez');
            navigate('/juez');
        } else {
            setError('Usuario o contraseña incorrectos');
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
                        value={username}
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

import React, { useState } from 'react';
import AuthFormContainer from './AuthFormContainer'; // Usando el mismo contenedor reutilizable

function ForgotPassword() {
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');

    const handleForgotPassword = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch('https://localhost:7201/api/Auth/ForgotPassword', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email }),
            });

            if (!response.ok) {
                throw new Error('No se pudo enviar el correo de restablecimiento.');
            }

            setMessage('Correo de restablecimiento enviado. Por favor revisa tu correo electrónico.');
        } catch (error) {
            setMessage(error.message);
        }
    };

    return (
        <div className="login-background">
            <div className="shape-background"></div> {/* Fondo degradado */}
            <AuthFormContainer title="Restablecer Contraseña">
                <form onSubmit={handleForgotPassword}>
                    <div className="form-group input-icon">
                        <i className="fas fa-envelope"></i>
                        <input
                            type="email"
                            className="form-control"
                            placeholder="Correo Electrónico"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>
                    <button type="submit" className="btn-login">Enviar Correo de Restablecimiento</button>
                    {message && <p className="text-info mt-3">{message}</p>}
                </form>
            </AuthFormContainer>
        </div>
    );
}

export default ForgotPassword;

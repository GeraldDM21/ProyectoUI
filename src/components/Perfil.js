import React, { useState, useEffect } from 'react';

function Perfil() {
    const [nombre, setNombre] = useState('');
    const [apellido, setApellido] = useState('');
    const [correo, setCorreo] = useState('');
    const [telefono, setTelefono] = useState('');
    const [mensaje, setMensaje] = useState('');
    const userId = localStorage.getItem('userId'); // Obtener el rol del usuario

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
        const token = localStorage.getItem('token');

        try {
            const response = await fetch(`https://localhost:7201/api/usuarios/${userId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
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

    return (
        <div className="perfil-container">
            <h2>Mi Perfil - {userId.charAt(0).toUpperCase() + userId.slice(1)}</h2>
            <form onSubmit={handleUpdateProfile}>
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
                {mensaje && <p className="text-info mt-3">{mensaje}</p>}
            </form>
        </div>
    );
}

export default Perfil;

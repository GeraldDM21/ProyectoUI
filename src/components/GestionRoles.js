import React, { useState, useEffect } from 'react';
import { FaPlusCircle, FaTrashAlt } from 'react-icons/fa';
import '../Styles/GestionRoles.css';

function GestionRoles() {
    const [roles, setRoles] = useState([]);
    const [nuevoRol, setNuevoRol] = useState('');
    const [error, setError] = useState('');

    // Cargar los roles al montar el componente
    useEffect(() => {
        fetchRoles();
    }, []);

    // Función para obtener todos los roles desde el backend
    const fetchRoles = async () => {
        try {
            const response = await fetch('https://localhost:7201/api/Roles');
            const data = await response.json();
            setRoles(data);
        } catch (error) {
            console.error("Error al cargar los roles:", error);
        }
    };

    // Función para agregar un nuevo rol
    const handleAddRole = async (e) => {
        e.preventDefault();
        if (!nuevoRol.trim()) {
            setError("El nombre del rol es obligatorio.");
            return;
        }

        try {
            const response = await fetch('https://localhost:7201/api/Roles', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ nombre: nuevoRol }),
            });

            if (response.ok) {
                setNuevoRol('');
                setError('');
                fetchRoles(); // Recargar la lista de roles
            } else {
                setError("No se pudo agregar el rol.");
            }
        } catch (error) {
            console.error("Error al agregar el rol:", error);
        }
    };

    // Función para eliminar un rol
    const handleDeleteRole = async (id) => {
        try {
            const response = await fetch(`https://localhost:7201/api/Roles/${id}`, {
                method: 'DELETE',
            });

            if (response.ok) {
                setRoles(roles.filter(role => role.id !== id));
            } else {
                setError("No se pudo eliminar el rol.");
            }
        } catch (error) {
            console.error("Error al eliminar el rol:", error);
        }
    };

    return (
        <div className="gestion-roles-background">
            <div className="shape-background"></div>
            <div className="gestion-roles-container">
                <div className="header-icon">
                    <FaPlusCircle size={50} />
                </div>
                <h2>Gestión de Roles</h2>

                {/* Formulario para agregar un nuevo rol */}
                <form onSubmit={handleAddRole} className="form-role">
                    <div className="input-icon">
                        <FaPlusCircle className="icon" />
                        <input
                            type="text"
                            placeholder="Nombre del Rol"
                            value={nuevoRol}
                            onChange={(e) => setNuevoRol(e.target.value)}
                            required
                        />
                    </div>
                    <button type="submit" className="btn-add">Agregar Rol</button>
                    {error && <p className="text-danger">{error}</p>}
                </form>

                {/* Lista de roles */}
                <ul className="lista-roles">
                    {roles.map((role) => (
                        <li key={role.id} className="role-item">
                            <span>{role.nombre}</span>
                            <FaTrashAlt 
                                onClick={() => handleDeleteRole(role.id)}
                                className="delete-icon"
                            />
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
}

export default GestionRoles;

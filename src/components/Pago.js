import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';  // Importa los estilos de react-toastify
import React, { useState } from 'react';
import './Pago.css';
import { useLocation } from 'react-router-dom';
import HeaderUsuario from './HeaderUsuario';  // Importar el HeaderUsuario

function Pago() {
    const location = useLocation();
    const { multaId } = location.state.multaId || {};  // Recuperar el id de la multa pasada desde VerMultas.js
    const [metodoPago, setMetodoPago] = useState('');
    const [comprobante, setComprobante] = useState(null);
    const [error, setError] = useState('');
    const [mensajeExito, setMensajeExito] = useState('');

    const handleMetodoChange = (event) => {
        setMetodoPago(event.target.value);
        setComprobante(null);  // Reiniciar comprobante si cambia el método de pago
        setError('');
        setMensajeExito('');
    };

    const handleComprobanteChange = (event) => {
        setComprobante(event.target.files[0]);
        setError('');
    };

    const handlePago = () => {
        // Validación para el pago por SINPE
        if (metodoPago === 'sinpe' && !comprobante) {
            setError('Por favor, suba el comprobante de transferencia.');
            toast.error('Por favor, suba el comprobante de transferencia.');
            return;
        }
        
        // Reiniciar mensajes de error y éxito antes de procesar el pago
        setError('');
        setMensajeExito('');

        // Simulación de la lógica para procesar el pago
        if (metodoPago === 'paypal') {
            // Aquí iría la lógica real para procesar el pago por PayPal
            setMensajeExito('Pago procesado exitosamente con PayPal.');
            toast.success('Pago procesado exitosamente con PayPal.');
            generarFactura();
        } else if (metodoPago === 'sinpe') {
            // Aquí iría la lógica real para procesar el pago por SINPE
            setMensajeExito('Pago enviado exitosamente con SINPE.');
            generarFactura();
        } else {
            setError('Seleccione un método de pago para continuar.');
            toast.error('Seleccione un método de pago para continuar.');
        }
    };

    // Función para simular la generación de factura en PDF y XML
    const generarFactura = () => {
        // Aquí puedes implementar la generación real de PDF y XML si es necesario
        console.log('Generando factura en PDF y XML...');
        // Simulación de generación de factura
        alert('Pago exitoso.');
    };

    return (
        <div className="pago-page">
            <HeaderUsuario />  {/* Incluir el HeaderUsuario aquí */}
            <div className="pago-container">
                <h2>Seleccione su método de pago</h2>
                <div className="metodo-pago">
                    <label>
                        <input type="radio" value="sinpe" checked={metodoPago === 'sinpe'} onChange={handleMetodoChange} />
                        SINPE
                    </label>
                    <label>
                        <input type="radio" value="paypal" checked={metodoPago === 'paypal'} onChange={handleMetodoChange} />
                        PayPal
                    </label>
                </div>

                {/* Cargar comprobante solo si se elige SINPE */}
                {metodoPago === 'sinpe' && (
                    <div className="comprobante-upload">
                        <label>Suba el comprobante de transferencia:</label>
                        <input type="file" accept=".jpg,.jpeg,.png,.pdf" onChange={handleComprobanteChange} />
                        <button onClick={handlePago} className="enviar-button">Enviar</button>
                    </div>
                )}

                {/* Botón de pago específico para PayPal */}
                {metodoPago === 'paypal' && (
                    <div className="paypal-button">
                        <button onClick={handlePago} className="paypal-btn">
                            <img src="https://www.paypalobjects.com/webstatic/en_US/i/buttons/PP_logo_h_150x38.png" alt="PayPal" />
                        
                        </button>
                    </div>
                )}

                {/* Mostrar mensaje de éxito o error */}
                {mensajeExito && <p className="success-message">{mensajeExito}</p>}
                {error && <p className="error-message">{error}</p>}
            </div>
            <ToastContainer />
        </div>
    );
}

export default Pago;

import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';  // Importa los estilos de react-toastify
import React, { useState } from 'react';
import './Pago.css';
import { useLocation } from 'react-router-dom';
import HeaderUsuario from './HeaderUsuario';  
import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";
import UploadWidget from './UploadWidget';


function Pago() {
    const location = useLocation();
    const { multaId, total } = location.state || {};  // Recuperar el id de la multa pasada desde VerMultas.js
    const [metodoPago, setMetodoPago] = useState('');
    const [fotoSinpe, setFotoSinpe] = useState(null);
    const [error, setError] = useState('');
    const [mensajeExito, setMensajeExito] = useState('');
    const userId = localStorage.getItem('userId');

    const handleMetodoChange = (event) => {
        setMetodoPago(event.target.value);
        setFotoSinpe(null);  // Reiniciar comprobante si cambia el método de pago
        setError('');
        setMensajeExito('');
    };

    const handleComprobanteChange = (event) => {
        setFotoSinpe(event.target.files[0]);
        setError('');
    };

    const handlePago = () => {
        // Validación para el pago por SINPE
        if (metodoPago === 'sinpe' && !fotoSinpe) {
            toast.error('Por favor, suba el comprobante de transferencia.');
            return;
        }
        
        // Reiniciar mensajes de error y éxito antes de procesar el pago
        setError('');
        setMensajeExito('');

        // Simulación de la lógica para procesar el pago
        if (metodoPago === 'paypal') {
            toast.success('Pago procesado exitosamente con PayPal.');
            generarFactura();
        } else if (metodoPago === 'sinpe') {
            toast.success('Pago enviado exitosamente con SINPE.');
            generarFactura();
        } else {
            toast.error('Seleccione un método de pago para continuar.');
        }
    };

    const generarFactura = () => {
        console.log('Generando factura en PDF y XML...');
    };

    const EXCHANGE_RATE_CRC_TO_USD = 0.0020;
    const totalInUSD = (total * EXCHANGE_RATE_CRC_TO_USD).toFixed(2); // Convierte CRC a USD

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

                {metodoPago === 'sinpe' && (
                    <div className="comprobante-upload">
                        <label>Suba el comprobante de transferencia:</label>
                        <UploadWidget onUpload={setFotoSinpe} />
                        <button onClick={handlePago} className="enviar-button">Enviar</button>
                    </div>
                )}

                {metodoPago === 'paypal' && (
                    <div className="paypal-button">
                        <PayPalButtons
                            style={{ layout: 'vertical' }}
                            createOrder={(data, actions) => {
                                return actions.order.create({
                                    purchase_units: [
                                        {
                                            amount: {
                                                currency_code: 'USD', // Cambia a una moneda soportada como USD
                                                value: totalInUSD,
                
                                            },
                                        },
                                    ],
                                });
                            }}
                            onApprove={(data, actions) => {
                                return actions.order.capture().then((details) => {
                                    toast.success(`Pago procesado exitosamente por ${details.payer.name.given_name}`);
                                    generarFactura();
                                });
                            }}
                            onError={(err) => {
                                toast.error('Error al procesar el pago con PayPal.');
                            }}
                        />
                    </div>
                )}
            </div>
            <ToastContainer />
        </div>
    );
}

export default Pago;

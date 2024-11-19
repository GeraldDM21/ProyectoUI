import React, { useState, useEffect } from 'react';
import { Chart } from 'chart.js/auto';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import * as XLSX from 'xlsx';

function ReporteUsuarioFinal() {
    const [multas, setMultas] = useState([]);
    const [desde, setDesde] = useState('');
    const [hasta, setHasta] = useState('');
    const chartRef = React.useRef(null); 
    const userId = localStorage.getItem('userId'); 

    // Cargar multas desde el backend
    useEffect(() => {
        const fetchMultas = async () => {
            try {
                const response = await fetch(`https://localhost:7201/api/Multas/IdInfractor/${userId}/NotResolved`);
                if (!response.ok) {
                    throw new Error('Error al cargar las multas.');
                }
                const data = await response.json();
                setMultas(data); 
            } catch (error) {
                console.error('Error al cargar las multas:', error);
            }
        };

        fetchMultas();
    }, [userId]);

    // Filtrar multas por rango de fechas
    const filtrarMultas = () => {
        if (!desde || !hasta) return multas;
        return multas.filter((multa) => {
            const fechaMulta = new Date(multa.fecha);
            const fechaDesde = new Date(desde);
            const fechaHasta = new Date(hasta);
            return fechaMulta >= fechaDesde && fechaMulta <= fechaHasta;
        });
    };

    // Preparar datos para el gráfico
    const prepararDatosGrafico = () => {
        const multasFiltradas = filtrarMultas();
        const pagadas = multasFiltradas.filter((multa) => multa.pagada).length;
        const porCancelar = multasFiltradas.filter((multa) => !multa.pagada).length;

        return {
            labels: ['Multas Pagadas', 'Multas por Cancelar'],
            datasets: [
                {
                    label: 'Multas',
                    data: [pagadas, porCancelar],
                    backgroundColor: ['#B4CEB3', '#546A76'], // Colores
                },
            ],
        };
    };

    // Renderizar gráfico
    const renderChart = () => {
        const ctx = document.getElementById('chartUsuarioFinal').getContext('2d');

        // Destruir gráfico existente si existe
        if (chartRef.current) {
            chartRef.current.destroy();
        }

        // Crear nuevo gráfico
        chartRef.current = new Chart(ctx, {
            type: 'bar',
            data: prepararDatosGrafico(),
            options: {
                responsive: true,
                plugins: {
                    legend: { display: false },
                    title: {
                        display: true,
                        text: 'Informe de Multas - Usuario Final',
                    },
                },
            },
        });
    };

    useEffect(() => {
        renderChart();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [multas, desde, hasta]);

    // Exportar a Excel
    const exportarExcel = () => {
        const multasFiltradas = filtrarMultas();
        const datos = multasFiltradas.map((multa) => ({
            Fecha: new Date(multa.fecha).toLocaleDateString(),
            Estado: multa.pagada ? 'Pagada' : 'Por Cancelar',
            Monto: `₡${(multa.total ?? 0).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
        }));

        const hoja = XLSX.utils.json_to_sheet(datos);
        const libro = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(libro, hoja, 'Multas');
        XLSX.writeFile(libro, 'InformeMultasUsuarioFinal.xlsx');
    };

    // Exportar a PDF
    const exportarPDF = () => {
        const multasFiltradas = filtrarMultas();
        const doc = new jsPDF();
        doc.text('Informe de Multas - Usuario Final', 10, 10);

        autoTable(doc, {
            startY: 20,
            head: [['Fecha', 'Estado', 'Monto']],
            body: multasFiltradas.map((multa) => [
                new Date(multa.fecha).toLocaleDateString(),
                multa.pagada ? 'Pagada' : 'Por Cancelar',
                `₡${(multa.total ?? 0).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
            ]),
        });

        doc.save('InformeMultasUsuarioFinal.pdf');
    };

    return (
        <div className="reporte-container">
            <h3>Informe de Multas - Usuario Final</h3>
            <div className="filter-container">
                <div>
                    <label htmlFor="desde">Desde:</label>
                    <input
                        type="date"
                        id="desde"
                        value={desde}
                        onChange={(e) => setDesde(e.target.value)}
                    />
                </div>
                <div>
                    <label htmlFor="hasta">Hasta:</label>
                    <input
                        type="date"
                        id="hasta"
                        value={hasta}
                        onChange={(e) => setHasta(e.target.value)}
                    />
                </div>
                <button onClick={renderChart} className="btn-filter">Filtrar</button>
            </div>
            <canvas id="chartUsuarioFinal"></canvas>
            <div>
                <button onClick={exportarExcel} className="btn-export">Exportar a Excel</button>
                <button onClick={exportarPDF} className="btn-export">Exportar a PDF</button>
            </div>
        </div>
    );
}

export default ReporteUsuarioFinal;

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Chart, registerables } from 'chart.js';
import 'chart.js/auto';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import { saveAs } from 'file-saver';

Chart.register(...registerables);

const ReporteOficial = () => {
    const [multas, setMultas] = useState([]);
    const [disputas, setDisputas] = useState([]);
    const [filteredMultas, setFilteredMultas] = useState([]);
    const [filteredDisputas, setFilteredDisputas] = useState([]);
    const [fechaInicio, setFechaInicio] = useState('');
    const [fechaFin, setFechaFin] = useState('');
    const chartRef = useRef(null); // Uso de referencia para el canvas

    // Fetch inicial para obtener multas y disputas
    useEffect(() => {
        const fetchData = async () => {
            try {
                const multasResponse = await fetch('https://tu-backend.com/api/multas');
                const disputasResponse = await fetch('https://tu-backend.com/api/disputas');
                const multasData = await multasResponse.json();
                const disputasData = await disputasResponse.json();

                setMultas(multasData);
                setDisputas(disputasData);
                setFilteredMultas(multasData);
                setFilteredDisputas(disputasData);
            } catch (error) {
                console.error('Error al cargar datos:', error);
            }
        };

        fetchData();
    }, []);

    // Renderizar gráfico
    const renderChart = useCallback(() => {
        if (chartRef.current) {
            // Destruir instancia previa si existe
            chartRef.current.destroy();
        }

        const ctx = document.getElementById('chartOficial').getContext('2d');

        chartRef.current = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: ['Multas Creadas', 'Disputas Creadas'],
                datasets: [
                    {
                        label: 'Cantidad',
                        data: [filteredMultas.length, filteredDisputas.length],
                        backgroundColor: ['#4CAF50', '#FFC107'],
                    },
                ],
            },
            options: {
                responsive: true,
                plugins: {
                    legend: {
                        position: 'top',
                    },
                },
            },
        });
    }, [filteredMultas, filteredDisputas]);

    useEffect(() => {
        renderChart();
    }, [filteredMultas, filteredDisputas, renderChart]);

    // Filtrar datos por rango de fechas
    const handleFilter = () => {
        const inicio = new Date(fechaInicio);
        const fin = new Date(fechaFin);

        const multasFiltradas = multas.filter((multa) => {
            const fechaMulta = new Date(multa.fecha);
            return fechaMulta >= inicio && fechaMulta <= fin;
        });

        const disputasFiltradas = disputas.filter((disputa) => {
            const fechaDisputa = new Date(disputa.fecha);
            return fechaDisputa >= inicio && fechaDisputa <= fin;
        });

        setFilteredMultas(multasFiltradas);
        setFilteredDisputas(disputasFiltradas);
    };

    // Exportar a Excel
    const exportToExcel = () => {
        let csv = 'Tipo,Fecha\n';

        filteredMultas.forEach((multa) => {
            csv += `Multa,${multa.fecha}\n`;
        });

        filteredDisputas.forEach((disputa) => {
            csv += `Disputa,${disputa.fecha}\n`;
        });

        const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
        saveAs(blob, 'reporte_oficial.csv');
    };

    // Exportar a PDF
    const exportToPDF = () => {
        const doc = new jsPDF();
        doc.setFontSize(16);
        doc.text('Informe de Multas y Disputas - Oficial', 14, 20);

        const multasRows = filteredMultas.map((multa) => [multa.id, multa.fecha]);
        const disputasRows = filteredDisputas.map((disputa) => [disputa.id, disputa.fecha]);

        doc.autoTable({
            head: [['ID', 'Fecha']],
            body: multasRows,
            startY: 30,
            theme: 'grid',
            headStyles: { fillColor: [76, 175, 80] },
        });

        doc.autoTable({
            head: [['ID', 'Fecha']],
            body: disputasRows,
            startY: doc.lastAutoTable.finalY + 10,
            theme: 'grid',
            headStyles: { fillColor: [255, 193, 7] },
        });

        doc.save('reporte_oficial.pdf');
    };

    return (
        <div className="reporte-container">
            <h3>Informe de Multas y Disputas - Oficial</h3>
            <div className="filter-container">
                <div>
                    <label htmlFor="fechaInicio">Desde:</label>
                    <input
                        type="date"
                        id="fechaInicio"
                        value={fechaInicio}
                        onChange={(e) => setFechaInicio(e.target.value)}
                    />
                </div>
                <div>
                    <label htmlFor="fechaFin">Hasta:</label>
                    <input
                        type="date"
                        id="fechaFin"
                        value={fechaFin}
                        onChange={(e) => setFechaFin(e.target.value)}
                    />
                </div>
                <button className="btn-filter" onClick={handleFilter}>
                    Filtrar
                </button>
            </div>
            <canvas id="chartOficial"></canvas>
            <div>
                <button className="btn-export" onClick={exportToExcel}>
                    Exportar a Excel
                </button>
                <button className="btn-export" onClick={exportToPDF}>
                    Exportar a PDF
                </button>
            </div>
        </div>
    );
};

export default ReporteOficial;

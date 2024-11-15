import React, { useEffect, useRef, useState } from 'react';
import Chart from 'chart.js/auto';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import * as XLSX from 'xlsx';

function ReporteAdministrativo() {
    const chartRefEstados = useRef(null);
    const chartRefTipoZona = useRef(null);
    
    const [dataEstados, setDataEstados] = useState({
        labels: ['Creadas', 'Pagadas', 'Pendientes', 'En Disputa'],
        values: [],
    });
    const [dataTipoZonaFecha, setDataTipoZonaFecha] = useState({
        labels: [],
        tipoValues: [],
        zonaValues: [],
        fechaValues: [],
    });

    const fetchData = async () => {
        try {
            const response = await fetch('https://tu-backend.com/api/reportes/administrativo');
            if (!response.ok) {
                throw new Error('Error al obtener los datos del backend');
            }
            const result = await response.json();

            setDataEstados({
                labels: ['Creadas', 'Pagadas', 'Pendientes', 'En Disputa'],
                values: result.estadoMultas,
            });
            setDataTipoZonaFecha({
                labels: result.tipoLabels,  // Ej. ["Tipo1", "Tipo2", "Tipo3"]
                tipoValues: result.tipoValues,  // Cantidades por tipo de multa
                zonaValues: result.zonaValues,  // Cantidades por zona
                fechaValues: result.fechaValues, // Cantidades por fecha
            });
        } catch (error) {
            console.error('Error:', error);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    useEffect(() => {
        if (chartRefEstados.current) chartRefEstados.current.destroy();
        if (chartRefTipoZona.current) chartRefTipoZona.current.destroy();

        chartRefEstados.current = new Chart(document.getElementById('chartEstados'), {
            type: 'bar',
            data: {
                labels: dataEstados.labels,
                datasets: [
                    {
                        label: 'Estados de Multas',
                        data: dataEstados.values,
                        backgroundColor: ['rgba(54, 162, 235, 0.5)', 'rgba(75, 192, 192, 0.5)', 'rgba(255, 206, 86, 0.5)', 'rgba(255, 99, 132, 0.5)'],
                        borderColor: ['rgba(54, 162, 235, 1)', 'rgba(75, 192, 192, 1)', 'rgba(255, 206, 86, 1)', 'rgba(255, 99, 132, 1)'],
                        borderWidth: 1,
                    },
                ],
            },
            options: { responsive: true, plugins: { legend: { position: 'top' } } },
        });

        chartRefTipoZona.current = new Chart(document.getElementById('chartTipoZona'), {
            type: 'bar',
            data: {
                labels: dataTipoZonaFecha.labels,
                datasets: [
                    {
                        label: 'Multas por Tipo',
                        data: dataTipoZonaFecha.tipoValues,
                        backgroundColor: 'rgba(153, 102, 255, 0.5)',
                        borderColor: 'rgba(153, 102, 255, 1)',
                        borderWidth: 1,
                    },
                    {
                        label: 'Multas por Zona',
                        data: dataTipoZonaFecha.zonaValues,
                        backgroundColor: 'rgba(255, 159, 64, 0.5)',
                        borderColor: 'rgba(255, 159, 64, 1)',
                        borderWidth: 1,
                    },
                    {
                        label: 'Multas por Fecha',
                        data: dataTipoZonaFecha.fechaValues,
                        backgroundColor: 'rgba(75, 192, 192, 0.5)',
                        borderColor: 'rgba(75, 192, 192, 1)',
                        borderWidth: 1,
                    },
                ],
            },
            options: { responsive: true, plugins: { legend: { position: 'top' } } },
        });

        return () => {
            if (chartRefEstados.current) chartRefEstados.current.destroy();
            if (chartRefTipoZona.current) chartRefTipoZona.current.destroy();
        };
    }, [dataEstados, dataTipoZonaFecha]);

    const exportToPDF = () => {
        const doc = new jsPDF();
        doc.text('Informe de Multas - Administrativo', 10, 10);
        doc.autoTable({
            head: [['Estado', 'Cantidad']],
            body: dataEstados.labels.map((label, index) => [label, dataEstados.values[index]]),
        });
        doc.autoTable({
            head: [['Tipo/Zona/Fecha', 'Cantidad']],
            body: dataTipoZonaFecha.labels.map((label, index) => [
                label,
                `${dataTipoZonaFecha.tipoValues[index]} / ${dataTipoZonaFecha.zonaValues[index]} / ${dataTipoZonaFecha.fechaValues[index]}`,
            ]),
        });
        doc.save('informe-multas-administrativo.pdf');
    };

    const exportToExcel = () => {
        const workbook = XLSX.utils.book_new();

        const estadosSheet = XLSX.utils.json_to_sheet(dataEstados.labels.map((label, index) => ({
            Estado: label,
            Cantidad: dataEstados.values[index],
        })));
        XLSX.utils.book_append_sheet(workbook, estadosSheet, 'Estados de Multas');

        const tipoZonaFechaSheet = XLSX.utils.json_to_sheet(dataTipoZonaFecha.labels.map((label, index) => ({
            'Tipo/Zona/Fecha': label,
            Cantidad: `${dataTipoZonaFecha.tipoValues[index]} / ${dataTipoZonaFecha.zonaValues[index]} / ${dataTipoZonaFecha.fechaValues[index]}`,
        })));
        XLSX.utils.book_append_sheet(workbook, tipoZonaFechaSheet, 'Multas por Tipo, Zona y Fecha');

        XLSX.writeFile(workbook, 'informe-multas-administrativo.xlsx');
    };

    return (
        <div className="reporte-container">
            <h3>Informe de Multas - Administrativo</h3>

            <div className="chart-container">
                <canvas id="chartEstados"></canvas>
            </div>

            <div className="chart-container">
                <canvas id="chartTipoZona"></canvas>
            </div>

            <div className="buttons-container">
                <button onClick={exportToExcel} className="btn-export">Exportar a Excel</button>
                <button onClick={exportToPDF} className="btn-export">Exportar a PDF</button>
            </div>
        </div>
    );
}

export default ReporteAdministrativo;

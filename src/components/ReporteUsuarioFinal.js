import React, { useEffect, useRef, useState } from 'react';
import Chart from 'chart.js/auto';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import * as XLSX from 'xlsx';


function ReporteUsuarioFinal() {
    const chartRef = useRef(null);
    const [dataMultas, setDataMultas] = useState({
        labels: ['Multas Pagadas', 'Multas por Cancelar'],
        values: [],
    });

    // Fetch de datos del backend
    const fetchData = async () => {
        try {
            const response = await fetch('https://tu-backend.com/api/multas/usuario-final');
            if (!response.ok) {
                throw new Error('Error al obtener los datos del backend');
            }
            const result = await response.json();

            setDataMultas({
                labels: ['Multas Pagadas', 'Multas por Cancelar'],
                values: [result.pagadas, result.porCancelar],
            });
        } catch (error) {
            console.error('Error:', error);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    useEffect(() => {
        if (chartRef.current) chartRef.current.destroy();

        chartRef.current = new Chart(document.getElementById('chartMultas'), {
            type: 'bar',
            data: {
                labels: dataMultas.labels,
                datasets: [
                    {
                        label: 'Multas',
                        data: dataMultas.values,
                        backgroundColor: ['rgba(54, 162, 235, 0.5)', 'rgba(255, 99, 132, 0.5)'],
                        borderColor: ['rgba(54, 162, 235, 1)', 'rgba(255, 99, 132, 1)'],
                        borderWidth: 1,
                    },
                ],
            },
            options: { responsive: true, plugins: { legend: { position: 'top' } } },
        });

        return () => {
            if (chartRef.current) chartRef.current.destroy();
        };
    }, [dataMultas]);

    const exportToPDF = () => {
        const doc = new jsPDF();
        doc.text('Informe de Multas - Usuario Final', 10, 10);
        doc.autoTable({
            head: [['Tipo', 'Cantidad']],
            body: [
                ['Multas Pagadas', dataMultas.values[0]],
                ['Multas por Cancelar', dataMultas.values[1]],
            ],
        });
        doc.save('informe_multas_usuario_final.pdf');
    };

    const exportToExcel = () => {
        const worksheet = XLSX.utils.json_to_sheet([
            { Tipo: 'Multas Pagadas', Cantidad: dataMultas.values[0] },
            { Tipo: 'Multas por Cancelar', Cantidad: dataMultas.values[1] },
        ]);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, 'Multas');
        XLSX.writeFile(workbook, 'informe_multas_usuario_final.xlsx');
    };

    return (
        <div className="reporte-container">
            <h3>Informe de Multas - Usuario Final</h3>
            <div className="chart-container">
                <canvas id="chartMultas"></canvas>
            </div>
            <div className="export-buttons">
                <button onClick={exportToExcel} className="btn-export">Exportar a Excel</button>
                <button onClick={exportToPDF} className="btn-export">Exportar a PDF</button>
            </div>
        </div>
    );
}

export default ReporteUsuarioFinal;

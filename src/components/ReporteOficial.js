import React, { useEffect, useRef, useState } from 'react';
import { Chart } from 'chart.js';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';

function ReporteOficial() {
    const chartRef = useRef(null);
    const myChart = useRef(null);
    const [multasData, setMultasData] = useState([]);
    const [declaracionesData, setDeclaracionesData] = useState([]);

    // Función para obtener datos desde la API
    const fetchData = async () => {
        try {
            const multasResponse = await fetch('https://api.example.com/multas'); // Cambia esta URL por la de tu API de multas
            const declaracionesResponse = await fetch('https://api.example.com/declaraciones'); // Cambia esta URL por la de tu API de declaraciones

            const multas = await multasResponse.json();
            const declaraciones = await declaracionesResponse.json();

            setMultasData(multas);
            setDeclaracionesData(declaraciones);
        } catch (error) {
            console.error('Error al obtener datos:', error);
        }
    };

    useEffect(() => {
        fetchData(); // Llama a fetchData cuando el componente se monta
    }, []);

    useEffect(() => {
        // Destruir el gráfico anterior si existe
        if (myChart.current) {
            myChart.current.destroy();
        }

        // Crear nuevo gráfico con datos de la API
        const ctx = chartRef.current.getContext('2d');
        myChart.current = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'],
                datasets: [
                    {
                        label: 'Multas Creadas',
                        data: generateMonthlyData(multasData),
                        backgroundColor: 'rgba(75, 192, 192, 0.2)',
                        borderColor: 'rgba(75, 192, 192, 1)',
                        borderWidth: 1,
                    },
                    {
                        label: 'Declaraciones',
                        data: generateMonthlyData(declaracionesData),
                        backgroundColor: 'rgba(153, 102, 255, 0.2)',
                        borderColor: 'rgba(153, 102, 255, 1)',
                        borderWidth: 1,
                    },
                ],
            },
            options: {
                scales: {
                    y: {
                        beginAtZero: true,
                    },
                },
            },
        });

        return () => {
            if (myChart.current) {
                myChart.current.destroy();
            }
        };
    }, [multasData, declaracionesData]);

    // Función para generar datos mensuales a partir de los datos obtenidos de la API
    const generateMonthlyData = (data) => {
        const monthlyData = new Array(12).fill(0); // Array de 12 elementos para cada mes
        data.forEach(item => {
            const month = new Date(item.fecha).getMonth(); // Suponiendo que los objetos tienen una propiedad `fecha`
            monthlyData[month]++;
        });
        return monthlyData;
    };

    // Función para exportar a PDF
    const exportToPDF = () => {
        const doc = new jsPDF();
        doc.text('Informe de Multas Creadas y Declaraciones', 10, 10);
        
        const data = generateReportData(); // Datos para la tabla
        
        doc.autoTable({
            head: [['Mes', 'Multas Creadas', 'Declaraciones']],
            body: data,
        });
        
        doc.save('reporte_oficial.pdf');
    };

    // Función para exportar a Excel
    const exportToExcel = () => {
        const data = generateReportData();
        const worksheet = XLSX.utils.aoa_to_sheet([['Mes', 'Multas Creadas', 'Declaraciones'], ...data]);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, 'Reporte');
        
        const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
        const excelData = new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
        saveAs(excelData, 'reporte_oficial.xlsx');
    };

    // Genera los datos para el reporte basado en los datos mensuales
    const generateReportData = () => {
        const labels = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];
        const multasMensuales = generateMonthlyData(multasData);
        const declaracionesMensuales = generateMonthlyData(declaracionesData);

        return labels.map((label, index) => [label, multasMensuales[index], declaracionesMensuales[index]]);
    };

    return (
        <div className="reporte-container">
            <h3>Informe de Multas Creadas y Declaraciones</h3>
            <canvas ref={chartRef} id="myChart" />
            <button onClick={exportToExcel} className="btn-export">Exportar a Excel</button>
            <button onClick={exportToPDF} className="btn-export">Exportar a PDF</button>
        </div>
    );
}

export default ReporteOficial;

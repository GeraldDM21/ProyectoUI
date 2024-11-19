import React, { useEffect, useState } from "react";
import { Chart } from "chart.js/auto";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import * as XLSX from "xlsx";

function ReporteOficial({ oficialID }) {
  const [multas, setMultas] = useState([]);
  const [multasFiltradas, setMultasFiltradas] = useState([]);
  const [fechaDesde, setFechaDesde] = useState("");
  const [fechaHasta, setFechaHasta] = useState("");
  const userId = localStorage.getItem('userId'); 
  const chartRef = React.useRef(null);

  useEffect(() => {
    const fetchMultasOficial = async () => {
      try {
        const response = await fetch(`https://localhost:7201/api/Multas/IdOficial/${userId}`);
        if (!response.ok) {
          throw new Error("Error al obtener las multas del oficial");
        }
        const data = await response.json();
        setMultas(data);
        setMultasFiltradas(data);
      } catch (error) {
        console.error("Error:", error);
      }
    };

    fetchMultasOficial();
  }, [oficialID]);

  const filtrarMultasPorFecha = () => {
    const desdeFecha = new Date(fechaDesde);
    const hastaFecha = new Date(fechaHasta);

    const filtradas = multas.filter((multa) => {
      const fechaMulta = new Date(multa.fecha);
      return fechaMulta >= desdeFecha && fechaMulta <= hastaFecha;
    });

    setMultasFiltradas(filtradas);
  };

  const renderChart = () => {
    const ctx = document.getElementById("chartOficial").getContext("2d");

    if (chartRef.current) {
      chartRef.current.destroy();
    }

    chartRef.current = new Chart(ctx, {
      type: "bar",
      data: {
        labels: ["Multas Creadas", "Declaraciones Enviadas"],
        datasets: [
          {
            label: "Totales",
            data: [
              multasFiltradas.length,
              multasFiltradas.filter((multa) => multa.disputa).length,
            ],
            backgroundColor: ["#88A0A8", "#B4CEB3"],
          },
        ],
      },
    });
  };

  useEffect(() => {
    renderChart();
  }, [multasFiltradas]);

  // Función para exportar a Excel
  const exportarExcel = () => {
    const filas = multasFiltradas.map((multa) => ({
      Fecha: multa.fecha,
      Estado: multa.pagada ? "Pagada" : "No Pagada",
      Zona: multa.zona,
      Monto: `₡${(multa.total ?? 0).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
    }));

    const hoja = XLSX.utils.json_to_sheet(filas);
    const libro = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(libro, hoja, "Multas");
    XLSX.writeFile(libro, "reporte_multas_oficial.xlsx");
  };

  // Función para exportar a PDF
  const exportarPDF = () => {
    const doc = new jsPDF();
    doc.text("Reporte de Multas - Oficial", 10, 10);

    const filas = multasFiltradas.map((multa) => [
      multa.fecha,
      multa.pagada ? "Pagada" : "No Pagada",
      multa.zona,
      multa.total.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }),
    ]);

    autoTable(doc, {
      head: [["Fecha", "Estado", "Zona", "Monto"]],
      body: filas,
    });

    doc.save("reporte_multas_oficial.pdf");
  };

  return (
    <div className="reporte-container">
      <h3>Informe de Multas y Declaraciones - Oficial</h3>
      <div className="filter-container">
        <div>
          <label>Desde:</label>
          <input
            type="date"
            value={fechaDesde}
            onChange={(e) => setFechaDesde(e.target.value)}
          />
        </div>
        <div>
          <label>Hasta:</label>
          <input
            type="date"
            value={fechaHasta}
            onChange={(e) => setFechaHasta(e.target.value)}
          />
        </div>
        <button onClick={filtrarMultasPorFecha} className="btn-filter">
          Filtrar
        </button>
      </div>
      <canvas id="chartOficial"></canvas>
      <div className="btn-group">
        <button onClick={exportarExcel} className="btn-export">
          Exportar a Excel
        </button>
        <button onClick={exportarPDF} className="btn-export">
          Exportar a PDF
        </button>
      </div>
    </div>
  );
}

export default ReporteOficial;

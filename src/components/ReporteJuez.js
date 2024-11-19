import React, { useEffect, useState } from "react";
import { Chart } from "chart.js/auto";

function ReporteJuez() {
  const [disputas, setDisputas] = useState([]);
  const [disputasFiltradas, setDisputasFiltradas] = useState([]);
  const [chart, setChart] = useState(null);
  const [fechaDesde, setFechaDesde] = useState("");
  const [fechaHasta, setFechaHasta] = useState("");

  useEffect(() => {
    // Simulación de datos desde el backend (conectar con tu API real)
    const fetchData = async () => {
      try {
        const response = await fetch("https://localhost:7201/api/Disputas");
        const data = await response.json();
        setDisputas(data);
        setDisputasFiltradas(data);
      } catch (error) {
        console.error("Error al obtener las disputas:", error);
      }
    };

    fetchData();
  }, []);

  // Aplicar filtros por fecha
  const filtrarDisputas = () => {
    let filtrado = [...disputas];

    if (fechaDesde) {
      filtrado = filtrado.filter(
        (disputa) => new Date(disputa.fecha) >= new Date(fechaDesde)
      );
    }

    if (fechaHasta) {
      filtrado = filtrado.filter(
        (disputa) => new Date(disputa.fecha) <= new Date(fechaHasta)
      );
    }

    setDisputasFiltradas(filtrado);
  };

  // Calcular estadísticas
  const aprobadas =
    disputasFiltradas.filter((disputa) => disputa.estado === "Aprobada").length;
  const denegadas =
    disputasFiltradas.filter((disputa) => disputa.estado === "Denegada").length;

  // Renderizar gráfico
  useEffect(() => {
    if (chart) {
      chart.destroy(); // Destruir gráfico anterior
    }

    const ctx = document.getElementById("chartJuez").getContext("2d");

    const nuevoChart = new Chart(ctx, {
      type: "bar",
      data: {
        labels: ["Disputas Aprobadas", "Disputas Denegadas"],
        datasets: [
          {
            label: "Disputas",
            data: [aprobadas, denegadas],
            backgroundColor: ["#88A0A8", "#B4CEB3"],
          },
        ],
      },
    });

    setChart(nuevoChart);

    return () => {
      if (nuevoChart) {
        nuevoChart.destroy();
      }
    };
  }, [disputasFiltradas]);

  // Exportar a Excel
  const exportarExcel = () => {
    const filas = disputasFiltradas.map((disputa) => ({
      Fecha: disputa.fecha,
      Estado: disputa.estado,
      Motivo: disputa.motivo,
    }));

    const csvContent =
      "data:text/csv;charset=utf-8," +
      [
        "Fecha,Estado,Motivo",
        ...filas.map((fila) => `${fila.Fecha},${fila.Estado},${fila.Motivo}`),
      ].join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "reporte_disputas_juez.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Exportar a PDF
  const exportarPDF = () => {
    import("jspdf").then((jsPDF) => {
      import("jspdf-autotable").then(() => {
        const doc = new jsPDF.default();
        doc.text("Reporte de Disputas - Juez", 10, 10);

        const filas = disputasFiltradas.map((disputa) => [
          disputa.fecha,
          disputa.estado,
          disputa.motivo,
        ]);

        doc.autoTable({
          head: [["Fecha", "Estado", "Motivo"]],
          body: filas,
        });

        doc.save("reporte_disputas_juez.pdf");
      });
    });
  };

  return (
    <div className="reporte-container">
      <h3>Informe de Disputas - Juez</h3>

      <div className="filter-container">
        <div>
          <label htmlFor="fechaDesde">Desde:</label>
          <input
            type="date"
            id="fechaDesde"
            value={fechaDesde}
            onChange={(e) => setFechaDesde(e.target.value)}
          />
        </div>
        <div>
          <label htmlFor="fechaHasta">Hasta:</label>
          <input
            type="date"
            id="fechaHasta"
            value={fechaHasta}
            onChange={(e) => setFechaHasta(e.target.value)}
          />
        </div>
        <button className="btn-filter" onClick={filtrarDisputas}>
          Filtrar
        </button>
      </div>

      <canvas id="chartJuez"></canvas>

      <div className="btn-group">
        <button className="btn-export" onClick={exportarExcel}>
          Exportar a Excel
        </button>
        <button className="btn-export" onClick={exportarPDF}>
          Exportar a PDF
        </button>
      </div>
    </div>
  );
}

export default ReporteJuez;

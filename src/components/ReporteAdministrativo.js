import React, { useEffect, useState } from "react";
import { Chart } from "chart.js/auto";

function ReporteAdministrativo() {
  const [multas, setMultas] = useState([]);
  const [multasFiltradas, setMultasFiltradas] = useState([]);
  const [chart, setChart] = useState(null);
  const [fechaDesde, setFechaDesde] = useState("");
  const [fechaHasta, setFechaHasta] = useState("");
  const [cedulaFiltro, setCedulaFiltro] = useState("");

  useEffect(() => {
    // Obtener multas desde el backend
    const fetchData = async () => {
      try {
        const response = await fetch("https://localhost:7201/api/Multas");
        const data = await response.json();
        setMultas(data);
        setMultasFiltradas(data);
      } catch (error) {
        console.error("Error al obtener las multas:", error);
      }
    };

    fetchData();
  }, []);

  // Aplicar filtros
  const filtrarMultas = () => {
    let filtrado = [...multas];

    if (fechaDesde) {
      filtrado = filtrado.filter(
        (multa) => new Date(multa.fecha) >= new Date(fechaDesde)
      );
    }

    if (fechaHasta) {
      filtrado = filtrado.filter(
        (multa) => new Date(multa.fecha) <= new Date(fechaHasta)
      );
    }

    if (cedulaFiltro) {
      filtrado = filtrado.filter(
        (multa) =>
          multa.cedulaInfractor &&
          multa.cedulaInfractor.toString().includes(cedulaFiltro)
      );
    }

    setMultasFiltradas(filtrado);
  };

  // Calcular estadísticas
  const porcentajePagadas =
    (multasFiltradas.filter((multa) => multa.pagada).length / multasFiltradas.length) *
      100 || 0;

  const porcentajePorPagar =
    (multasFiltradas.filter((multa) => !multa.pagada).length / multasFiltradas.length) *
      100 || 0;

  // Renderizar gráfico
  useEffect(() => {
    if (chart) {
      chart.destroy(); // Destruir gráfico anterior
    }

    const ctx = document.getElementById("chartAdministrativo").getContext("2d");

    const nuevoChart = new Chart(ctx, {
      type: "bar",
      data: {
        labels: ["% Pagadas", "% Por Pagar"],
        datasets: [
          {
            label: "Porcentaje de Multas",
            data: [porcentajePagadas, porcentajePorPagar],
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
  }, [multasFiltradas, porcentajePagadas, porcentajePorPagar]);

  // Descargar Excel
  const exportarExcel = () => {
    const filas = multasFiltradas.map((multa) => ({
      Fecha: multa.fecha,
      Cedula: multa.cedulaInfractor,
      Pagada: multa.pagada ? "Sí" : "No",
    }));

    const csvContent =
      "data:text/csv;charset=utf-8," +
      [
        "Fecha,Cedula,Pagada",
        ...filas.map(
          (fila) =>
            `${fila.Fecha},${fila.Cedula},${fila.Pagada}`
        ),
      ].join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "reporte_multas_administrativo.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Descargar PDF
  const exportarPDF = () => {
    import("jspdf").then((jsPDF) => {
      import("jspdf-autotable").then(() => {
        const doc = new jsPDF.default();
        doc.text("Reporte Administrativo", 10, 10);

        const filas = multasFiltradas.map((multa) => [
          multa.fecha,
          multa.cedulaInfractor,
          multa.pagada ? "Sí" : "No",
        ]);

        doc.autoTable({
          head: [["Fecha", "Cédula", "Pagada"]],
          body: filas,
        });

        doc.save("reporte_multas_administrativo.pdf");
      });
    });
  };

  return (
    <div className="reporte-container">
      <h3>Informe de Multas - Administrativo</h3>

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
        <div>
          <label htmlFor="cedulaFiltro">Cédula:</label>
          <input
            type="text"
            id="cedulaFiltro"
            placeholder="Cédula"
            value={cedulaFiltro}
            onChange={(e) => setCedulaFiltro(e.target.value)}
          />
        </div>
        <button className="btn-filter" onClick={filtrarMultas}>
          Filtrar
        </button>
      </div>

      <canvas id="chartAdministrativo"></canvas>

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

export default ReporteAdministrativo;

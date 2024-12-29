// app.js
// Main script for fetching data and rendering a tax distribution chart from multiple APIs.

// Local sample data (fallback)
const LOCAL_DATA_URL = "data/presupuesto.json";

// Canvas element for the chart
const chartElement = document.getElementById("taxChart");

/**
 * Fetches JSON data from a given URL.
 * Handles HTTP errors and logs results.
 * @param {string} url - The API or data URL.
 * @returns {Promise<Object>} - The JSON data fetched, or null if an error occurs.
 */
async function fetchData(url) {
  try {
    const response = await fetch(url);
    if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
    const data = await response.json();
    console.log(`Data fetched from ${url}:`, data);
    return data;
  } catch (error) {
    console.error("Error fetching data:", error.message);
    return null;
  }
}

/**
 * Fetches data from Datos.gob.es.
 * Example query for "presupuestos".
 * @returns {Promise<Object|null>} - Data from Datos.gob.es, or null if the request fails.
 */
async function fetchDatosGobEs() {
  const API_URL = "https://datos.gob.es/apidata/catalog/dataset?q=presupuestos";
  return fetchData(API_URL);
}

/**
 * Fetches data from Ministerio de Hacienda.
 * Example: Simulates loading a CSV or XLS file.
 * @returns {Promise<Object|null>} - Parsed data from Ministerio de Hacienda.
 */
async function fetchMinisterioHacienda() {
  const API_URL = "https://sepg.pap.hacienda.gob.es/sitios/sepg/es-ES/Presupuestos/DocumentacionEstadisticas/Estadisticas/Paginas/Estadisticas.aspx";
  console.log("Fetching Ministerio de Hacienda data requires XLS/CSV parsing (manual simulation).");

  // Simulate a parsed response (replace with real parsing logic for XLS/CSV).
  const simulatedData = {
    Health: 35,
    Education: 30,
    Infrastructure: 20,
    Pensions: 15,
  };
  return simulatedData;
}

/**
 * Fetches data from the Boletín Oficial del Estado (BOE).
 * Searches for "Ley de Presupuestos".
 * @returns {Promise<Object|null>} - Data from BOE API.
 */
async function fetchBOE() {
  const API_URL = "https://www.boe.es/buscar/api?q=presupuestos&num=10";
  return fetchData(API_URL);
}

/**
 * Fetches data from Gobierto Presupuestos Municipales.
 * Example query to simulate budget data.
 * @returns {Promise<Object|null>} - Data from Gobierto.
 */
async function fetchGobierto() {
  const API_URL = "https://datos.gob.es/aplicaciones/gobierno-presupuestos-municipales";
  console.log("Gobierto data currently simulated (API integration may vary).");

  // Simulated data (replace with real data when available).
  const simulatedData = {
    Health: 40,
    Education: 25,
    Infrastructure: 20,
    Pensions: 15,
  };
  return simulatedData;
}

/**
 * Renders a pie chart using Chart.js.
 * @param {Object} data - The data to visualize.
 */
function renderChart(data) {
  if (!chartElement) {
    console.error("Canvas element not found. Unable to render chart.");
    return;
  }

  const labels = Object.keys(data);
  const values = Object.values(data);

  new Chart(chartElement.getContext("2d"), {
    type: "pie",
    data: {
      labels,
      datasets: [
        {
          label: "Tax Distribution",
          data: values,
          backgroundColor: [
            "#FF6384", "#36A2EB", "#FFCE56", "#4BC0C0", "#9966FF",
          ],
          hoverOffset: 10,
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        tooltip: {
          callbacks: {
            label: (context) => `${context.label}: ${context.raw}%`,
          },
        },
        legend: {
          position: "bottom",
          labels: {
            usePointStyle: true,
          },
        },
      },
    },
  });
}

/**
 * Main function to initialize the application.
 * Attempts to fetch data from all sources in order of priority.
 */
async function main() {
  console.log("Initializing TaxMap Spain...");

  let data = null;

  // Fetch from prioritized APIs
  data = await fetchDatosGobEs();
  if (!data) data = await fetchMinisterioHacienda();
  if (!data) data = await fetchBOE();
  if (!data) data = await fetchGobierto();

  // Fallback to local data if all APIs fail
  if (!data) {
    console.warn("All API requests failed. Falling back to local data.");
    data = await fetchData(LOCAL_DATA_URL);
  }

  // Render the chart
  if (data) {
    renderChart(data);
  } else {
    document.getElementById("dataInfo").innerHTML =
      "<p>Unable to load data. Please try again later.</p>";
  }
}

// Initialize the application
main();

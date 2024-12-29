// app.js
const DATA_URL = "data/presupuesto.json";
const chartElement = document.getElementById("taxChart");

/**
 * Fetches JSON data from the given URL.
 * @param {string} url - The URL to fetch data from.
 * @returns {Promise<Object>} - The parsed JSON data or null in case of failure.
 */
async function fetchData(url) {
  try {
    const response = await fetch(url);
    if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching data:", error.message);
    return null;
  }
}

/**
 * Renders a pie chart using Chart.js.
 * @param {Object} data - The data to visualize in the chart.
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
 * Main function to fetch data and render the chart.
 */
async function main() {
  const data = await fetchData(DATA_URL);
  if (data) {
    renderChart(data);
    console.log("Data successfully loaded and chart rendered:", data);
  } else {
    document.getElementById("dataInfo").innerHTML =
      "<p>Unable to load data. Please try again later.</p>";
  }
}

main();
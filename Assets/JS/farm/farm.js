document.addEventListener("DOMContentLoaded", function () {
  // --- NPK Bar Chart Initialization ---
  const barChartCtx = document.getElementById("npkBarChart").getContext("2d");
  const npkBarChart = new Chart(barChartCtx, {
    type: "bar",
    data: {
      labels: ["Week 1", "Week 2", "Week 3", "Week 4"],
      datasets: [
        {
          label: "Nitrogen",
          backgroundColor: "rgba(255, 99, 132, 0.5)",
          borderColor: "rgba(255, 99, 132, 1)",
          borderWidth: 1,
          data: [65, 59, 80, 81],
        },
        {
          label: "Phosphorus",
          backgroundColor: "rgba(54, 162, 235, 0.5)",
          borderColor: "rgba(54, 162, 235, 1)",
          borderWidth: 1,
          data: [28, 48, 40, 19],
        },
        {
          label: "Potassium",
          backgroundColor: "rgba(255, 206, 86, 0.5)",
          borderColor: "rgba(255, 206, 86, 1)",
          borderWidth: 1,
          data: [35, 23, 56, 78],
        },
      ],
    },
    options: {
      scales: {
        y: {
          beginAtZero: true,
        },
      },
      plugins: {
        title: { display: true, text: "NPK Levels Over Time" },
      },
    },
  });

  // --- Gauge Chart Initialization ---
  Chart.register(ChartGauge);
  const gaugeOptions = {
    type: "gauge",
    data: {
      datasets: [
        {
          value: 50, // Initial value (will be overridden)
          minValue: 0,
          maxValue: 100,
          backgroundColor: ["red", "orange", "yellow", "green"],
          borderWidth: 2,
        },
      ],
    },
    options: {
      needle: {
        radiusPercentage: 2,
        widthPercentage: 3.2,
        lengthPercentage: 80,
        color: "rgba(0, 0, 0, 1)",
      },
      valueLabel: {
        formatter: (value) => Math.round(value),
        fontSize: 16,
        color: "black",
        backgroundColor: "rgba(255, 255, 255, 0.8)",
        borderRadius: 5,
        padding: 5,
      },
      layout: { padding: { top: 10, bottom: 10 } },
      circumference: 1 * Math.PI,
      rotation: -1 * Math.PI,
      plugins: { datalabels: { display: false } },
    },
  };

  // N Gauge
  const nitrogenCtx = document.getElementById("nitrogenGauge").getContext("2d");
  new Chart(nitrogenCtx, {
    ...gaugeOptions,
    data: { datasets: [{ ...gaugeOptions.data.datasets[0], value: 10 }] },
  });

  // P Gauge
  const phosphorusCtx = document
    .getElementById("phosphorusGauge")
    .getContext("2d");
  new Chart(phosphorusCtx, {
    ...gaugeOptions,
    data: { datasets: [{ ...gaugeOptions.data.datasets[0], value: 20 }] },
  });

  // K Gauge
  const potassiumCtx = document
    .getElementById("potassiumGauge")
    .getContext("2d");
  new Chart(potassiumCtx, {
    ...gaugeOptions,
    data: { datasets: [{ ...gaugeOptions.data.datasets[0], value: 10 }] },
  });

  // --- Heatmap Initialization ---
  function initDiseaseHeatmap(mapId, heatmapData) {
    const mapElement = document.getElementById(mapId);
    if (!mapElement) {
      console.error(`Map container element with id "${mapId}" not found`);
      return;
    }
    console.log("Initializing heatmap for:", mapId);
    console.log("Heatmap data:", heatmapData);

    var map = L.map(mapId).setView([31.096669, 30.950029], 19);
    L.tileLayer(
      "https://tiles.stadiamaps.com/tiles/alidade_smooth/{z}/{x}/{y}{r}.png",
      {
        attribution:
          '&copy; <a href="https://stadiamaps.com/">Stadia Maps</a>, &copy; <a href="https://openmaptiles.org/">OpenMapTiles</a> &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      }
    ).addTo(map);

    L.marker([31.096669, 30.950029])
      .addTo(map)
      .bindPopup("Center Point")
      .openPopup(); // Added marker for verification

    L.heatLayer(heatmapData, { radius: 25, maxIntensity: 100 }).addTo(map);
  }

  // Sample Heatmap Data
  const disease1Data = [
    [31.115, 30.932, 80],
    [31.117, 30.934, 90],
    [31.116, 30.933, 70],
  ];
  const disease2Data = [
    [31.118, 30.935, 60],
    [31.119, 30.936, 75],
    [31.117, 30.933, 50],
  ];
  const disease3Data = [
    [31.114, 30.931, 95],
    [31.116, 30.934, 85],
  ];
  const disease4Data = [
    [31.12, 30.937, 70],
    [31.118, 30.933, 65],
  ];

  // Initialize heatmaps for each disease tab
  initDiseaseHeatmap("disease1-map", disease1Data);
  initDiseaseHeatmap("disease2-map", disease2Data);
  initDiseaseHeatmap("disease3-map", disease3Data);
  initDiseaseHeatmap("disease4-map", disease4Data);

  // Enable Bootstrap Tabs
  const tabElms = document.querySelectorAll(
    '#diseaseTabs button[data-bs-toggle="tab"]'
  );
  tabElms.forEach((tabElm) => {
    tabElm.addEventListener("show.bs.tab", (event) => {
      // No specific action needed on tab show for now,
      // but you can add logic here if required.
    });
  });
});
document.getElementById("add-task").addEventListener("click", function () {
  // Navigate to the new page
  window.location.href = "add_task.html"; // Change this to your target page
});

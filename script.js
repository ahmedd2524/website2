// Function to fetch and display data from data_r endpoint
async function fetchData() {
    const response = await fetch("https://8ixct1d30f.execute-api.us-east-1.amazonaws.com/serverless_lambda_stage/data_r");
    const data = await response.json();
  
    // Sort the data by date in ascending order
    data.sort((a, b) => new Date(a.date) - new Date(b.date));
  
    const voltageData = [];
    const temperatureData = [];
    const signalData = [];
    const batteryData = [];
    const labels = [];
  
    data.forEach((entry) => {
      voltageData.push(entry.voltage);
      temperatureData.push(entry.temp);
      signalData.push(entry.signal);
      batteryData.push(entry.battery_p);
      labels.push(formatDate(entry.date));
    });
  
    const chartOptions = {
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        y: {
          ticks: {
            callback: function (value, index, values) {
              return value.toFixed(2);
            },
          },
        },
      },
      plugins: {
        legend: {
          position: "bottom",
        },
      },
    };
  
    const voltageChart = new Chart(document.getElementById("voltageChart"), {
      type: "line",
      data: {
        labels: labels,
        datasets: [
          {
            label: "Voltage",
            data: voltageData,
            borderColor: "red",
            fill: false,
          },
        ],
      },
      options: chartOptions,
    });
  
    const temperatureChart = new Chart(document.getElementById("temperatureChart"), {
      type: "line",
      data: {
        labels: labels,
        datasets: [
          {
            label: "Temperature",
            data: temperatureData,
            borderColor: "blue",
            fill: false,
          },
        ],
      },
      options: chartOptions,
    });
  
    const signalChart = new Chart(document.getElementById("signalChart"), {
      type: "line",
      data: {
        labels: labels,
        datasets: [
          {
            label: "Signal",
            data: signalData,
            borderColor: "green",
            fill: false,
          },
        ],
      },
      options: chartOptions,
    });
  
    const batteryChart = new Chart(document.getElementById("batteryChart"), {
      type: "line",
      data: {
        labels: labels,
        datasets: [
          {
            label: "Battery Percentage",
            data: batteryData,
            borderColor: "orange",
            fill: false,
          },
        ],
      },
      options: chartOptions,
    });
  
    // Get the most recent data entry
    const latestEntry = data[data.length - 1];
  
    // Display the values in the "Real Time data" section
    const realTimeDataElement = document.getElementById("realTimeData");
    realTimeDataElement.innerHTML = `
      <p>Voltage: ${latestEntry.voltage}</p>
      <p>Temperature: ${latestEntry.temp}</p>
      <p>Signal: ${latestEntry.signal}</p>
      <p>Battery Percentage: ${latestEntry.battery_p}</p>
    `;
  }
  
  // Helper function to format date
  function formatDate(dateString) {
    const date = new Date(dateString);
    return `${date.getMonth() + 1}/${date.getDate()}/${date.getFullYear()} - ${date.getHours()}:${padZero(date.getMinutes())}:${padZero(date.getSeconds())}`;
  }
  
  // Helper function to pad zero for single-digit minutes and seconds
  function padZero(number) {
    return number.toString().padStart(2, '0');
  }
  
  // Function to handle form submission
// Function to handle form submission
async function handleSubmit(event) {
  event.preventDefault();

  const valve = document.getElementById("valve").value;
  const switchValue = document.getElementById("switch").value;

  const payload = { "valve": valve, "switch": switchValue };
  const response = await fetch("https://8ixct1d30f.execute-api.us-east-1.amazonaws.com/serverless_lambda_stage/command_w", {
      method: 'POST',
      headers: {
          'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
  });

  if (response.ok) {
      alert("Data submitted successfully!");
  } else {
      alert("Data submission failed.");
  }
}

// Attach event listener to form submission
const form = document.getElementById("inputForm");
form.addEventListener("submit", handleSubmit);

// Fetch data and display charts
fetchData();
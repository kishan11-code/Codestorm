// ============================
// Mock Bus Data for Demo
// ============================
const busData = [
  {
    busNumber: "500A",
    routeNumber: "500",
    timings: [
      { stop: "Majestic", arrival: "10:00 AM", departure: "10:05 AM" },
      { stop: "Shivajinagar", arrival: "10:20 AM", departure: "10:22 AM" },
      { stop: "Indiranagar", arrival: "10:35 AM", departure: "10:37 AM" },
      { stop: "Marathahalli", arrival: "10:50 AM", departure: "10:52 AM" },
    ],
    coordinates: [
      [12.9716, 77.5946],
      [12.9891, 77.5973],
      [12.9719, 77.6412],
      [12.9563, 77.7019],
    ],
  },
  {
    busNumber: "231B",
    routeNumber: "231",
    timings: [
      { stop: "Electronic City", arrival: "11:00 AM", departure: "11:05 AM" },
      { stop: "BTM Layout", arrival: "11:20 AM", departure: "11:22 AM" },
      { stop: "Jayanagar", arrival: "11:35 AM", departure: "11:37 AM" },
      { stop: "Majestic", arrival: "11:55 AM", departure: "11:57 AM" },
    ],
    coordinates: [
      [12.8390, 77.6770],
      [12.9166, 77.6101],
      [12.9250, 77.5938],
      [12.9716, 77.5946],
    ],
  },
  {
    busNumber: "365K",
    routeNumber: "100",
    timings: [
      { stop: "Electronic City", arrival: "11:00 AM", departure: "11:05 AM" },
      { stop: "BTM Layout", arrival: "11:20 AM", departure: "11:22 AM" },
      { stop: "Jayanagar", arrival: "11:35 AM", departure: "11:37 AM" },
      { stop: "Majestic", arrival: "11:55 AM", departure: "11:57 AM" },
    ],
    coordinates: [
      [12.8390, 77.6770],
      [12.9166, 77.6101],
      [12.9250, 77.5938],
      [12.9716, 77.5946],
    ],
  },
];

// ============================
// Initialize Map
// ============================
const map = L.map("map").setView([12.9716, 77.5946], 12);
L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
  maxZoom: 19,
  attribution: "&copy; OpenStreetMap contributors",
}).addTo(map);

let routeLine = null;
let busMarker = null;
let simulateInterval = null;

// ============================
// Search and Display Function
// ============================
document.getElementById("searchBtn").addEventListener("click", () => {
  const query = document.getElementById("busSearch").value.trim().toUpperCase();
  const bus = busData.find(
    (b) => b.busNumber === query || b.routeNumber === query
  );

  if (!bus) {
    document.getElementById("busInfo").innerHTML =
      "<p style='color:red;'>Bus or Route not found. Try 500A or 231B.</p>";
    if (routeLine) map.removeLayer(routeLine);
    if (busMarker) map.removeLayer(busMarker);
    clearInterval(simulateInterval);
    return;
  }

  // Display info
  let html = `
    <h2>Bus: ${bus.busNumber} | Route: ${bus.routeNumber}</h2>
    <table>
      <tr><th>Stop</th><th>Arrival</th><th>Departure</th></tr>
      ${bus.timings
        .map(
          (t) =>
            `<tr><td>${t.stop}</td><td>${t.arrival}</td><td>${t.departure}</td></tr>`
        )
        .join("")}
    </table>`;
  document.getElementById("busInfo").innerHTML = html;

  // Remove previous route
  if (routeLine) map.removeLayer(routeLine);
  if (busMarker) map.removeLayer(busMarker);
  clearInterval(simulateInterval);

  // Draw route
  routeLine = L.polyline(bus.coordinates, { color: "#0078ff", weight: 5 }).addTo(map);
  map.fitBounds(routeLine.getBounds());

  // Bus marker
  let index = 0;
  busMarker = L.marker(bus.coordinates[0])
    .addTo(map)
    .bindPopup(`🚌 ${bus.busNumber} — ${bus.timings[0].stop}`)
    .openPopup();

  // Simulate live movement
  simulateInterval = setInterval(() => {
    index = (index + 1) % bus.coordinates.length;
    const [lat, lng] = bus.coordinates[index];
    const stop = bus.timings[index];
    busMarker.setLatLng([lat, lng]);
    busMarker
      .bindPopup(
        `🚌 <b>${bus.busNumber}</b><br>${stop.stop}<br>Arrival: ${stop.arrival}`
      )
      .openPopup();
  }, 3000);
});

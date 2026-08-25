const MapRenderer = (() => {
  let map = null;
  let markers = [];
  let selectedVehicleId = null;

  function init() {
    if (!window.L || !document.getElementById("mapBackground")) {
      return null;
    }

    if (!map) {
      map = window.L.map("mapBackground", {
        zoomControl: true,
        attributionControl: true,
        scrollWheelZoom: true
      }).setView([51.5074, -0.1278], 11);

      window.L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        maxZoom: 19,
        attribution: "&copy; OpenStreetMap contributors"
      }).addTo(map);
    }

    return map;
  }

  function renderVehicles(vehicles, selectedId) {
    const activeMap = init();
    if (!activeMap || !vehicles) {
      return;
    }

    selectedVehicleId = selectedId;
    markers.forEach((marker) => activeMap.removeLayer(marker));
    markers = [];

    Object.values(vehicles).forEach((vehicle) => {
      const isSelected = vehicle.id === selectedId;
      const color = vehicle.engineTempC > 100 || vehicle.fuelPercent < 15 ? "#ff3b30" : "#75a28c";
      const marker = window.L.circleMarker([vehicle.gps.lat, vehicle.gps.lng], {
        radius: isSelected ? 10 : 7,
        color,
        weight: isSelected ? 3 : 2,
        fillColor: color,
        fillOpacity: 0.9
      });

      marker.bindPopup(`
        <strong>${vehicle.name}</strong><br>
        ${Math.round(vehicle.speedKph)} km/h<br>
        ${vehicle.terrainMode}
      `);

      marker.on("click", () => {
        if (typeof Store !== "undefined" && Store.dispatch) {
          Store.dispatch({ type: "SELECT_VEHICLE", payload: vehicle.id });
        }
      });

      marker.addTo(activeMap);
      markers.push(marker);
    });

    const selectedVehicle = Object.values(vehicles).find((vehicle) => vehicle.id === selectedId) || Object.values(vehicles)[0];
    if (selectedVehicle) {
      activeMap.setView([selectedVehicle.gps.lat, selectedVehicle.gps.lng], 11, { animate: true });
    }
  }

  function focusVehicle(vehicle) {
    const activeMap = init();
    if (!activeMap || !vehicle) {
      return;
    }

    activeMap.setView([vehicle.gps.lat, vehicle.gps.lng], 11, { animate: true });
  }

  return { init, renderVehicles, focusVehicle };
})();

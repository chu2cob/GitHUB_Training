import { summarizeVehicleHealth } from "../telemetryRules.js";
import { escapeHtml } from "./common.js";

export function createLiveMap(container, onVehicleSelect) {
  if (!container || typeof window === "undefined" || !window.L) {
    return null;
  }

  const map = window.L.map(container, {
    zoomControl: true,
    attributionControl: true
  }).setView([52.1808, -1.4843], 11);

  window.L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    maxZoom: 19,
    attribution: "&copy; OpenStreetMap contributors"
  }).addTo(map);

  const routeLine = window.L.polyline([], {
    color: "#75a28c",
    weight: 4,
    opacity: 0.85,
    lineJoin: "round"
  }).addTo(map);

  const markers = window.L.layerGroup().addTo(map);

  window.setTimeout(() => {
    map.invalidateSize();
  }, 0);

  return {
    map,
    routeLine,
    markers,
    markersByVehicleId: new Map(),
    onVehicleSelect
  };
}

export function renderMap(mapState, vehicles, selectedVehicleId) {
  if (!mapState) {
    return;
  }

  const selectedVehicle = vehicles.find((vehicle) => vehicle.id === selectedVehicleId) || vehicles[0];
  if (!selectedVehicle) {
    return;
  }
  const selectedPosition = [selectedVehicle.telemetry.gps.lat, selectedVehicle.telemetry.gps.lng];
  const alerts = summarizeVehicleHealth(selectedVehicle);
  const color = alerts.isCritical ? "#e10600" : alerts.isWarning ? "#d98d2b" : "#75a28c";

  mapState.routeLine.setLatLngs(selectedVehicle.telemetry.gps.trail.map((point) => [point.lat, point.lng]));
  mapState.map.setView(selectedPosition, resolveZoom(selectedVehicle.telemetry.speedKph), { animate: false });
  mapState.markers.clearLayers();
  mapState.markersByVehicleId.clear();

  const marker = window.L.circleMarker(selectedPosition, {
    radius: 10,
    color,
    weight: 3,
    fillColor: color,
    fillOpacity: 0.9
  });

  if (typeof mapState.onVehicleSelect === "function") {
    marker.on("click", () => {
      mapState.onVehicleSelect(selectedVehicle.id);
    });
  }

  marker.bindPopup(`
    <h3 class="map-popup-title">${escapeHtml(selectedVehicle.badge)}</h3>
    <p class="map-popup-copy">${escapeHtml(selectedVehicle.modelName)}</p>
    <p class="map-popup-copy">${escapeHtml(selectedVehicle.telemetry.gps.regionLabel)}</p>
  `);
  marker.addTo(mapState.markers);
  mapState.markersByVehicleId.set(selectedVehicle.id, marker);
}

function resolveZoom(speedKph) {
  if (speedKph < 20) {
    return 13;
  }

  if (speedKph < 60) {
    return 12;
  }

  return 11;
}
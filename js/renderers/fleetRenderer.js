import { formatAverageSpeed, formatDistance, formatDuration } from "../unitUtils.js";
import { summarizeVehicleHealth } from "../telemetryRules.js";
import { escapeHtml } from "./common.js";

export function renderFleetList(container, vehicles, selectedVehicleId) {
  container.innerHTML = vehicles
    .map((vehicle) => {
      const alerts = summarizeVehicleHealth(vehicle);
      const isSelected = vehicle.id === selectedVehicleId;

      return `
        <button class="fleet-button${isSelected ? " is-active" : ""}" type="button" data-vehicle-id="${escapeHtml(vehicle.id)}" aria-selected="${String(isSelected)}">
          <span class="fleet-button-inner">
            <span class="fleet-button-top">
              <span>
                <strong class="fleet-name">${escapeHtml(vehicle.badge)}</strong>
                <span class="fleet-copy">${escapeHtml(vehicle.modelName)}</span>
              </span>
              <span class="fleet-status">
                <i class="fleet-status-dot${alerts.isCritical ? " is-critical" : alerts.isWarning ? " is-warning" : ""}"></i>
                ${escapeHtml(vehicle.telemetry.connectionStatus)}
              </span>
            </span>
            <span class="fleet-button-bottom">
              <span class="fleet-copy">${escapeHtml(vehicle.telemetry.gps.regionLabel)}</span>
              <span class="fleet-copy">${Math.round(vehicle.telemetry.speedKph)} km/h</span>
            </span>
          </span>
        </button>
      `;
    })
    .join("");
}

export function renderTrips(container, trips, unitSystem) {
  container.innerHTML = trips
    .map(
      (trip) => `
        <article class="widget trip-card">
          <p class="widget-label">${escapeHtml(trip.label)}</p>
          <h3>${escapeHtml(trip.title)}</h3>
          <p>${escapeHtml(formatDistance(trip.distanceKm, unitSystem))}, ${escapeHtml(formatDuration(trip.durationMin))}, average ${escapeHtml(formatAverageSpeed(trip.avgSpeedKph, unitSystem))}, ${escapeHtml(trip.terrain)} terrain.</p>
        </article>
      `
    )
    .join("");
}

export function renderFleetDiagnostics(container, vehicles, unitSystem) {
  container.innerHTML = vehicles
    .map((vehicle) => {
      const alerts = summarizeVehicleHealth(vehicle);
      const condition = alerts.isCritical ? "Critical" : alerts.isWarning ? "Watch" : "Nominal";

      return `
        <div class="health-chip">
          <div>
            <strong>${escapeHtml(vehicle.badge)}</strong>
            <div>${escapeHtml(vehicle.telemetry.gps.regionLabel)}</div>
          </div>
          <div>
            <strong>${escapeHtml(condition)}</strong>
            <div>${escapeHtml(formatAverageSpeed(vehicle.telemetry.speedKph, unitSystem))}</div>
          </div>
        </div>
      `;
    })
    .join("");
}
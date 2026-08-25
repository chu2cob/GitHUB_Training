import {
  formatAverageSpeed,
  formatCoordinate,
  formatDistance,
  formatDuration,
  formatPercent,
  formatRelativeTime,
  formatSpeed,
  formatTemperature
} from "../unitUtils.js";
import { TELEMETRY_THRESHOLDS } from "../telemetryRules.js";
import { clampRatio, setProgressSeverity, setSeverityClass } from "./common.js";

export function renderTelemetryPanels(elements, selectedVehicle, unitSystem, selectedAlerts) {
  const telemetry = selectedVehicle.telemetry;
  const speed = formatSpeed(telemetry.speedKph, unitSystem);
  const temperature = formatTemperature(telemetry.engineTempC, unitSystem);

  elements.speedValue.textContent = String(speed.value);
  elements.speedUnit.textContent = speed.unit;
  elements.speedGauge.style.setProperty("--gauge-value", String(clampRatio(telemetry.speedKph / 180)));
  elements.speedTrend.textContent = telemetry.speedKph > 95 ? "High load" : "Nominal";

  elements.rpmValue.textContent = String(Math.round(telemetry.rpm));
  elements.rpmGauge.style.setProperty("--gauge-value", String(clampRatio(telemetry.rpm / 7000)));
  elements.gearValue.textContent = telemetry.gear;

  renderProgressMetric(elements.fuelValue, elements.fuelBar, telemetry.fuelPercent, elements.fuelState, TELEMETRY_THRESHOLDS.fuel.warning, TELEMETRY_THRESHOLDS.fuel.critical);
  renderProgressMetric(
    elements.batteryValue,
    elements.batteryBar,
    telemetry.batteryPercent,
    elements.batteryState,
    TELEMETRY_THRESHOLDS.battery.warning,
    TELEMETRY_THRESHOLDS.battery.critical,
    "Charging Ready",
    "Low Reserve",
    "Critical Reserve"
  );

  elements.tempValue.textContent = `${temperature.value}${temperature.unit}`;
  elements.tempBar.style.width = `${clampRatio(telemetry.engineTempC / 140) * 100}%`;
  elements.tempState.textContent = telemetry.engineTempC > TELEMETRY_THRESHOLDS.engineTempC.warning ? "Elevated" : "Stable";
  setSeverityClass(
    elements.tempValue,
    telemetry.engineTempC > TELEMETRY_THRESHOLDS.engineTempC.warning,
    telemetry.engineTempC > TELEMETRY_THRESHOLDS.engineTempC.critical
  );
  setProgressSeverity(
    elements.tempBar,
    telemetry.engineTempC > TELEMETRY_THRESHOLDS.engineTempC.warning,
    telemetry.engineTempC > TELEMETRY_THRESHOLDS.engineTempC.critical
  );

  elements.terrainMode.textContent = telemetry.terrainMode;
  elements.terrainSupporting.textContent = describeTerrainMode(telemetry.terrainMode);

  elements.gpsHeading.textContent = `${telemetry.gps.heading}°`;
  elements.gpsRegion.textContent = telemetry.gps.regionLabel;
  elements.gpsLat.textContent = formatCoordinate(telemetry.gps.lat);
  elements.gpsLng.textContent = formatCoordinate(telemetry.gps.lng);
  elements.gpsProgress.textContent = `${Math.round(clampRatio(telemetry.gps.routeProgress) * 100)}%`;
  elements.gpsSyncState.textContent = telemetry.connectionStatus === "Live" ? "Fresh sync" : telemetry.connectionStatus;
  elements.gpsLastSync.textContent = formatRelativeTime(telemetry.lastSyncIso);
  elements.mapRegionBadge.textContent = telemetry.gps.regionLabel;

  elements.tripState.textContent = telemetry.connectionStatus === "Live" ? "On Route" : telemetry.connectionStatus;
  elements.tripDistance.textContent = formatDistance(telemetry.tripDistanceKm, unitSystem);
  elements.tripDuration.textContent = formatDuration(telemetry.tripDurationMin);
  elements.tripAverageSpeed.textContent = formatAverageSpeed(telemetry.avgSpeedKph, unitSystem);

  renderTires(elements, telemetry.tirePressurePsi);
  elements.vinValue.textContent = selectedVehicle.vin;
  elements.firmwareValue.textContent = selectedVehicle.firmwareVersion;
  elements.lastSyncValue.textContent = formatRelativeTime(telemetry.lastSyncIso);
  elements.diagSync.textContent = formatRelativeTime(telemetry.lastSyncIso);
  elements.healthSummary.textContent = selectedAlerts[0]?.severity === "ok" ? "All systems nominal" : "Action required";
  elements.diagBattery.textContent = telemetry.batteryPercent < TELEMETRY_THRESHOLDS.battery.warning ? "Reduced" : "Ready";
  elements.diagCooling.textContent = telemetry.engineTempC > TELEMETRY_THRESHOLDS.engineTempC.warning ? "Elevated" : "Nominal";
}

function renderProgressMetric(
  valueElement,
  barElement,
  rawValue,
  stateElement,
  warningThreshold,
  criticalThreshold,
  okText = "Healthy",
  warningText = "Watch",
  criticalText = "Critical"
) {
  valueElement.textContent = formatPercent(rawValue);
  barElement.style.width = `${clampRatio(rawValue / 100) * 100}%`;
  const isWarning = rawValue < warningThreshold;
  const isCritical = rawValue < criticalThreshold;
  stateElement.textContent = isCritical ? criticalText : isWarning ? warningText : okText;
  setSeverityClass(valueElement, isWarning, isCritical);
  setProgressSeverity(barElement, isWarning, isCritical);
}

function renderTires(elements, tires) {
  renderTireCell(elements.tireFrontLeft, elements.tireFrontLeftValue, tires.frontLeft);
  renderTireCell(elements.tireFrontRight, elements.tireFrontRightValue, tires.frontRight);
  renderTireCell(elements.tireRearLeft, elements.tireRearLeftValue, tires.rearLeft);
  renderTireCell(elements.tireRearRight, elements.tireRearRightValue, tires.rearRight);
}

function renderTireCell(cellElement, valueElement, pressurePsi) {
  valueElement.textContent = String(Math.round(pressurePsi));
  setSeverityClass(
    cellElement,
    pressurePsi < TELEMETRY_THRESHOLDS.tirePressurePsi.warning,
    pressurePsi < TELEMETRY_THRESHOLDS.tirePressurePsi.critical
  );
}

function describeTerrainMode(mode) {
  switch (mode) {
    case "Grass/Gravel/Snow":
      return "Low-grip calibration with progressive traction control.";
    case "Mud/Ruts":
      return "Wheel slip tolerance increased for deeper surface tracking.";
    case "Sand":
      return "Throttle response sharpened for loose, high-drag terrain.";
    case "Rock Crawl":
      return "Precise low-speed torque delivery with descent control.";
    default:
      return "Adaptive torque distribution engaged.";
  }
}
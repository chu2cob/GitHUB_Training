export const TELEMETRY_THRESHOLDS = {
  fuel: { warning: 15, critical: 10 },
  engineTempC: { warning: 100, critical: 108 },
  battery: { warning: 20, critical: 12 },
  tirePressurePsi: { warning: 28, critical: 26 }
};

export const SEVERITY_RANK = { critical: 0, warning: 1, ok: 2 };

export function evaluateTelemetryBreaches(telemetry) {
  const alerts = [];
  const timestamp = telemetry.lastSyncIso;

  if (telemetry.connectionStatus !== "Live") {
    alerts.push({
      severity: telemetry.connectionStatus === "Delayed" ? "warning" : "critical",
      label: telemetry.connectionStatus === "Delayed" ? "Latency" : "Offline",
      message: `Telemetry connection is ${telemetry.connectionStatus.toLowerCase()}.`,
      timestamp
    });
  }

  if (telemetry.fuelPercent < TELEMETRY_THRESHOLDS.fuel.warning) {
    alerts.push({
      severity: telemetry.fuelPercent < TELEMETRY_THRESHOLDS.fuel.critical ? "critical" : "warning",
      label: "Fuel",
      message: `Fuel reserve low at ${Math.round(telemetry.fuelPercent)}%.`,
      timestamp
    });
  }

  if (telemetry.engineTempC > TELEMETRY_THRESHOLDS.engineTempC.warning) {
    alerts.push({
      severity: telemetry.engineTempC > TELEMETRY_THRESHOLDS.engineTempC.critical ? "critical" : "warning",
      label: "Cooling",
      message: `Engine temperature elevated at ${Math.round(telemetry.engineTempC)}°C.`,
      timestamp
    });
  }

  if (telemetry.batteryPercent < TELEMETRY_THRESHOLDS.battery.warning) {
    alerts.push({
      severity: telemetry.batteryPercent < TELEMETRY_THRESHOLDS.battery.critical ? "critical" : "warning",
      label: "Battery",
      message: `Battery support reduced to ${Math.round(telemetry.batteryPercent)}%.`,
      timestamp
    });
  }

  Object.entries(telemetry.tirePressurePsi).forEach(([position, value]) => {
    if (value < TELEMETRY_THRESHOLDS.tirePressurePsi.warning) {
      alerts.push({
        severity: value < TELEMETRY_THRESHOLDS.tirePressurePsi.critical ? "critical" : "warning",
        label: "Tire",
        message: `${humanizePosition(position)} pressure low at ${Math.round(value)} psi.`,
        timestamp
      });
    }
  });

  return alerts;
}

export function summarizeVehicleHealth(vehicle) {
  const telemetry = vehicle.telemetry || vehicle;
  const breaches = evaluateTelemetryBreaches(telemetry);

  return {
    isCritical: breaches.some((alert) => alert.severity === "critical"),
    isWarning: breaches.some((alert) => alert.severity === "warning")
  };
}

export function sortAlerts(alerts) {
  return alerts.sort((left, right) => SEVERITY_RANK[left.severity] - SEVERITY_RANK[right.severity]);
}

function humanizePosition(position) {
  return position
    .replace(/([A-Z])/g, " $1")
    .replace(/^./, (value) => value.toUpperCase());
}
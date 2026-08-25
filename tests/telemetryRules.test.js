import test from 'node:test';
import assert from 'node:assert/strict';

import {
  TELEMETRY_THRESHOLDS,
  evaluateTelemetryBreaches,
  summarizeVehicleHealth,
  sortAlerts
} from '../js/telemetryRules.js';

// BVA + ECP + Branch coverage for telemetry threshold logic.
// These tests validate the critical warning boundaries and ensure invalid or missing values fail gracefully.

test('TC-001: valid fuel above warning threshold remains healthy', () => {
  // BVA: fuel = just above lower valid threshold should stay in the healthy class.
  const telemetry = {
    connectionStatus: 'Live',
    fuelPercent: TELEMETRY_THRESHOLDS.fuel.warning + 1,
    engineTempC: 86,
    batteryPercent: 65,
    tirePressurePsi: { frontLeft: 32, frontRight: 32, rearLeft: 31, rearRight: 31 },
    lastSyncIso: new Date().toISOString()
  };

  const alerts = evaluateTelemetryBreaches(telemetry);
  assert.equal(alerts.length, 0);
});

test('TC-002: fuel at warning boundary triggers warning', () => {
  // BVA: exact threshold is the business boundary; this must be treated as warning, not healthy.
  const telemetry = {
    connectionStatus: 'Live',
    fuelPercent: TELEMETRY_THRESHOLDS.fuel.warning,
    engineTempC: 86,
    batteryPercent: 65,
    tirePressurePsi: { frontLeft: 32, frontRight: 32, rearLeft: 31, rearRight: 31 },
    lastSyncIso: new Date().toISOString()
  };

  const alerts = evaluateTelemetryBreaches(telemetry);
  assert.ok(alerts.some((alert) => alert.label === 'Fuel' && alert.severity === 'warning'));
});

test('TC-003: fuel below critical threshold triggers critical severity', () => {
  // BVA: crossing the critical threshold should escalate the alert severity.
  const telemetry = {
    connectionStatus: 'Live',
    fuelPercent: TELEMETRY_THRESHOLDS.fuel.critical - 1,
    engineTempC: 86,
    batteryPercent: 65,
    tirePressurePsi: { frontLeft: 32, frontRight: 32, rearLeft: 31, rearRight: 31 },
    lastSyncIso: new Date().toISOString()
  };

  const alerts = evaluateTelemetryBreaches(telemetry);
  assert.ok(alerts.some((alert) => alert.label === 'Fuel' && alert.severity === 'critical'));
});

test('TC-004: engine temperature at warning threshold is flagged', () => {
  // BVA: exact threshold is the boundary between nominal and warning states.
  const telemetry = {
    connectionStatus: 'Live',
    fuelPercent: 80,
    engineTempC: TELEMETRY_THRESHOLDS.engineTempC.warning,
    batteryPercent: 65,
    tirePressurePsi: { frontLeft: 32, frontRight: 32, rearLeft: 31, rearRight: 31 },
    lastSyncIso: new Date().toISOString()
  };

  const alerts = evaluateTelemetryBreaches(telemetry);
  assert.ok(alerts.some((alert) => alert.label === 'Cooling' && alert.severity === 'warning'));
});

test('TC-005: engine temperature beyond critical threshold escalates to critical', () => {
  // Branch coverage: tests the true branch where the critical condition is met.
  const telemetry = {
    connectionStatus: 'Live',
    fuelPercent: 80,
    engineTempC: TELEMETRY_THRESHOLDS.engineTempC.critical + 1,
    batteryPercent: 65,
    tirePressurePsi: { frontLeft: 32, frontRight: 32, rearLeft: 31, rearRight: 31 },
    lastSyncIso: new Date().toISOString()
  };

  const alerts = evaluateTelemetryBreaches(telemetry);
  assert.ok(alerts.some((alert) => alert.label === 'Cooling' && alert.severity === 'critical'));
});

test('TC-006: battery at warning boundary triggers warning alert', () => {
  // ECP: battery=warning boundary is a valid edge class that should not be ignored.
  const telemetry = {
    connectionStatus: 'Live',
    fuelPercent: 80,
    engineTempC: 90,
    batteryPercent: TELEMETRY_THRESHOLDS.battery.warning,
    tirePressurePsi: { frontLeft: 32, frontRight: 32, rearLeft: 31, rearRight: 31 },
    lastSyncIso: new Date().toISOString()
  };

  const alerts = evaluateTelemetryBreaches(telemetry);
  assert.ok(alerts.some((alert) => alert.label === 'Battery' && alert.severity === 'warning'));
});

test('TC-007: tire pressure at warning boundary raises a warning', () => {
  // BVA: tire pressure value exactly at the warning threshold should trigger the warning branch.
  const telemetry = {
    connectionStatus: 'Live',
    fuelPercent: 80,
    engineTempC: 90,
    batteryPercent: 70,
    tirePressurePsi: { frontLeft: TELEMETRY_THRESHOLDS.tirePressurePsi.warning, frontRight: 32, rearLeft: 31, rearRight: 31 },
    lastSyncIso: new Date().toISOString()
  };

  const alerts = evaluateTelemetryBreaches(telemetry);
  assert.ok(alerts.some((alert) => alert.label === 'Tire' && alert.severity === 'warning'));
});

test('TC-008: tire pressure below critical threshold is critical', () => {
  // Branch coverage: tests the critical branch for low tire pressure.
  const telemetry = {
    connectionStatus: 'Live',
    fuelPercent: 80,
    engineTempC: 90,
    batteryPercent: 70,
    tirePressurePsi: { frontLeft: TELEMETRY_THRESHOLDS.tirePressurePsi.critical - 1, frontRight: 32, rearLeft: 31, rearRight: 31 },
    lastSyncIso: new Date().toISOString()
  };

  const alerts = evaluateTelemetryBreaches(telemetry);
  assert.ok(alerts.some((alert) => alert.label === 'Tire' && alert.severity === 'critical'));
});

test('TC-009: delayed connection status produces warning', () => {
  // ECP: degraded telemetry connection should be handled as a warning classification.
  const telemetry = {
    connectionStatus: 'Delayed',
    fuelPercent: 80,
    engineTempC: 90,
    batteryPercent: 70,
    tirePressurePsi: { frontLeft: 32, frontRight: 32, rearLeft: 31, rearRight: 31 },
    lastSyncIso: new Date().toISOString()
  };

  const alerts = evaluateTelemetryBreaches(telemetry);
  assert.ok(alerts.some((alert) => alert.severity === 'warning' && alert.label === 'Latency'));
});

test('TC-010: offline connection status produces critical alert', () => {
  // Branch coverage: ensures disconnected telemetry is treated as critical.
  const telemetry = {
    connectionStatus: 'Offline',
    fuelPercent: 80,
    engineTempC: 90,
    batteryPercent: 70,
    tirePressurePsi: { frontLeft: 32, frontRight: 32, rearLeft: 31, rearRight: 31 },
    lastSyncIso: new Date().toISOString()
  };

  const alerts = evaluateTelemetryBreaches(telemetry);
  assert.ok(alerts.some((alert) => alert.severity === 'critical' && alert.label === 'Offline'));
});

test('TC-011: summarizeVehicleHealth marks critical when any alert is critical', () => {
  // ECP: aggregate health summary should collapse multiple telemetry breaches into the highest-severity state.
  const vehicle = {
    telemetry: {
      connectionStatus: 'Offline',
      fuelPercent: 5,
      engineTempC: 88,
      batteryPercent: 70,
      tirePressurePsi: { frontLeft: 30, frontRight: 30, rearLeft: 30, rearRight: 30 },
      lastSyncIso: new Date().toISOString()
    }
  };

  const summary = summarizeVehicleHealth(vehicle);
  assert.equal(summary.isCritical, true);
  assert.equal(summary.isWarning, false);
});

test('TC-012: sortAlerts sorts critical above warning and ok', () => {
  // Branch coverage: confirms ordering for severity ranking used by UI surfaces.
  const alerts = [
    { severity: 'ok', message: 'nominal' },
    { severity: 'critical', message: 'critical issue' },
    { severity: 'warning', message: 'warning issue' }
  ];

  const ordered = sortAlerts(alerts);
  assert.deepEqual(ordered.map((alert) => alert.severity), ['critical', 'warning', 'ok']);
});

test('TC-013: robustness test handles missing telemetry data gracefully', () => {
  // Robustness: missing values should not crash; the function should return a safe default behavior.
  const telemetry = {
    connectionStatus: undefined,
    fuelPercent: undefined,
    engineTempC: undefined,
    batteryPercent: undefined,
    tirePressurePsi: undefined,
    lastSyncIso: undefined
  };

  const alerts = evaluateTelemetryBreaches(telemetry);
  assert.ok(Array.isArray(alerts));
  assert.doesNotThrow(() => evaluateTelemetryBreaches(telemetry));
});

test('TC-014: robustness test handles NaN and non-numeric inputs safely', () => {
  // Robustness: NaN is an invalid numeric class that should not produce an unhandled runtime failure.
  const telemetry = {
    connectionStatus: 'Live',
    fuelPercent: Number.NaN,
    engineTempC: Number.NaN,
    batteryPercent: Number.NaN,
    tirePressurePsi: { frontLeft: Number.NaN, frontRight: 32, rearLeft: 31, rearRight: 31 },
    lastSyncIso: new Date().toISOString()
  };

  assert.doesNotThrow(() => evaluateTelemetryBreaches(telemetry));
  const alerts = evaluateTelemetryBreaches(telemetry);
  assert.ok(Array.isArray(alerts));
});

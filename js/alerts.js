const Alerts = (() => {
  const THRESHOLDS = {
    fuelLow: 15,
    engineTempHigh: 100,
    tireLow: 28,
    batteryLow: 20
  };

  function evaluate(state) {
    const alerts = [];
    const ts = new Date(state.lastSyncIso).toLocaleTimeString();

    if (state.fuelPercent < THRESHOLDS.fuelLow) {
      alerts.push({ severity: "critical", message: `Low fuel: ${Math.round(state.fuelPercent)}%`, ts });
    }
    if (state.engineTempC > THRESHOLDS.engineTempHigh) {
      alerts.push({ severity: "critical", message: `Engine temp high: ${Math.round(state.engineTempC)}°C`, ts });
    }
    if (state.batteryPercent < THRESHOLDS.batteryLow) {
      alerts.push({ severity: "warning", message: `Battery low: ${Math.round(state.batteryPercent)}%`, ts });
    }
    Object.entries(state.tirePressurePsi).forEach(([wheel, psi]) => {
      if (psi < THRESHOLDS.tireLow) {
        alerts.push({ severity: "warning", message: `Low tire pressure: ${wheel}`, ts });
      }
    });

    return alerts.sort((a, b) => a.severity === "critical" ? -1 : 1);
  }

  return { evaluate, THRESHOLDS };
})();
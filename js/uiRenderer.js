const UIRenderer = (() => {
  let unit = "metric";

  const els = {
    headerVehicleName: document.getElementById("headerVehicleName"),
    speedValue: document.getElementById("speedValue"),
    speedUnit: document.getElementById("speedUnit"),
    speedArc: document.getElementById("speedArc"),
    rpmValue: document.getElementById("rpmValue"),
    rpmArc: document.getElementById("rpmArc"),
    fuelBar: document.getElementById("fuelBar"),
    fuelValue: document.getElementById("fuelValue"),
    tempBar: document.getElementById("tempBar"),
    tempValue: document.getElementById("tempValue"),
    battBar: document.getElementById("battBar"),
    battValue: document.getElementById("battValue"),
    terrainModes: document.getElementById("terrainModes"),
    gpsLat: document.getElementById("gpsLat"),
    gpsLng: document.getElementById("gpsLng"),
    gpsHeading: document.getElementById("gpsHeading"),
    gpsRegion: document.getElementById("gpsRegion"),
    alertsList: document.getElementById("alertsList"),
    connDot: document.getElementById("connDot"),
    connLabel: document.getElementById("connLabel"),
    footerVin: document.getElementById("footerVin"),
    footerFw: document.getElementById("footerFw"),
    footerSync: document.getElementById("footerSync"),
  };

  const ARC_LENGTH = 251;

  function setUnit(u) { unit = u; }

  function render(state) {
    if (!state) return;

    els.headerVehicleName.textContent = state.name;

    // Speed
    els.speedValue.textContent = unit === "imperial"
      ? Math.round(UnitUtils.kmhToMph(state.speedKph))
      : Math.round(state.speedKph);
    els.speedUnit.textContent = unit === "imperial" ? "mph" : "km/h";
    const speedPct = Math.min(state.speedKph / 180, 1);
    els.speedArc.style.strokeDashoffset = ARC_LENGTH - (ARC_LENGTH * speedPct);

    // RPM
    els.rpmValue.textContent = Math.round(state.rpm);
    const rpmPct = Math.min(state.rpm / 6500, 1);
    els.rpmArc.style.strokeDashoffset = ARC_LENGTH - (ARC_LENGTH * rpmPct);

    // Fuel
    els.fuelBar.style.width = state.fuelPercent + "%";
    els.fuelValue.textContent = Math.round(state.fuelPercent) + "%";
    els.fuelBar.style.background = state.fuelPercent < Alerts.THRESHOLDS.fuelLow ? "var(--critical)" : "var(--primary)";

    // Temp
    const tempPct = Math.min((state.engineTempC - 60) / 60, 1) * 100;
    els.tempBar.style.width = Math.max(0, tempPct) + "%";
    els.tempValue.textContent = UnitUtils.formatTemp(state.engineTempC, unit);
    els.tempBar.style.background = state.engineTempC > Alerts.THRESHOLDS.engineTempHigh ? "var(--critical)" : "var(--primary)";

    // Battery
    els.battBar.style.width = state.batteryPercent + "%";
    els.battValue.textContent = Math.round(state.batteryPercent) + "%";
    els.battBar.style.background = state.batteryPercent < Alerts.THRESHOLDS.batteryLow ? "var(--critical)" : "var(--secondary)";

    // Terrain
    [...els.terrainModes.children].forEach(span => {
      span.classList.toggle("active", span.dataset.mode === state.terrainMode);
    });

    // Tires
    renderTire("tireFL", state.tirePressurePsi.frontLeft);
    renderTire("tireFR", state.tirePressurePsi.frontRight);
    renderTire("tireRL", state.tirePressurePsi.rearLeft);
    renderTire("tireRR", state.tirePressurePsi.rearRight);

    // GPS
    els.gpsLat.textContent = state.gps.lat.toFixed(4);
    els.gpsLng.textContent = state.gps.lng.toFixed(4);
    els.gpsHeading.textContent = Math.round(state.gps.heading);
    els.gpsRegion.textContent = state.gps.regionLabel;

    // Connection
    els.connLabel.textContent = state.connectionStatus;

    // Footer
    els.footerVin.textContent = state.vin;
    els.footerFw.textContent = state.firmwareVersion;
    els.footerSync.textContent = new Date(state.lastSyncIso).toLocaleTimeString();

    // Alerts
    renderAlerts(Alerts.evaluate(state));
  }

  function renderTire(id, psi) {
    const el = document.getElementById(id);
    el.querySelector("span").textContent = UnitUtils.psiDisplay(psi);
    el.classList.toggle("warn", psi < Alerts.THRESHOLDS.tireLow);
  }

  function renderAlerts(alerts) {
    els.alertsList.innerHTML = "";
    if (alerts.length === 0) {
      els.alertsList.innerHTML = `<li class="alert-empty">All systems normal</li>`;
      return;
    }
    alerts.forEach(a => {
      const li = document.createElement("li");
      li.className = a.severity;
      li.textContent = `${a.message} — ${a.ts}`;
      els.alertsList.appendChild(li);
    });
  }

  return { render, setUnit };
})();
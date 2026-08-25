const DataSimulator = (() => {
  let state = {
    speedKph: 40,
    rpm: 1800,
    fuelPercent: 72,
    engineTempC: 88,
    batteryPercent: 65,
    tirePressurePsi: { frontLeft: 32, frontRight: 32, rearLeft: 31, rearRight: 31 },
    gps: { lat: 51.5074, lng: -0.1278, heading: 45, regionLabel: "Peak District" },
    terrainMode: "Auto",
    connectionStatus: "Live",
    vin: "SALGA2FE9NA000123",
    firmwareVersion: "v2.4.1",
    lastSyncIso: new Date().toISOString()
  };

  const terrainCycle = ["Auto", "Grass/Gravel/Snow", "Mud/Ruts", "Sand", "Rock Crawl"];
  let terrainIdx = 0;
  let tick = 0;
  let listeners = [];

  function clamp(v, min, max) { return Math.max(min, Math.min(max, v)); }
  function drift(v, amount, min, max) { return clamp(v + (Math.random() * 2 - 1) * amount, min, max); }

  function step() {
    tick++;
    state.speedKph = drift(state.speedKph, 6, 0, 180);
    state.rpm = clamp(800 + state.speedKph * 35 + (Math.random() * 200 - 100), 700, 6500);
    state.fuelPercent = clamp(state.fuelPercent - Math.random() * 0.05, 0, 100);
    state.engineTempC = drift(state.engineTempC, 1.5, 75, 105);
    state.batteryPercent = drift(state.batteryPercent, 0.3, 0, 100);

    state.tirePressurePsi.frontLeft = drift(state.tirePressurePsi.frontLeft, 0.3, 24, 36);
    state.tirePressurePsi.frontRight = drift(state.tirePressurePsi.frontRight, 0.3, 24, 36);
    state.tirePressurePsi.rearLeft = drift(state.tirePressurePsi.rearLeft, 0.3, 24, 36);
    state.tirePressurePsi.rearRight = drift(state.tirePressurePsi.rearRight, 0.3, 24, 36);

    state.gps.lat += (Math.random() - 0.5) * 0.001;
    state.gps.lng += (Math.random() - 0.5) * 0.001;
    state.gps.heading = (state.gps.heading + Math.random() * 8 - 4 + 360) % 360;

    if (tick % 15 === 0) {
      terrainIdx = (terrainIdx + 1) % terrainCycle.length;
      state.terrainMode = terrainCycle[terrainIdx];
    }

    state.lastSyncIso = new Date().toISOString();
    listeners.forEach(fn => fn(state));
  }

  function subscribe(fn) { listeners.push(fn); }
  function start(intervalMs = 1500) { step(); return setInterval(step, intervalMs); }
  function getState() { return state; }

  return { start, subscribe, getState };
})();
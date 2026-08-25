const FleetSimulator = (() => {
  const VEHICLE_TEMPLATES = [
    { id: "v1", name: "Defender 01", vin: "SALGA2FE9NA000123", baseLat: 51.5074, baseLng: -0.1278 },
    { id: "v2", name: "Discovery 02", vin: "SALGA2FE9NA000456", baseLat: 51.515, baseLng: -0.14 },
    { id: "v3", name: "Range Rover 03", vin: "SALGA2FE9NA000789", baseLat: 51.50, baseLng: -0.12 },
    { id: "v4", name: "Defender 04", vin: "SALGA2FE9NA000999", baseLat: 51.495, baseLng: -0.135 },
  ];

  const terrainCycle = ["Auto", "Grass/Gravel/Snow", "Mud/Ruts", "Sand", "Rock Crawl"];
  let vehicles = {};
  let listeners = [];
  let tick = 0;

  function clamp(v, min, max) { return Math.max(min, Math.min(max, v)); }
  function drift(v, amount, min, max) { return clamp(v + (Math.random() * 2 - 1) * amount, min, max); }

  function init() {
    VEHICLE_TEMPLATES.forEach(t => {
      vehicles[t.id] = {
        id: t.id, name: t.name, vin: t.vin, firmwareVersion: "v2.4.1",
        speedKph: 30 + Math.random() * 40,
        rpm: 1800,
        fuelPercent: 60 + Math.random() * 30,
        engineTempC: 85 + Math.random() * 8,
        batteryPercent: 50 + Math.random() * 40,
        tirePressurePsi: { frontLeft: 32, frontRight: 32, rearLeft: 31, rearRight: 31 },
        gps: { lat: t.baseLat, lng: t.baseLng, heading: Math.random() * 360, regionLabel: "Peak District" },
        terrainMode: "Auto",
        terrainIdx: 0,
        connectionStatus: "Live",
        lastSyncIso: new Date().toISOString()
      };
    });
  }

  function step() {
    tick++;
    Object.values(vehicles).forEach(v => {
      v.speedKph = drift(v.speedKph, 6, 0, 180);
      v.rpm = clamp(800 + v.speedKph * 35 + (Math.random() * 200 - 100), 700, 6500);
      v.fuelPercent = clamp(v.fuelPercent - Math.random() * 0.04, 0, 100);
      v.engineTempC = drift(v.engineTempC, 1.5, 75, 105);
      v.batteryPercent = drift(v.batteryPercent, 0.3, 0, 100);

      ["frontLeft","frontRight","rearLeft","rearRight"].forEach(w => {
        v.tirePressurePsi[w] = drift(v.tirePressurePsi[w], 0.3, 24, 36);
      });

      v.gps.lat += (Math.random() - 0.5) * 0.0015;
      v.gps.lng += (Math.random() - 0.5) * 0.0015;
      v.gps.heading = (v.gps.heading + Math.random() * 8 - 4 + 360) % 360;

      if (tick % 15 === 0) {
        v.terrainIdx = (v.terrainIdx + 1) % terrainCycle.length;
        v.terrainMode = terrainCycle[v.terrainIdx];
      }
      v.lastSyncIso = new Date().toISOString();
    });
    listeners.forEach(fn => fn(vehicles));
  }

  function subscribe(fn) { listeners.push(fn); }
  function start(intervalMs = 1500) { init(); step(); return setInterval(step, intervalMs); }
  function getVehicles() { return vehicles; }
  function getVehicle(id) { return vehicles[id]; }

  return { start, subscribe, getVehicles, getVehicle };
})();
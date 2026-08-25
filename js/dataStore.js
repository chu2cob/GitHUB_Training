const DataStore = (() => {
  const state = {
    vehicles: {},
    selectedVehicleId: "v1",
    unit: "metric",
    theme: "dark",
    palette: "titanium"
  };

  let listeners = [];

  function setVehicles(vehicles) {
    state.vehicles = vehicles;
    listeners.forEach((fn) => fn(state));
  }

  function setSelectedVehicleId(id) {
    state.selectedVehicleId = id;
    listeners.forEach((fn) => fn(state));
  }

  function subscribe(fn) {
    listeners.push(fn);
  }

  function getState() {
    return state;
  }

  return { setVehicles, setSelectedVehicleId, subscribe, getState };
})();

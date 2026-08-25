const Store = (() => {
  let state = { selectedVehicleId: "v1" };
  let listeners = [];

  function dispatch(action) {
    if (action.type === "SELECT_VEHICLE") {
      state.selectedVehicleId = action.payload;
      listeners.forEach(fn => fn(state));
    }
  }

  function subscribe(fn) { listeners.push(fn); }
  function getState() { return state; }

  return { dispatch, subscribe, getState };
})();
const FleetRenderer = (() => {
  const listEl = document.getElementById("fleetList");

  function render(vehicles, selectedId) {
    listEl.innerHTML = "";
    Object.values(vehicles).forEach(v => {
      const li = document.createElement("li");
      li.className = "fleet-item" + (v.id === selectedId ? " active" : "");
      const statusClass = (v.engineTempC > 100 || v.fuelPercent < 15) ? "warn" : "live";
      li.innerHTML = `
        <div class="fv-name">
          <span><span class="fleet-status-dot ${statusClass}"></span>${v.name}</span>
        </div>
        <div class="fv-meta">${Math.round(v.speedKph)} km/h · ${v.terrainMode}</div>
      `;
      li.addEventListener("click", () => Store.dispatch({ type: "SELECT_VEHICLE", payload: v.id }));
      listEl.appendChild(li);
    });
  }

  return { render };
})();
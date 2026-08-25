document.addEventListener("DOMContentLoaded", () => {
  ThemeManager.init();
  MapRenderer.init();

  let currentUnit = localStorage.getItem("dashUnit") || "metric";
  UIRenderer.setUnit(currentUnit);

  FleetSimulator.start(1500);

  FleetSimulator.subscribe((vehicles) => {
    const selectedId = Store.getState().selectedVehicleId;
    MapRenderer.renderVehicles(vehicles, selectedId);
    FleetRenderer.render(vehicles, selectedId);
    UIRenderer.render(vehicles[selectedId]);
  });

  Store.subscribe((state) => {
    const vehicles = FleetSimulator.getVehicles();
    const selected = vehicles[state.selectedVehicleId];
    UIRenderer.render(selected);
    FleetRenderer.render(vehicles, state.selectedVehicleId);
    MapRenderer.focusVehicle(selected);
  });

  // Theme
  document.getElementById("themeToggle").addEventListener("click", ThemeManager.toggleTheme);

  // Palette
  document.getElementById("paletteSelect").addEventListener("change", (e) => {
    ThemeManager.setPalette(e.target.value);
  });

  // Units
  document.getElementById("unitToggle").addEventListener("click", () => {
    currentUnit = currentUnit === "metric" ? "imperial" : "metric";
    localStorage.setItem("dashUnit", currentUnit);
    UIRenderer.setUnit(currentUnit);
    UIRenderer.render(FleetSimulator.getVehicle(Store.getState().selectedVehicleId));
  });

  // Nav
  const navButtons = document.querySelectorAll(".nav-btn");
  const viewOverview = document.getElementById("viewOverview");
  const viewSettings = document.getElementById("viewSettings");

  navButtons.forEach(btn => {
    btn.addEventListener("click", () => {
      navButtons.forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
      const isSettings = btn.dataset.view === "settings";
      viewOverview.classList.toggle("hidden", isSettings);
      viewSettings.classList.toggle("hidden", !isSettings);
    });
  });
});
export function renderHeaderSummary(elements, fleetState, selectedVehicle, fleetAlerts) {
  const criticalCount = fleetAlerts.filter((alert) => alert.severity === "critical").length;
  const warningCount = fleetAlerts.filter((alert) => alert.severity === "warning").length;
  const liveCount = fleetState.vehicles.filter((vehicle) => vehicle.telemetry.connectionStatus === "Live").length;

  elements.vehicleMeta.textContent = selectedVehicle.subtitle;
  elements.headerActiveVehicle.textContent = selectedVehicle.badge;
  elements.headerLiveCount.textContent = `${liveCount} / ${fleetState.vehicles.length}`;
  elements.headerAlertCount.textContent = String(criticalCount + warningCount);
  elements.selectedVehicleStatus.textContent = selectedVehicle.telemetry.connectionStatus;
  elements.selectedVehicleBadge.textContent = selectedVehicle.badge;
  elements.selectedVehicleName.textContent = selectedVehicle.modelName;
  elements.selectedVehicleSubtitle.textContent = selectedVehicle.subtitle;
  elements.selectedVinSummary.textContent = selectedVehicle.vin;
  elements.selectedFirmwareSummary.textContent = selectedVehicle.firmwareVersion;
  elements.selectedRegionSummary.textContent = selectedVehicle.telemetry.gps.regionLabel;
  elements.selectedOperatorSummary.textContent = selectedVehicle.operator;
  elements.fleetHealthBadge.textContent = criticalCount > 0 ? "Critical" : warningCount > 0 ? "Warning" : "Nominal";
  elements.criticalCount.textContent = String(criticalCount);
  elements.warningCount.textContent = String(warningCount);
}
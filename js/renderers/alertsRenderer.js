import { formatRelativeTime } from "../unitUtils.js";
import { escapeHtml } from "./common.js";

export function renderConnection(elements, connectionStatus) {
  elements.connectionChip.classList.remove("is-degraded", "is-offline");
  elements.diagConnection.textContent = connectionStatus;

  if (connectionStatus === "Delayed") {
    elements.connectionChip.classList.add("is-degraded");
    elements.connectionText.textContent = "Connection delayed";
    return;
  }

  if (connectionStatus === "Offline") {
    elements.connectionChip.classList.add("is-offline");
    elements.connectionText.textContent = "Connection offline";
    return;
  }

  elements.connectionText.textContent = "Live connection";
}

export function renderAlerts(listElement, alerts) {
  listElement.innerHTML = alerts
    .map(
      (alert) => `
        <li class="alert-item alert-item-${alert.severity}">
          <span class="alert-severity">${escapeHtml(alert.vehicleName || alert.label)}</span>
          <div>
            <p>${escapeHtml(alert.message)}</p>
            <time>${escapeHtml(formatRelativeTime(alert.timestamp))}</time>
          </div>
        </li>
      `
    )
    .join("");
}
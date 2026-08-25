export function clampRatio(value) {
  return Math.max(0, Math.min(1, value));
}

export function setSeverityClass(element, isWarning, isCritical) {
  element.classList.remove("is-warning", "is-critical");

  if (isCritical) {
    element.classList.add("is-critical");
    return;
  }

  if (isWarning) {
    element.classList.add("is-warning");
  }
}

export function setProgressSeverity(element, isWarning, isCritical) {
  element.style.background = isCritical
    ? "linear-gradient(90deg, #7b120f, #e10600)"
    : isWarning
      ? "linear-gradient(90deg, #7f541c, #d98d2b)"
      : "linear-gradient(90deg, #1a3c2e, #b0b3b8)";
}

export function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}
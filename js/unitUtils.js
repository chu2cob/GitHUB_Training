const UnitUtils = {
  kmhToMph: (kmh) => kmh * 0.621371,
  celsiusToFahrenheit: (c) => (c * 9/5) + 32,
  psiDisplay: (psi) => psi.toFixed(1),
  formatSpeed: (kmh, unit) => unit === "imperial"
    ? Math.round(UnitUtils.kmhToMph(kmh)) + " mph"
    : Math.round(kmh) + " km/h",
  formatTemp: (c, unit) => unit === "imperial"
    ? Math.round(UnitUtils.celsiusToFahrenheit(c)) + " °F"
    : Math.round(c) + " °C"
};
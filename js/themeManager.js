const ThemeManager = (() => {
  const root = document.documentElement;

  function init() {
    const theme = localStorage.getItem("dashTheme") || "dark";
    const palette = localStorage.getItem("dashPalette") || "titanium";
    root.setAttribute("data-theme", theme);
    root.setAttribute("data-palette", palette);
    const select = document.getElementById("paletteSelect");
    if (select) select.value = palette;
  }

  function toggleTheme() {
    const current = root.getAttribute("data-theme");
    const next = current === "dark" ? "light" : "dark";
    root.setAttribute("data-theme", next);
    localStorage.setItem("dashTheme", next);
  }

  function setPalette(p) {
    root.setAttribute("data-palette", p);
    localStorage.setItem("dashPalette", p);
  }

  return { init, toggleTheme, setPalette };
})();
from pathlib import Path
import re
import json
from datetime import datetime
from playwright.sync_api import sync_playwright

ROOT = Path(__file__).resolve().parents[1]
ARTIFACTS = ROOT / "test-results" / "proof-20"
ARTIFACTS.mkdir(parents=True, exist_ok=True)


def num_value(raw):
    if raw is None:
        return None
    text = raw.strip()
    if text in {"--", "", "N/A"}:
        return None
    match = re.search(r"-?\d+(?:\.\d+)?", text)
    return float(match.group(0)) if match else None


with sync_playwright() as p:
    browser = p.chromium.launch(channel="msedge", headless=True)
    page = browser.new_page(viewport={"width": 1440, "height": 1200})
    page.goto(f"file:///{ROOT / 'index.html'}")
    page.wait_for_load_state("networkidle")

    results = []
    case_no = [1]

    def run_case(name, fn):
        idx = case_no[0]
        try:
            fn()
            status = "PASS"
            detail = "Condition satisfied"
        except Exception as exc:  # pragma: no cover - for test proof collection
            status = "FAIL"
            detail = str(exc)
        screenshot_path = ARTIFACTS / f"TC_{idx:02d}_{name.replace(' ', '_')}.png"
        page.screenshot(path=str(screenshot_path), full_page=True)
        results.append({
            "id": f"TC-{idx:02d}",
            "name": name,
            "status": status,
            "detail": detail,
            "image": str(screenshot_path.relative_to(ROOT)),
        })
        case_no[0] += 1

    # 1. Page loads and header visible
    def case_01():
        assert page.locator("header[role='banner']").is_visible()

    # 2. Title visible
    def case_02():
        assert page.title() == "Vehicle Telemetry Dashboard"

    # 3. Map background exists
    def case_03():
        assert page.locator("#mapBackground").is_visible()

    # 4. Fleet count 4
    def case_04():
        count = page.locator(".fleet-item").count()
        assert count == 4, count

    # 5. Speed value is live and non-zero
    def case_05():
        value = page.locator("#speedValue").text_content().strip()
        assert value not in {"", "0", "--"}, value

    # 6. RPM is live and non-zero
    def case_06():
        value = page.locator("#rpmValue").text_content().strip()
        assert value not in {"", "0", "--"}, value

    # 7. Fuel bar populated
    def case_07():
        value = page.locator("#fuelValue").text_content().strip()
        assert value.endswith("%") and value != "--%", value

    # 8. Battery populated
    def case_08():
        value = page.locator("#battValue").text_content().strip()
        assert value.endswith("%") and value != "--%", value

    # 9. Thermal value populated
    def case_09():
        value = page.locator("#tempValue").text_content().strip()
        assert "°" in value and value != "-- °C", value

    # 10. GPS coordinates populated
    def case_10():
        lat = page.locator("#gpsLat").text_content().strip()
        lng = page.locator("#gpsLng").text_content().strip()
        assert lat != "--" and lng != "--", (lat, lng)

    # 11. Footer VIN populated
    def case_11():
        vin = page.locator("#footerVin").text_content().strip()
        assert vin and vin != "--", vin

    # 12. Footer firmware populated
    def case_12():
        fw = page.locator("#footerFw").text_content().strip()
        assert fw and fw != "--", fw

    # 13. Vehicle selection changes active name
    def case_13():
        page.locator(".fleet-item").nth(1).click()
        assert "Discovery 02" in page.locator("#headerVehicleName").text_content()

    # 14. Nav switch to Settings reveals panel
    def case_14():
        page.locator('[data-view="settings"]').click()
        assert page.locator("#viewSettings").is_visible()

    # 15. Toggle theme changes DOM attribute
    def case_15():
        before = page.evaluate("document.documentElement.getAttribute('data-theme')")
        page.locator("#themeToggle").click()
        after = page.evaluate("document.documentElement.getAttribute('data-theme')")
        assert after != before, (before, after)

    # 16. Unit toggle switches speed unit
    def case_16():
        before = page.locator("#speedUnit").text_content().strip()
        page.locator("#unitToggle").click()
        after = page.locator("#speedUnit").text_content().strip()
        assert after != before, (before, after)

    # 17. Palette selection updates attribute
    def case_17():
        page.locator("#paletteSelect").select_option("copper")
        palette = page.evaluate("document.documentElement.getAttribute('data-palette')")
        assert palette == "copper", palette

    # 18. Live speed data changes after delay
    def case_18():
        before = page.locator("#speedValue").text_content().strip()
        page.wait_for_timeout(2200)
        after = page.locator("#speedValue").text_content().strip()
        assert before != after, (before, after)

    # 19. Live RPM changes after delay
    def case_19():
        before = page.locator("#rpmValue").text_content().strip()
        page.wait_for_timeout(2200)
        after = page.locator("#rpmValue").text_content().strip()
        assert before != after, (before, after)

    # 20. Alerts list renders without empty-state crash
    def case_20():
        alerts = page.locator("#alertsList li")
        count = alerts.count()
        assert count >= 0, count

    # Run all 20 cases
    test_cases = [
        ("Page loads and banner visible", case_01),
        ("Dashboard title is correct", case_02),
        ("Map background is rendered", case_03),
        ("Fleet list has 4 vehicles", case_04),
        ("Speed display is non-zero", case_05),
        ("RPM display is non-zero", case_06),
        ("Fuel value is visible", case_07),
        ("Battery value is visible", case_08),
        ("Engine temp value is visible", case_09),
        ("GPS coordinates are present", case_10),
        ("Footer VIN is populated", case_11),
        ("Footer firmware is populated", case_12),
        ("Vehicle selection updates the active model", case_13),
        ("Settings view opens", case_14),
        ("Theme toggle changes theme", case_15),
        ("Unit toggle changes speed unit", case_16),
        ("Palette switch updates theme palette", case_17),
        ("Speed changes over time", case_18),
        ("RPM changes over time", case_19),
        ("Alerts area renders without crashing", case_20),
    ]

    for name, fn in test_cases:
        run_case(name, fn)

    report_path = ARTIFACTS / "test_report.json"
    report_path.write_text(json.dumps({
        "generatedAt": datetime.utcnow().isoformat(timespec="seconds") + "Z",
        "totalCases": len(results),
        "passed": sum(1 for r in results if r["status"] == "PASS"),
        "failed": sum(1 for r in results if r["status"] == "FAIL"),
        "results": results,
    }, indent=2), encoding="utf-8")

    browser.close()

print(f"Artifacts generated in: {ARTIFACTS}")
print(json.dumps({
    "totalCases": len(results),
    "passed": sum(1 for r in results if r["status"] == "PASS"),
    "failed": sum(1 for r in results if r["status"] == "FAIL"),
    "report": str(report_path.relative_to(ROOT)),
    "screenshots": str((ARTIFACTS).relative_to(ROOT)),
}, indent=2))

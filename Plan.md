# Vehicle Telemetry Visualization Dashboard Plan

## Project Summary

Design and build a responsive web-based Vehicle Telemetry Visualization Dashboard using HTML, CSS, and vanilla JavaScript, with Leaflet.js for live mapping. The interface should communicate a premium rugged-luxury feel inspired by modern automotive HMI systems, while staying original and free of licensed brand assets. The dashboard presents simulated live telemetry for multiple vehicles concurrently, with a live location map rendered as a background layer and a fleet roster for monitoring and switching between vehicles, in a unified, glanceable, and actionable format for driver, engineering, and fleet-monitoring scenarios.

## Primary Goal

Create a modular frontend that:

- visualizes at least 8 real-time telemetry widgets for the selected vehicle
- monitors and displays multiple vehicles simultaneously via a live map and fleet roster
- updates simulated vehicle data every 1-2 seconds without page reloads
- renders a live location map as a background layer, with per-vehicle markers, selection highlighting, and pan-to-follow behavior
- supports both dark and light themes with preference persistence
- supports six selectable accent color palettes with persistence
- supports metric and imperial units with correct conversions
- remains accessible, responsive, and performant
- can later swap mock telemetry for WebSocket or REST-based live feeds with minimal refactoring

## Users and Use Cases

### Drivers

- Need fast, glanceable status indicators
- Need warnings to stand out immediately
- Need readable layout in constrained in-vehicle landscape displays

### Test Engineers

- Need richer diagnostics visibility
- Need consistent update cadence for simulated telemetry
- Need clear separation between overview and diagnostic views

### Fleet Managers

- Need high-level status and alerts across multiple vehicles
- Need to visually locate all vehicles on a live map at once
- Need to select any vehicle from a roster and instantly inspect its full telemetry
- Need location/trip context per vehicle
- Need connection and sync visibility

## Experience Principles

### Visual Direction

- Dark-first premium interface with a live map rendered behind translucent, frosted-glass dashboard surfaces
- Deep, muted, selectable accent palette with metallic secondary tones
- Strong contrast with restrained red only for critical alerts
- Minimal but not sterile: precise typography, layered panels, subtle gradients, technical surfaces
- Map is desaturated and dimmed so it reads as ambient context, not a competing focal point

### Functional Direction

- Glanceable key metrics first, scoped to the selected vehicle
- Fleet roster always visible for quick vehicle switching
- Alerts always visible
- Smooth transitions with no abrupt jumps
- Clear separation between status, diagnostics, and trip context
- Map markers update live and clearly reflect selection state

### Brand-Safe Interpretation

- Use placeholder text branding rather than official logos
- Use a Land Rover-inspired palette and rugged-luxury UI language without copying proprietary assets

## Information Architecture

### Global Shell

- Live map background (full viewport, layered beneath UI)
- Fleet rail (persistent left-side vehicle roster)
- Header
- Primary navigation
- Main telemetry grid (reflects currently selected vehicle)
- Alerts panel
- Footer system metadata bar

### Views

#### 1. Overview

- Speed
- RPM
- Fuel level
- Engine temperature
- Battery status
- Terrain mode
- GPS/location summary
- Live alerts
- All scoped to the currently selected vehicle

#### 2. Diagnostics

- Tire pressure layout
- Expanded engine/battery health indicators
- Connection health
- Sensor state summary

#### 3. Trip History

- Placeholder recent trip cards
- Distance, duration, average speed, terrain usage summary
- Prepared structure for future real API integration

#### 4. Settings

- Theme toggle
- Palette selector (6 options)
- Unit toggle
- Simulation interval control if desired
- Accessibility preferences placeholder

## Fleet Monitoring Model

### Fleet Rail

- Persistent left-side panel listing all active vehicles
- Each entry shows vehicle name, live speed, terrain mode, and a status dot (normal/warning)
- Clicking an entry selects that vehicle and updates the entire dashboard

### Live Map

- Rendered as a fixed full-viewport background layer (Leaflet.js, dark tile basemap)
- Displays a marker per vehicle, updated live each simulation tick
- Selected vehicle's marker is visually highlighted
- Clicking a marker selects that vehicle (mirrors fleet rail behavior)
- Map recenters/pans to follow the selected vehicle
- Dashboard cards float above the map using frosted-glass surfaces for readability

### Selection State

- A lightweight central store (`store.js`) tracks the currently selected vehicle ID
- All renderers (telemetry, alerts, fleet rail, map, header) subscribe to selection changes and update in sync

## Required Widgets

The dashboard must render these live widgets at minimum, scoped to the selected vehicle:

1. Speedometer
2. RPM gauge
3. Fuel level meter
4. Engine temperature meter
5. Battery status meter
6. Tire pressure widget with 4-wheel layout
7. GPS/location indicator (coordinates, heading, region)
8. Terrain mode indicator

Additional supporting elements:

- Live map background with all-vehicle markers
- Fleet rail roster with per-vehicle summary and status
- Connection status indicator
- Live alerts panel (per selected vehicle)
- Last sync timestamp
- VIN and firmware footer metadata

## Layout Plan

### Desktop >= 1440px

- Fixed live map background across full viewport
- Fleet rail docked left (220px), scrollable
- Header and footer span remaining width
- 12-column dashboard grid for telemetry cards
- Large hero telemetry cards for speed and RPM
- Secondary cards for fuel, temperature, battery, terrain mode
- Dedicated right-side alerts column
- Full-width lower row for tire layout and GPS module

### Tablet 768px-1024px

- Fleet rail collapses (hidden) to preserve space; reintroduced as a toggleable drawer in a future iteration
- Convert to stacked top navigation
- 2-column content grid
- Alerts move below primary telemetry row
- Preserve large touch targets and readable spacing

### In-Vehicle 1280x480 Landscape

- Compress shell height
- Fleet rail hidden; single-vehicle focus assumed
- Prioritize speed, RPM, terrain, fuel, engine temp, and alerts
- Reduce non-essential text density
- Use wider, shorter cards with concise labels

## Visual Design System

### Color Palette Options

The dashboard supports multiple selectable accent palettes, all built on a near-black base for premium contrast. Users can switch palettes via a control in Settings; the active palette persists in `localStorage` alongside theme and unit preferences.

#### Option 1 — Titanium & Ember (default)

- Base background: `#0C0D0F`
- Primary accent: `#3A4750`
- Secondary accent: `#C4C9CC`
- Critical alert: `#FF3B30`
- Support neutrals: gunmetal, ash, cool white
- Mood: cold, precise, aerospace-grade instrumentation

#### Option 2 — Copper & Slate

- Base background: `#111111`
- Primary accent: `#B5651D`
- Secondary accent: `#8A8D91`
- Critical alert: `#E63946`
- Support neutrals: charcoal, bronze-grey, warm white
- Mood: warm luxury off-road, leather + metal

#### Option 3 — Arctic Blue

- Base background: `#0A0E14`
- Primary accent: `#2C4A6E`
- Secondary accent: `#AAB4BD`
- Critical alert: `#FF453A`
- Support neutrals: ice grey, deep navy, cool white
- Mood: clean, cold-weather rugged, high legibility

#### Option 4 — Amber & Carbon

- Base background: `#0D0D0D`
- Primary accent: `#D98E04`
- Secondary accent: `#9A9A9A`
- Critical alert: `#FF1744`
- Support neutrals: soot black, warm grey, cream white
- Mood: retro-analog aviation dashboard, amber-on-black

#### Option 5 — Graphite & Cyan

- Base background: `#0B0C10`
- Primary accent: `#00B4D8`
- Secondary accent: `#8D99AE`
- Critical alert: `#EF233C`
- Support neutrals: deep slate, steel grey, soft white
- Mood: futuristic EV/hybrid digital cockpit

#### Option 6 — Deep Bronze & Ivory

- Base background: `#111010`
- Primary accent: `#8C6A3F`
- Secondary accent: `#C9C4B8`
- Critical alert: `#C1121F`
- Support neutrals: espresso brown, taupe, warm off-white
- Mood: heritage luxury, expedition-grade interior feel

### Typography

- Strong, modern sans-serif stack with technical clarity
- Large numeric typography for speed and RPM
- Smaller uppercase labels for telemetry categories
- Readable line-height and sufficient weight contrast

### Surface Treatment

- Live map dimmed/desaturated as ambient background (grayscale + brightness filter)
- Dashboard cards use frosted-glass surfaces (semi-transparent + backdrop blur) so the map remains visible beneath the UI
- Layered panel backgrounds with subtle gradients
- Soft inner borders or low-contrast strokes
- Controlled glow/highlight only for active or critical states, including selected vehicle markers
- Metallic-style accents for controls and separators

### Motion

- 300–500ms transitions on gauge values and progress fills
- Soft pulse on live connection status
- Gentle alert entrance animation
- Map pans smoothly to selected vehicle on switch
- No excessive decorative motion

## Accessibility Requirements

- WCAG 2.1 AA contrast minimums (validated against frosted-glass card backgrounds over the map)
- Semantic HTML landmarks for header, nav, main, aside, footer
- Keyboard-navigable controls with visible focus states, including fleet rail entries
- ARIA labels for toggles, nav items, fleet list items, and telemetry widgets where needed
- Status updates readable by assistive technologies where appropriate
- Avoid color-only communication for warnings; pair with text and iconography
- Map interactions (marker click) must have equivalent non-map interaction (fleet rail click)

## Performance Requirements

- Initial load target under 2 seconds on broadband (map tiles load asynchronously and do not block first render)
- Avoid heavy frameworks
- Use CSS transforms and efficient DOM updates for smooth rendering
- Batch DOM updates per telemetry cycle across all vehicles
- Keep simulation and rendering logic separated
- Only re-render full telemetry widgets for the selected vehicle; map markers update independently for all vehicles
- Defer non-critical visual enhancements if needed

## Technical Architecture

### File Responsibilities

#### index.html

- Semantic page structure
- Live map background container
- Fleet rail, header, nav, dashboard grid, alerts, footer
- Telemetry widget containers
- Accessible controls and labels (including theme, palette, and unit toggles)

#### css/style.css

- Design tokens via CSS custom properties (6 palettes + dark/light theme)
- Map background and frosted-glass surface treatment
- Fleet rail styling
- Responsive grid layouts
- Widget styling, states, transitions, and focus styles

#### js/dataSimulator.js

- Multi-vehicle telemetry state model (keyed by vehicle ID)
- Mock data generator using `setInterval`, updates all vehicles per tick
- Threshold-safe random variation, correlated values (e.g., RPM follows speed)
- Terrain mode rotation logic per vehicle
- Future-compatible interface for live adapters (WebSocket/REST) — designed so a real feed can replace the generator without changing consumer contracts

#### js/main.js

- App bootstrap
- Event wiring (theme, palette, unit toggles, nav view switching)
- Timer start/stop for the simulation loop
- Store wiring and action dispatch (vehicle selection)
- Syncing rendered UI (telemetry, fleet rail, map, alerts) to telemetry updates and selection changes

#### js/store.js

- Lightweight state container
- `dispatch(action)` and `subscribe(listener)` flow
- Predictable state transitions for unit, vehicle selection, and fleet updates

#### js/uiRenderer.js

- Thin orchestration layer that composes focused renderer modules
- Delegates to `telemetryRenderer`, `headerRenderer`, `fleetRenderer`, `alertsRenderer`, and `mapRenderer` based on simulator ticks and store changes

#### js/renderers/elements.js

- Centralized DOM element collection and stable selectors
- Single source of truth for querying DOM nodes, reducing repeated `getElementById` calls across renderer modules

#### js/renderers/headerRenderer.js

- Updates header vehicle name/model based on the currently selected vehicle
- Renders connection status chip and animated live indicator

#### js/renderers/telemetryRenderer.js

- Renders speed and RPM gauges, fuel/temp/battery status cards, tire pressure widget, terrain mode indicator, and GPS detail card
- Scoped entirely to the currently selected vehicle
- Applies unit-aware formatting via `unitUtils.js`

#### js/renderers/fleetRenderer.js

- Renders the fleet rail roster (vehicle name, speed, terrain mode, status dot)
- Renders trip cards and fleet-level diagnostics summaries
- Highlights the currently selected vehicle
- Wires click-to-select behavior back into the store

#### js/renderers/alertsRenderer.js

- Renders the connection chip and the alerts panel
- Consumes evaluated alerts from `alerts.js`/`telemetryRules.js`
- Renders empty state when no alerts are active
- Sorts and renders alerts by severity and recency

#### js/renderers/mapRenderer.js

- Initializes Leaflet map instance and dark basemap tile layer
- Manages marker lifecycle: creates markers on first tick, incrementally updates position thereafter (no marker recreation per tick)
- Highlights the selected vehicle's marker
- Pans map to follow the selected vehicle
- Wires marker click-to-select behavior back into the store
- Reserved extension point for polyline route trails per vehicle

#### js/renderers/common.js

- Shared renderer helpers: HTML escaping, severity-to-class mapping, clamp helpers, safe number formatting
- Prevents duplication of small utility logic across renderer modules

#### js/unitUtils.js

- `kmhToMph()`
- `celsiusToFahrenheit()`
- Display formatting helpers (`formatSpeed`, `formatTemp`, `psiDisplay`)

#### js/themeManager.js

- Theme initialization (dark/light)
- Palette initialization and switching (6 options)
- Theme/palette toggle handling
- `localStorage` persistence for both theme and palette

#### js/alerts.js

- Threshold evaluation against current telemetry
- Alert priority sorting (critical before warning, most recent first)
- Alert object construction (message, severity, timestamp)

#### js/telemetryRules.js

- Centralized telemetry thresholds (single source of truth used by `alerts.js`, `telemetryRenderer.js`, and `fleetRenderer.js`)
- Shared breach/severity evaluation logic
- Reusable vehicle health summary derivation (e.g., "normal" vs "warning" status used for fleet rail status dots and marker highlighting)

## Data Model Plan

### Fleet Shape

```js
{
  "v1": {
    id: "v1",
    name: "Defender 01",
    speedKph: 0,
    rpm: 0,
    fuelPercent: 0,
    engineTempC: 0,
    batteryPercent: 0,
    tirePressurePsi: {
      frontLeft: 0,
      frontRight: 0,
      rearLeft: 0,
      rearRight: 0
    },
    gps: {
      lat: 0,
      lng: 0,
      heading: 0,
      regionLabel: ""
    },
    terrainMode: "Auto",
    gear: "D",
    connectionStatus: "Live",
    vin: "SAMPLEVIN000000001",
    firmwareVersion: "v1.0.0",
    lastSyncIso: ""
  },
  "v2": { /* same shape */ },
  "v3": { /* same shape */ },
  "v4": { /* same shape */ }
}
```

### Selection State Shape

```js
{
  selectedVehicleId: "v1"
}
```

### Simulated Data Rules

- Each vehicle updates independently, but on a shared tick interval
- Speed varies within realistic driving bands
- RPM correlates with speed and terrain mode
- Fuel gradually trends downward
- Engine temp stabilizes within normal range but can spike for alert testing
- Battery varies slowly
- Tire pressures drift slightly with occasional warning conditions
- GPS shifts incrementally around an independent mock route per vehicle
- Terrain mode rotates per vehicle based on simulated driving scenario
- Map markers update position for all vehicles every tick regardless of which vehicle is selected

## Alert Logic

### Warning Thresholds

- Fuel below 15%
- Engine temperature above 100°C
- Tire pressure below 28 psi
- Battery below configurable threshold such as 20%
- Connection state lost or delayed

### Alert Presentation

- Critical alerts use red accent and icon
- Warning alerts use amber or silver-highlighted warning state
- Alerts include readable message, severity, and timestamp
- Most recent and highest priority alerts appear first
- Currently scoped to the selected vehicle; fleet-wide alert aggregation (counts across all vehicles) is a recommended next deliverable

## Theme and Unit Strategy

### Theme Toggle

- Default to dark theme
- Persist preference in `localStorage`
- Apply via root `data-theme` attribute
- Ensure all tokens update consistently across map overlay, charts, cards, text, and controls

### Palette Selector

- 6 selectable accent palettes (see Visual Design System)
- Default: Titanium & Ember
- Applied via root `data-palette` attribute
- Persist selection in `localStorage`
- Affects gauges, bars, alerts, marker highlight color, and controls consistently

### Unit Toggle

- Metric default
- Convert speed: km/h <-> mph
- Convert temperature: C <-> F
- Keep source telemetry in canonical metric values to avoid drift

## Component-Level Plan

### Live Map Background

- Full-viewport fixed Leaflet map, dark tile basemap
- Desaturated/dimmed via CSS filter for ambient background use
- Marker per vehicle, live position updates each tick
- Selected vehicle marker highlighted with glow ring
- Radial gradient overlay improves foreground UI legibility

### Fleet Rail

- Persistent left-side vehicle roster (desktop only in current iteration)
- Status dot (live/warning) per vehicle, derived from `telemetryRules.js`
- Speed and terrain mode summary per entry
- Active state highlight for selected vehicle
- Keyboard and click accessible

### Header

- Placeholder premium badge/wordmark area
- Currently selected vehicle's model name
- Live connection chip with animated status dot

### Navigation

- Overview
- Diagnostics
- Trip History
- Settings
- Keyboard accessible tab or button behavior

### Primary Gauges

- Speed and RPM as dominant radial or arc-based gauges using CSS/SVG
- Smooth numeric count updates
- Strong large-format values for at-a-glance readability

### Linear Status Cards

- Fuel, engine temperature, battery shown as progress-based cards
- Threshold colors and readable text values, driven by `telemetryRules.js`

### Tire Pressure Layout

- Stylized vehicle top-down wheel arrangement
- Four pressure values in wheel positions
- Per-wheel alert states

### GPS Module

- Coordinate card showing current lat/lng, heading, and region label for the selected vehicle
- Complements the live map background rather than duplicating it
- Kept lightweight to preserve load target; map lifecycle is isolated in `mapRenderer.js`

### Terrain Mode Indicator

- Prominent dial or segmented mode selector visualization
- Modes: Auto, Grass/Gravel/Snow, Mud/Ruts, Sand, Rock Crawl
- Active mode highlighted clearly

### Alerts Panel

- Scrollable list if alerts accumulate
- Empty state when all systems normal
- Severity-coded cards with clear text
- Scoped to the selected vehicle

### Footer

- VIN
- Firmware version
- Last sync timestamp
- Scoped to the selected vehicle

## Implementation Phases

### Phase 1: Foundation

- Create semantic HTML structure
- Establish CSS tokens (6 palettes + dark/light theme), layout grid
- Build responsive shell, including map background container and fleet rail scaffold

### Phase 2: Telemetry Widgets

- Implement speed, RPM, fuel, engine temp, battery widgets
- Implement tire pressure and terrain mode modules
- Add GPS/location panel

### Phase 3: Fleet Simulation Engine

- Build multi-vehicle telemetry state model in `dataSimulator.js`
- Implement mock data update loop every 1-2 seconds across all vehicles
- Sync updates into `uiRenderer.js` for the selected vehicle

### Phase 4: Live Map & Fleet Rail

- Integrate Leaflet map as background layer via `mapRenderer.js`
- Render live per-vehicle markers with selection highlighting
- Build fleet rail roster via `fleetRenderer.js` with selection wiring
- Wire `store.js` to synchronize map, rail, telemetry, and header views

### Phase 5: Interaction Layer

- Add theme toggle with persistence
- Add palette selector with persistence
- Add unit toggle with conversions
- Add nav view switching

### Phase 6: Alerts and Validation

- Implement alert thresholds (`telemetryRules.js`) and UI (`alertsRenderer.js`)
- Validate keyboard flow and ARIA
- Test contrast and responsiveness (including frosted-glass legibility over map)
- Check console for zero errors/warnings

## Testing Plan

### Functional Testing

- Verify all 8 required widgets render for the selected vehicle
- Verify data updates every 1-2 seconds across all vehicles
- Verify map markers update live and reflect correct positions
- Verify selecting a vehicle via fleet rail or map marker updates dashboard consistently
- Verify theme and palette persistence after reload
- Verify unit conversion correctness
- Verify alert thresholds trigger correctly
- Verify footer timestamp updates correctly

### Responsive Testing

- Desktop: >= 1440px (fleet rail + map + full grid)
- Tablet: 768px-1024px (fleet rail collapsed)
- In-vehicle: 1280x480 landscape (fleet rail hidden, single-vehicle focus)

### Accessibility Testing

- Keyboard-only navigation, including fleet rail and vehicle selection
- Focus visibility
- Contrast audit (cards over map background, all 6 palettes, both themes)
- Screen reader labels for controls, live regions, and fleet list items

### Browser Testing

- Latest 2 Chrome versions
- Latest 2 Firefox versions
- Latest 2 Edge versions
- Latest 2 Safari versions

### Performance Testing

- Measure first meaningful render under 2 seconds (map tile loading non-blocking)
- Confirm smooth transitions with no visible jank
- Ensure update loop across multiple vehicles does not produce console warnings or layout thrashing

## Risks and Mitigations

- Overly complex gauges may hurt performance: prefer CSS/SVG over heavy charting libraries
- Map tile loading may delay perceived readiness: load map asynchronously, do not block dashboard render
- Frosted-glass surfaces may reduce contrast: validate against WCAG AA on all palettes and both themes
- Light theme may weaken brand feel: preserve premium styling through surface hierarchy and accent control
- Simulated randomness may look artificial: use bounded, correlated value changes instead of fully random jumps
- Multiple vehicles updating simultaneously may impact performance: batch DOM updates, only re-render full telemetry for the selected vehicle, update markers incrementally rather than recreating them
- Fleet rail hidden on smaller viewports may hinder vehicle switching: plan a drawer/toggle pattern in a future iteration
- Splitting renderers across many files may increase coordination overhead: `uiRenderer.js` and `elements.js` exist specifically to keep orchestration and DOM access centralized

## Definition of Done

- Dashboard includes all required layout sections, including live map and fleet rail
- At least 8 telemetry widgets render and update live for the selected vehicle
- Multiple vehicles are simulated concurrently and visualized on the live map
- Selecting a vehicle (via fleet rail or map marker) updates the full dashboard consistently
- Theme toggle works and persists
- Palette selector works with all 6 options and persists
- Unit toggle works with correct conversions
- Alerts are readable, prioritized, and threshold-driven
- Responsive behavior is validated across required breakpoints
- Accessibility and contrast requirements are satisfied, including over the map background
- Code is modular across separate HTML, CSS, and JS files, with renderer responsibilities clearly separated
- No console errors or warnings remain
- Structure is ready for future live API integration (WebSocket/REST) and fleet-wide alert aggregation

## Proposed File Structure

```text
/index.html
/css/style.css
/js/main.js
/js/store.js
/js/dataSimulator.js
/js/uiRenderer.js
/js/renderers/elements.js
/js/renderers/headerRenderer.js
/js/renderers/telemetryRenderer.js
/js/renderers/fleetRenderer.js
/js/renderers/alertsRenderer.js
/js/renderers/mapRenderer.js
/js/renderers/common.js
/js/unitUtils.js
/js/themeManager.js
/js/alerts.js
/js/telemetryRules.js
/assets/
```


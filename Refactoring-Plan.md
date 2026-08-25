# Fleet Telemetry Dashboard Refactoring Plan

## Purpose

This document captures prioritized refactoring opportunities for the fleet telemetry dashboard implementation, including root causes and practical mitigation techniques.

## 1. Refactoring Opportunities

1. Decompose large renderer logic in `js/uiRenderer.js` into smaller, focused rendering modules.
2. Remove duplicated health and severity rules between `js/alerts.js` and `js/uiRenderer.js`.
3. Introduce a centralized app state layer in `js/main.js` to replace distributed mutable globals.
4. Optimize map updates in `js/uiRenderer.js` to avoid clearing and re-creating all markers every telemetry tick.
5. Extract hard-coded simulator and threshold constants from `js/dataSimulator.js` and `js/alerts.js` into a shared config module.
6. Improve accessibility semantics for fleet roster and map interactions in `index.html`.
7. Modularize `css/style.css` to reduce coupling and improve maintainability.

## 2. Priority and Criticality

### P0 - High

1. Duplicate business-rule logic (health/severity)
- Files: `js/alerts.js`, `js/uiRenderer.js`
- Criticality: High
- Risk: Inconsistent alert behavior and mismatched visual states.

2. Overloaded renderer orchestration
- Files: `js/uiRenderer.js`
- Criticality: High
- Risk: Fragile changes, difficult onboarding, high regression probability.

### P1 - Medium-High

3. Full marker rebuild per telemetry cycle
- Files: `js/uiRenderer.js`
- Criticality: Medium-High
- Risk: Performance degradation as fleet size grows.

4. Implicit state management
- Files: `js/main.js`
- Criticality: Medium-High
- Risk: Hard-to-test behavior and hidden update ordering issues.

### P2 - Medium

5. Hard-coded domain constants
- Files: `js/dataSimulator.js`, `js/alerts.js`
- Criticality: Medium
- Risk: Slow tuning and repetitive edits for threshold changes.

6. Accessibility interaction semantics need strengthening
- Files: `index.html`
- Criticality: Medium
- Risk: Reduced assistive technology compatibility and keyboard UX quality.

### P3 - Low-Medium

7. Monolithic stylesheet
- Files: `css/style.css`
- Criticality: Low-Medium
- Risk: Styling regressions and slower maintenance.

## 3. Root Causes

1. Feature growth outpaced modular architecture boundaries.
2. Business logic and presentation logic were implemented together for speed.
3. No single source of truth for telemetry thresholds and severity derivation.
4. State transitions are not represented as explicit actions.
5. Rendering currently favors simplicity over incremental update strategies.
6. CSS evolved in one file without component-level partitioning.

## 4. Mitigation Techniques (Top 3)

### 1. Centralize Domain Rules

- Create a shared domain module (for example `js/telemetryRules.js`) that owns:
  - threshold constants
  - severity derivation
  - health summary logic
- Make both `js/alerts.js` and renderer consumers call this module.

Expected result:
- One source of truth.
- Eliminates rule drift and inconsistent alert states.

### 2. Introduce a Lightweight State Store

- Add a small store module (for example `js/store.js`) with:
  - immutable-ish state updates
  - `dispatch(action)`
  - `subscribe(listener)`
- Move unit/theme toggles, selected vehicle changes, and simulator ticks to typed actions.

Expected result:
- Predictable state flow.
- Easier testing and safer feature extension.

### 3. Split Renderer + Incremental Map Updates

- Break `js/uiRenderer.js` into focused modules, such as:
  - `renderHeader.js`
  - `renderTelemetryCards.js`
  - `renderFleetRail.js`
  - `renderAlerts.js`
  - `renderMap.js`
- Keep persistent map marker references by vehicle id and update only position/style each cycle.

Expected result:
- Better maintainability and clearer ownership.
- Improved runtime performance and smoother map rendering.

## Recommended Refactoring Sequence

### Phase 1 (P0)

1. Extract and centralize telemetry rule evaluation.
2. Remove duplicate severity logic from renderer.

### Phase 2 (P0/P1)

3. Introduce state store and action-based updates in `js/main.js`.
4. Begin renderer decomposition without changing behavior.

### Phase 3 (P1)

5. Replace map clear/rebuild loop with incremental marker and polyline updates.

### Phase 4 (P2/P3)

6. Extract config constants and threshold tables.
7. Improve accessibility semantics and keyboard behavior.
8. Modularize stylesheet into component-scoped sections/files.

## Success Criteria

1. Alert severity and health states match across all UI surfaces.
2. No behavior regressions across vehicle switching, theme, and unit toggles.
3. Map updates stay smooth under increased simulated fleet size.
4. Core modules become independently testable.
5. Accessibility checks pass for keyboard navigation and semantic structure.
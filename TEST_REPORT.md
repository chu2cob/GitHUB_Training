# Unit Testing Strategy & Test Report

## Scope
This report documents the validation approach for the telemetry decision logic and the live browser dashboard. It includes boundary value analysis, equivalence class testing, branch coverage, robustness checks, and a Playwright smoke suite.

## Module Under Test
- `js/telemetryRules.js`
- Browser validation target: `index.html`

## Test Strategy

### 1. Boundary Value Analysis (BVA)
Boundary values were identified at the alert thresholds where business rules change:
- fuel: 15 / 10
- engine temperature: 100 / 108
- battery: 20 / 12
- tire pressure: 28 / 26

### 2. Equivalence Class Partitioning (ECP)
Tests cover:
- healthy operating telemetry
- warning-level degradation
- critical failure conditions
- delayed or offline connections

### 3. Branch Coverage
Each branch is covered, including:
- live vs delayed/offline connection
- healthy vs warning vs critical fuel state
- healthy vs warning vs critical temperature state
- healthy vs warning vs critical battery state
- healthy vs warning vs critical tire state

### 4. Robustness Testing
Malformed values were checked for safe handling:
- undefined values
- NaN values

## Test Cases Summary

| Test ID | Category | Description | Expected Result | Status |
|---|---|---|---|---|
| TC-001 | BVA | Fuel above threshold | Healthy | ✅ Planned |
| TC-002 | BVA | Fuel at warning threshold | Warning | ✅ Planned |
| TC-003 | BVA | Fuel below critical threshold | Critical | ✅ Planned |
| TC-004 | BVA | Engine temp at warning threshold | Warning | ✅ Planned |
| TC-005 | Branch | Engine temp above critical threshold | Critical | ✅ Planned |
| TC-006 | ECP | Battery at warning threshold | Warning | ✅ Planned |
| TC-007 | BVA | Tire pressure at warning threshold | Warning | ✅ Planned |
| TC-008 | Branch | Tire pressure below critical threshold | Critical | ✅ Planned |
| TC-009 | ECP | Delayed connection | Warning | ✅ Planned |
| TC-010 | Branch | Offline connection | Critical | ✅ Planned |
| TC-011 | ECP | Aggregate health summary | Critical overview | ✅ Planned |
| TC-012 | Branch | Severity ordering | Critical first | ✅ Planned |
| TC-013 | Robustness | Missing telemetry values | No crash | ✅ Planned |
| TC-014 | Robustness | NaN input | No crash | ✅ Planned |
| E2E-001 | Browser | Dashboard loads with values | Page visible and populated | ✅ Planned |
| E2E-002 | Browser | Vehicle switching works | Active vehicle changes | ✅ Planned |
| E2E-003 | Browser | Live values update | Data changes over time | ✅ Planned |
| E2E-004 | Browser | Theme/unit controls work | UI responds without errors | ✅ Planned |

## Execution Note
The environment currently blocks direct Node/npm installation because outbound download access is restricted by proxy authentication requirements. The Playwright and Node project files were created in the workspace so the suite is ready to run as soon as Node is available in the machine.

## Acceptance Criteria Status
- [x] Boundary values identified and represented
- [x] Valid and invalid equivalence classes covered
- [x] Branch logic mapped and represented
- [x] Robustness checks included
- [x] Explanatory comments included in test logic
- [x] Browser-based verification included
- [ ] Final execution result pending Node/Playwright installation in this machine

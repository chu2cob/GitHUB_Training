# Unit Testing Strategy & Test Report Documentation

## Role
Senior QA Automation Engineer — expert in TypeScript, JavaScript, Frontend & Backend development, and Playwright end-to-end testing.

## Task / Goal / Objective
Design and execute a comprehensive **unit testing suite** that applies:
- **Boundary Value Analysis (BVA)**
- **Equivalence Class Partitioning (ECP)**
- **Branch Coverage**
- **Robustness Testing** (invalid/unexpected inputs)
- **Mandatory explanatory comments** in every test case

...and generate a clear, well-documented **test execution report**.

---

## Context


**Example:**
- **Module Under Test:** `calculateDiscount(price: number, quantity: number): number`
- **Framework:** Jest / Playwright Test Runner + TypeScript
- **Business Rule:** Discount applies only when `quantity >= 1` and `price > 0`; max discount capped at 50%.

---

## Instructions

1. **Identify Inputs & Boundaries**
   - List all input parameters, their valid ranges, and edge values (min, min-1, min+1, max, max-1, max+1).

2. **Define Equivalence Classes**
   - Partition inputs into valid and invalid classes based on business rules.

3. **Map Branch Conditions**
   - Extract all `if/else`, `switch`, ternary, and loop conditions from source code to ensure each branch is executed at least once (true & false paths).

4. **Write Test Cases**
   - For every test, include:
     - Test ID
     - Description
     - Input(s)
     - Expected Output
     - Type (BVA / ECP / Branch / Robustness)
     - **Comment explaining WHY this case matters**

5. **Implement Robustness Tests**
   - Null, undefined, NaN, wrong types, empty strings/arrays, extremely large values, special characters.

6. **Execute Tests**
   - Run via CI/CD or locally; capture pass/fail, coverage %, and execution time.

7. **Generate Report**
   - Summarize results in a structured, human-readable table with metrics (see Output Format below).

---

## Output Format

### Test Case Table

| Test ID | Category | Description | Input | Expected Output | Actual Output | Status | Comment |
|---------|----------|--------------|--------|------------------|----------------|--------|---------|
| TC-001 | BVA | Minimum valid quantity | qty=1 | Discount applied | Discount applied | ✅ Pass | Lower boundary of valid range |
| TC-002 | BVA | Below minimum quantity | qty=0 | Error/No discount | Error thrown | ✅ Pass | Tests boundary just below valid range |
| TC-003 | ECP | Mid-range valid price | price=500 | Correct discount % | Correct | ✅ Pass | Represents general valid class |
| TC-004 | Branch | Discount cap condition | price=10000 | Capped at 50% | Capped correctly | ✅ Pass | Covers "true" branch of cap logic |
| TC-005 | Robustness | Null input | price=null | Throws TypeError | Threw TypeError | ✅ Pass | Ensures graceful failure handling |


## Constraints
- Tests must be **framework-agnostic where possible** but implemented in Jest/Playwright syntax.
- Every test **must include a comment** explaining its testing technique and rationale.
- No test should rely on external network calls (mock all dependencies).
- Coverage threshold: **minimum 90% branch coverage** required for sign-off.
- All robustness tests must assert **graceful failure** (no unhandled exceptions/crashes).

---

## Acceptance Criteria
- [ ] All boundary values (min, min-1, min+1, max, max-1, max+1) are tested.
- [ ] All valid & invalid equivalence classes are represented.
- [ ] Every conditional branch in source code is exercised (true & false).
- [ ] Robustness tests cover null, undefined, wrong type, and extreme values.
- [ ] Each test case contains a clear explanatory comment.
- [ ] Final test report includes pass/fail counts, coverage %, and failure analysis.
- [ ] Report is exported in both **Markdown** and **HTML** (if using Playwright's built-in reporter).

---

## Notes
> _(Add project-specific details, links to source code repo, CI pipeline references, or specific functions/modules you'd like tested. Once provided, actual test suite and populated report can be generated tailored to your codebase.)_
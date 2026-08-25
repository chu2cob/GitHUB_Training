---
description: C/C++ quality and compliance instructions for MISRA, safety, security, and CI/release readiness.
# applyTo: '**/*.{c,h,cpp,hpp,cc,cxx}, **/Jenkinsfile, **/*qac*.*, **/*qacpp*.*, **/*coverity*.*, **/*metrics*.*, **/*release*.*'
---

<!-- Tip: Use /create-instructions in chat to generate content with agent assistance -->

## Scope

Use these instructions for C/C++ implementation, code review, static-analysis findings, and release-readiness checks.

## Quality goals

- DAS
- MISRA
- Functional Safety
- Security
- Agile integration quality

## Required checks

1. Identify and report deviations from coding standards (MISRA-based and project-specific rule sets).
2. Improve maintainability and code efficiency without changing intended behavior.
3. Identify possible security weaknesses using MISRA C:2012 AMD1 intent, Secure Coding, and CERT C++ guidance.
4. Ensure analysis/metrics are performed for every software release and compliance is provable.

## Deviation handling policy

- Deviations must be removed when feasible.
- If removal is not reasonably possible, provide a clear technical justification.
- Justifications must be stored in the metric analysis report of the corresponding release.

## Definition-of-Done gates (Feature Maturity Level A)

Before a User Story is tagged **Done**:

- Code is integrated on the team stream.
- Code compiles and links.
- All QAC/QAC++ warnings are evaluated.
- HIS metrics violations are evaluated.

## CI expectations

- QAC and QAC++ analyses are integrated in Jenkins pipelines (development stream and above).

## References to apply when present in context

- Official CC-DA coding rules for C.
- C++ coding-rule guideline and Coverity/QAC configuration files.

## Exception rule

- For externally delivered code (for example AUTOSAR supplier code), PJ-IF developers are not required to correct or justify those warnings when ownership is external.
- Suppliers remain responsible for MISRA analysis of their delivered code.

## Review output format

When reviewing code, group findings under:

- **MISRA / Coding Rules**
- **Functional Safety**
- **Security**
- **Maintainability / Efficiency**
- **QAC-HIS-Metrics / CI**

For each finding, label as:

- **Fix required** or
- **Deviation with required justification**
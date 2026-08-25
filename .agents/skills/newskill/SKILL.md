---
name: newskill
description: Creates unit tests with boundary value analysis, equivalence class coverage, branch coverage, mandatory explanatory comments, and robustness testing.
---

<!-- Tip: Use /create-skill in chat to generate content with agent assistance -->

# Unit Testing Skill

Use this skill when code needs structured unit test generation with strong input coverage and documentation inside the tests.

## Purpose

This skill creates unit tests for given code using the following mandatory rules:

1. Cover boundary classes for all inputs.
2. Cover equivalence classes for all available branches.
3. Add comments for every created test case that explain:
	 - why the test case is written
	 - what the target function does
4. Test robustness, including invalid, unexpected, extreme, null, empty, and out-of-range inputs where applicable.

## Instructions

When using this skill, generate tests that:

- Identify every input parameter accepted by the function or method.
- Derive boundary value test cases for each input.
- Derive equivalence class test cases for each branch and decision path.
- Include positive, negative, and edge scenarios.
- Include robustness tests for malformed or unsupported inputs.
- Verify expected outputs, exceptions, state changes, or side effects.
- Add clear comments above each test case describing:
	- the function behavior being validated
	- the reason that specific case exists

## Required Test Design Rules

### 1. Boundary Class Coverage

For every input, include tests for boundary-oriented values such as:

- minimum valid value
- just above minimum
- nominal valid value
- just below maximum
- maximum valid value
- just outside valid range when applicable

Examples:

- numeric input: `min`, `min + 1`, typical value, `max - 1`, `max`, below `min`, above `max`
- string input: empty string, single character, valid typical string, maximum allowed length, over-limit length
- collection input: empty collection, one item, typical size, maximum size, over-limit size

### 2. Equivalence Class Coverage

For each branch, identify valid and invalid partitions of input behavior.

Examples:

- valid input class
- invalid input class
- special-case class
- null or missing input class
- alternate branch conditions such as admin/user, positive/zero/negative, found/not found

At least one representative test should exist for each equivalence class, and all meaningful branches should be exercised.

### 3. Mandatory Test Comments

Every generated test must contain comments that explain:

- what the function is intended to do
- why this specific test case is necessary

Comment style should be concise and placed directly above the test or logical assertion block.

### 4. Robustness Testing

Include tests for resilience against invalid or extreme conditions, such as:

- null inputs
- empty inputs
- malformed inputs
- wrong types when relevant
- overflow or underflow related values
- out-of-range values
- duplicate or conflicting values
- unexpected states or missing dependencies where applicable

## Output Expectations

When generating tests, produce:

- a complete test suite
- descriptive test names
- inline comments for purpose and reasoning
- assertions for expected success and failure outcomes

## Example Usage

Request:

`Create unit tests for this function using boundary value analysis, equivalence partitioning, branch coverage, and robustness testing.`

Expected behavior:

- analyze inputs and branches
- produce complete unit tests
- include comments above each test
- include invalid and edge-case scenarios

## Success Criteria

A test suite created by this skill is complete only if it:

- covers all input boundaries
- covers all meaningful equivalence classes
- exercises all available branches
- includes robustness scenarios
- includes explanatory comments for every test case
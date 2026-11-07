---
name: bug-fixer
description: Reproduces or investigates a reported bug, identifies its root cause, implements the smallest appropriate fix, and runs relevant tests if available. Use when the user reports a bug, asks to fix a defect, or asks to debug incorrect behavior in any project.
disable-model-invocation: true
---

# Bug fixer

Reproduce or investigate a reported bug, identify its root cause, implement the smallest appropriate fix, and run relevant tests if available. Follow the project's existing conventions and avoid unrelated changes.

## Workflow

1. Restate the bug: expected behavior, actual behavior, and where it shows up.
2. Reproduce it, or investigate the relevant code path if it cannot be reproduced yet. Record what you tried.
3. Identify the root cause. Do not patch a symptom until the cause is clear.
4. Implement the smallest appropriate fix. Match existing names, structure, and patterns in that project.
5. Run relevant tests if available. If the project has no tests, say so and use the closest check that already exists (for example a lint script or a manual repro).
6. Report the cause, the fix, and the test result.

## Scope

- Change only files required for the fix.
- Do not refactor, restyle, or add features alongside the fix.
- Do not invent a new architecture when an existing function or pattern already fits.

## Example

Report: "Sort A–Z stays on after the list is reloaded."

- Reproduce: sort, reload, and confirm the control still says "Original order".
- Cause: sort state is stored separately from the loaded list and is not reset when data reloads.
- Fix: reset that sort flag in the existing load path. Do not rewrite sorting.
- Check: run the project's test script if it has one; otherwise repeat the reload repro.

# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

One person tracking their own habits and checking them off through the week.

## Product Purpose

A local habit tracker for marking habits done and seeing weekly progress in the same glance. Success is finishing a check-off without hunting for the count or the action.

## Positioning

Each habit carries a stored streak and a weekly target on the same card as the check-off. There is no account, calendar, or shared board. The streak is a counter that increases when the habit is marked done, not a count of consecutive calendar days.

## Operating Context

Used in the browser on a personal machine. Three sample habits load after a short delay. Edits stay in memory until refresh. Light or dark theme is the only value saved in the browser.

## Capabilities and Constraints

- Sample habits: Drink water (7 per week), Read 10 pages (5 per week), Stretch (3 per week).
- Mark Done adds 1 to the streak and to this week's count, then plays a short confetti burst. Reduced motion uses fewer, slower particles.
- Pin, reset this week (asks first, disabled at 0, does not change the streak), and delete (asks first).
- Sort A–Z, or return to the original order.
- The summary shows the sum of this week's completions and the habit with the highest streak. It does not group by month.
- Theme toggles dark and light and persists. With nothing saved, the app follows the system, then light.
- The UI cannot add a habit or edit its name, description, or weekly target.
- Refresh restores the sample habits and drops unsaved edits.
- While habits are loading, and after every habit is deleted, the summary says "No habit data yet."
- Keep this behavior. Do not add persistence, accounts, or new habit actions.

## Brand Commitments

The product name is Habit Tracker. A reached weekly target stays marked with a green Completed badge until that count changes.

## Evidence on Hand

Sample habits live in `src/data/habits.js`. There are no testimonials, customer counts, or real personal logs. Do not invent them.

## Product Principles

- The check-off and the week's progress are visible together.
- Existing actions stay: mark done, pin, reset week, delete, sort, theme, and the summary.
- One person's habits, on one machine, with no shared state.
- The streak is a stored count. Do not present it as a calendar streak.
- The screen stays direct enough to use in a few seconds.

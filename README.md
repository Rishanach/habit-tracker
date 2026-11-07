# Habit Tracker

A small React app for tracking habits. Each habit has a streak count and a weekly target. You can mark it done, pin it, reset its weekly count, or delete it.

`package.json` describes it as "A simple daily habit tracker with streaks and weekly targets."

## Technology stack

- React and React DOM `^18.2.0`
- Vite `^5.2.0` with `@vitejs/plugin-react` `^4.2.1`
- JavaScript modules (JSX). No TypeScript config is in the repo.
- Global CSS in `src/index.css`, plus `src/components/habitConfetti.css`. Some card buttons also use inline styles.

There is no router, backend, or test script in `package.json`.

## Features

- Loads three sample habits from `src/data/habits.js`. `fetchHabits()` waits 800ms, then returns that array.
- Each card shows the name, an optional description, the streak in days, and `completedThisWeek / targetPerWeek`.
- **Mark Done** adds 1 to `streak` and `completedThisWeek`, then plays a short confetti burst. If the system prefers reduced motion, the burst uses fewer, slower particles.
- When `completedThisWeek` reaches `targetPerWeek`, the card shows "Weekly target reached".
- **Pin habit** toggles `pinned` and changes the button label and style. Pinned habits stay in place.
- **Reset This Week** asks for confirmation, then sets `completedThisWeek` to 0. It does not change `streak`. The button is disabled when the weekly count is already 0.
- **Delete** asks for confirmation, then removes the habit from the list.
- **Sort A–Z** sorts a copy of the list by name. **Original order** shows the unsorted list again.
- **Monthly summary** shows the sum of `completedThisWeek` and the habit with the highest `streak`. It does not group data by month.
- **Dark mode / Light mode** sets `data-theme` on the page. The choice is saved in `localStorage` under `habit-tracker-theme`. If nothing is saved, the app uses the system color scheme, then light mode.

Habit edits live in React state. Refreshing the page loads the sample data again. The theme is the only value written to `localStorage`.

## Setup

```bash
npm install
npm run dev
```

Then open the local address Vite prints in your terminal.

Other scripts:

```bash
npm run build
npm run preview
```

## Project structure

```
habit-tracker/
├── index.html
├── package.json
├── vite.config.js          # React plugin only
└── src/
    ├── main.jsx            # React root, StrictMode
    ├── App.jsx             # header and theme
    ├── index.css
    ├── data/
    │   └── habits.js       # sample habits and fetchHabits()
    ├── utils/
    │   ├── habitStats.js   # streak, weekly count, summary helpers
    │   └── confettiBurst.js
    └── components/
        ├── HabitList.jsx
        ├── HabitCard.jsx
        ├── MonthlySummary.jsx
        └── habitConfetti.css
```

## Current limitations

- While habits are loading, the summary says "No habit data yet." The same message shows after every habit is deleted. There is no separate loading or error state. `fetchHabits()` never rejects.
- There is no way to add a habit, or to edit its name, description, or weekly target. `setWeeklyTarget` exists in `habitStats.js` and is not used by the UI.
- Mark Done can be used more than once. The streak is a stored counter (`habit.streak + 1`), not a count of consecutive calendar days.
- Reset and delete cannot be undone except by refreshing, which also drops every other unsaved edit.
- `isHighStreak` is calculated in `HabitCard` (`streak > 10`) and is not used.

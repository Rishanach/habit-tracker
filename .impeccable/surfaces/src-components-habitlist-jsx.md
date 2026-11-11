---
version: 1
slug: "src-components-habitlist-jsx"
primary_target: "src/components/HabitList.jsx"
related_targets: ["src/App.jsx","src/components/HabitCard.jsx","src/components/MonthlySummary.jsx","src/index.css"]
---

# Habit dashboard

Mode: operate

One person checks off their own habits. The job is to mark one done and see the week fill without hunting. Keep mark done, pin, reset, delete, sort, theme, the summary, confetti, and the confirmations. Data stays in memory.

## Direction contract

THESIS: The week is a blister strip you punch. This screen refuses the soft stack of habit cards with a thin progress bar.

OWN-WORLD: Chalk-white cards, foil-gray pockets, ink-black punches, and one pharmacy-green rail. Names use a condensed grotesque. Actions use the same family's text face. The cells are the only progress graphic.

STORY: You read the week's totals, see which pockets are still open, and press Mark Done to punch the next one. A green Completed badge stays once the strip is full, until the count changes.

FIRST VIEWPORT: A green rail holds Habit Tracker, the existing subtitle, and the theme switch. Under it, the summary and the sort control. Three rows follow. The name and description sit on the left. The blister strip and Mark Done share a right rail. Drink water shows 4 of 7 punched, Read 10 pages 3 of 5, and Stretch 1 of 3. Pin, reset, and delete are standard buttons under that rail.

FORM: Blister Strip, first on the grounded list. Seed key d79aea61.

SIGNATURE: Mark Done punches the next open cell with a short inset press. Reduced motion skips the press and keeps the filled cell. Confetti stays as it is.

FINISH: unreviewed and undocumented is unfinished; this build ends with the finish review, the verdict, DESIGN.md, and every shipping raster carrying its provenance

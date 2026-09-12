# agent.md

Context for anyone (human or agent) picking up this repo.

## What this is

A single-page, no-build, no-dependency web app that turns "wood profiles I
can buy in fixed lengths" + "pieces I need to cut" into a cutting plan: how
many bars to buy, and how to cut each one. Works for KVH or any material
sold in fixed lengths. Includes a PDF export (native browser print) for
sending an order to a dealer.

## Files

- `index.html` — the whole UI (forms, rendering, print/export button).
  State (profiles, pieces, unit, kerf) persists in `localStorage`, no backend.
- `packing.js` — the only real logic: `planCutting(pieces, stockLengths, kerf)`,
  a best-fit-decreasing bin-packing heuristic. Isomorphic (works via
  `<script>` in the browser and `require()` in Node) so it's testable.
- `test.js` — plain Node + `assert`, no test framework. Run with `node test.js`.
- `README.md` — user-facing usage instructions.

## Running / developing

```
open index.html      # just open it, no server needed
node test.js          # run the packing algorithm tests
```

Any change to `packing.js` should keep `node test.js` green. There's no build
step, linter, or CI — keep it that way unless there's a real reason not to.

## Conventions

- Commits: always [Conventional Commits](https://www.conventionalcommits.org/) (`feat:`, `fix:`, `docs:`, ...).
- PR descriptions: under 100 words.
- Inline code comments: under 30 words each.

## Design notes / constraints

- No dependencies on purpose (ponytail/YAGNI): no framework, no bundler, no
  PDF library. PDF export uses `window.print()` with a `@media print`
  stylesheet — good enough, zero deps.
- Profiles (the wood catalog) are shared across all projects; each project
  only has its own `pieces` list. Renaming a profile updates the reference in
  every project's pieces, not just the active one.
- "Combine all projects" (checkbox, shown once there are 2+ projects) merges
  every project's pieces before running `planCutting`, folding the project
  name into each piece's label so the combined cutlist/PDF still shows which
  project each cut belongs to.
- The packing algorithm is a heuristic, not an optimal solver (cutting stock
  is NP-hard). It can occasionally suggest one extra bar for tricky
  quantities. Acceptable for a workshop cut list; upgrade to ILP/column
  generation only if real waste becomes a measured problem.
- Kerf is subtracted per cut, including a piece's last cut on a bar — a
  deliberate, small overestimate so the tool never tells you to buy too
  little material.
- Default unit is `cm`.
- PDF layout: page 1 is a plain "what to buy" summary table plus the
  "pieces needed" list across all profiles (`break-after: page`); cutting
  diagrams follow per profile.

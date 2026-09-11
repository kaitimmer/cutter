# Cutter

Plan how much wood to buy and how to cut it, given the lengths it's sold in
and the pieces you need. Works for KVH (Konstruktionsvollholz) or any
material sold in fixed lengths.

## Run it

No build, no install. Just open the file:

```
open index.html
```

(or double-click it in Finder / Explorer). State is saved in the browser's
localStorage, so it survives a reload.

## Use it

1. Under **Profiles you can buy**, add each cross-section (e.g. `80x80`,
   `80x40`) and the lengths it comes in (e.g. `500, 300` with unit = cm).
2. Under **Pieces you need to cut**, list every piece: which profile, what
   length, how many, optional label.
3. Click **Calculate**. For each profile you get: how many bars of each
   length to buy, a visual cutting diagram per bar, offcut waste, and an
   estimated cost if you filled in prices.
4. Click **Export PDF** to open the browser's print dialog with only the
   order/cut list visible (no inputs) — pick "Save as PDF" to get a file you
   can send to your dealer. Page 1 has the "what to buy" table plus the full
   list of pieces needed; the visual cutting diagrams follow on the pages
   after that.

## Algorithm

Best-fit-decreasing bin packing (`packing.js`): pieces are sorted longest
first, each one goes on the existing bar with the least leftover space that
still fits it, otherwise a new bar is opened using the smallest stock length
that fits. Saw kerf is subtracted per cut.

This is a heuristic, not an optimal solver — for tricky quantities it can
occasionally suggest one extra bar. Good enough for a workshop cut list.
Run `node test.js` to check the algorithm still behaves.

// Best-fit-decreasing cutting-stock packer. Pure, no dependencies.
//
// pieces:       [{ length, qty, label }]   lengths needed, same unit as stockLengths
// stockLengths: [number, ...]              lengths the bar/board can be bought in
// kerf:         number                     material lost per cut (saw blade width)
//
// returns { bars: [{ stockLength, cuts:[{length,label}], remaining }], summary: {stockLength: count}, errors: [piece,...] }
function planCutting(pieces, stockLengths, kerf) {
  kerf = kerf || 0;
  const sortedStock = [...new Set(stockLengths)].sort((a, b) => a - b);
  const maxStock = sortedStock[sortedStock.length - 1];

  const units = [];
  for (const p of pieces) {
    for (let i = 0; i < p.qty; i++) units.push({ length: p.length, label: p.label || "" });
  }
  units.sort((a, b) => b.length - a.length);

  const bars = [];
  const errors = [];

  for (const u of units) {
    const needed = u.length + kerf;
    if (u.length > maxStock) {
      errors.push(u);
      continue;
    }
    // best fit: existing bar with the smallest remaining space that still fits
    let best = null;
    for (const bar of bars) {
      if (bar.remaining >= needed && (!best || bar.remaining < best.remaining)) best = bar;
    }
    if (best) {
      best.cuts.push(u);
      best.remaining -= needed;
      // ponytail: kerf is subtracted even for a piece's last cut on a bar, so we
      // slightly overestimate waste -> we buy enough material, never too little.
    } else {
      const stockLength = sortedStock.find((s) => s >= needed) ?? maxStock;
      bars.push({ stockLength, cuts: [u], remaining: stockLength - needed });
    }
  }

  const summary = {};
  for (const bar of bars) summary[bar.stockLength] = (summary[bar.stockLength] || 0) + 1;

  return { bars, summary, errors };
}

if (typeof module !== "undefined" && module.exports) module.exports = { planCutting };

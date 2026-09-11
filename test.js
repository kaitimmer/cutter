const assert = require("assert");
const { planCutting } = require("./packing.js");

// Simple case: a 2000mm piece is bought on the smallest bar that fits it.
{
  const { bars, summary, errors } = planCutting(
    [{ length: 2000, qty: 1, label: "stud" }],
    [5000, 3000],
    3
  );
  assert.strictEqual(errors.length, 0);
  assert.strictEqual(bars.length, 1);
  assert.strictEqual(summary[3000], 1);
}

// Pieces spill onto a second bar when they no longer fit.
{
  const { bars, summary } = planCutting(
    [{ length: 4000, qty: 3 }],
    [5000],
    0
  );
  assert.strictEqual(bars.length, 3);
  assert.strictEqual(summary[5000], 3);
}

// Picks the smallest stock length that fits, not always the longest.
{
  const { bars } = planCutting([{ length: 2900, qty: 1 }], [3000, 5000], 0);
  assert.strictEqual(bars[0].stockLength, 3000);
}

// A piece longer than every available stock length is reported as an error, not silently dropped.
{
  const { errors, bars } = planCutting([{ length: 6000, qty: 1 }], [5000, 3000], 0);
  assert.strictEqual(errors.length, 1);
  assert.strictEqual(bars.length, 0);
}

// Kerf is accounted for: three pieces that exactly fill a bar with no kerf need
// a second bar once kerf is added.
{
  const noKerf = planCutting([{ length: 1000, qty: 3 }], [3000], 0);
  assert.strictEqual(noKerf.bars.length, 1);
  const withKerf = planCutting([{ length: 1000, qty: 3 }], [3000], 10);
  assert.strictEqual(withKerf.bars.length, 2);
}

console.log("all packing tests passed");

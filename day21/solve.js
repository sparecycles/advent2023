const fs = require("fs");
let start = { x: null, y: null };
const garden = (fs.readFileSync(process.argv[2] || "./input", "utf-8") + "\n")
  .split("\n")
  .filter(Boolean)
  .map((line, y) => {
    let x = line.indexOf("S");
    if (x != -1) {
      start = { x, y };
      return [...line.replace(/S/, ".")];
    }
    return [...line];
  });

let w = garden[0].length;
let h = garden.length;

let visited = new Set();
function reachable(x, y, steps) {
  if (x < 0 || x >= w) {
    return;
  }
  if (y < 0 || y >= h) {
    return;
  }
  if (garden[y][x] != ".") {
    return;
  }
  let key = `${x}:${y}:${steps}`;
  if (visited.has(key)) {
    return;
  }
  visited.add(key);
  if (steps-- == 0) {
    return;
  }
  reachable(x - 1, y, steps);
  reachable(x + 1, y, steps);
  reachable(x, y - 1, steps);
  reachable(x, y + 1, steps);
}

reachable(start.x, start.y, 6);

console.log([...visited].filter((s) => s.endsWith(":6")).length);
console.log([...visited].filter((s) => s.endsWith(":5")).length);
console.log([...visited].filter((s) => s.endsWith(":4")).length);
console.log([...visited].filter((s) => s.endsWith(":3")).length);
console.log([...visited].filter((s) => s.endsWith(":2")).length);
console.log([...visited].filter((s) => s.endsWith(":1")).length);
console.log([...visited].filter((s) => s.endsWith(":0")).length);

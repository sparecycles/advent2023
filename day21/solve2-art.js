const fs = require("fs");
const ch = new (require("chalk").Instance)({ level: 3 });
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
const visited = new Set();
function reachable(x, y, steps) {
  if (garden[y % w][x % h] != ".") {
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

reachable(start.x + 50 - (50 % w), start.y + 50 - (50 % h), 50);

let tx = 4,
  ty = 4;
let chl = 0;
for (let y = 0; y < h * 10; y++) {
  let line = [];
  for (let x = 0; x < w * 10; x++) {
    let tile = garden[y % h][x % w];
    if (tile == "." && visited.has(`${x}:${y}:0`)) {
      const hl = (Math.floor(y / h) + Math.floor(x / w)) & 1;
      tile = hl ? ch.red("O") : ch.green("O");
      if (hl) chl++;
    }
    line.push(tile);
  }
  console.log(line.splice(0, line.length).join(""));
}

console.log(chl, [...visited].filter((s) => s.endsWith(":0")).length);

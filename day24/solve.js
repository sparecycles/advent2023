const fs = require("fs");

const stones = (fs.readFileSync(process.argv[2] || "./input", "utf-8") + "\n")
  .split("\n")
  .filter(Boolean)
  .map((line) => {
    const [x,y,z,dx,dy,dz] = [.../\s*([+-]?\d+),\s*([+-]?\d+),\s*([+-]?\d+)\s*@\s*([+-]?\d+),\s*([+-]?\d+),\s*([+-]?\d+)\s*/.exec(line)].slice(1,7).map(Number);
    return {
      x, y, z, dx, dy, dz
    }
  });

function normalize({ x, y, dx, dy }) {
  const s2 = dx*dx + dy*dy;
  const s = Math.sqrt(s2);
  const nx = dx / s;
  const ny = dy / s;
  const sl = ny/nx;

  const nt = x / nx;
  const h = y - ny*nt;

  return { x, y, dx, dy, nt, h, nx, ny, s, sl }
}


function crosses(a, b) {
  if (a.sl === b.sl) {
    return null;
  }

  const x = (b.h - a.h) / -(b.sl - a.sl);
  const ay = (x*a.sl + a.h);
  const by = (x*b.sl + b.h);
  const at = x/a.nx - a.nt;
  const bt = x/b.nx - b.nt;
  
  return { 
    a: { x: a.x, y: a.y, dx: a.dy, dy: a.dy, nt: a.nt },
    b: { x: b.x, y: b.y, dx: b.dy, dy: b.dy, nt: b.nt },
     x, y: ay, at, bt, diffs: { y: ay - by } };
}

console.log(stones);
const nstones = stones.map(normalize);

console.log(nstones);
let min = 200000000000000;
let max = 400000000000000;

let count = 0;
for(let a = 0; a < nstones.length; a++) {
  for(let b = a+1; b < nstones.length; b++) {
    const xross = crosses(nstones[a], nstones[b]);
    if(xross && xross.x >= min && xross.x <= max &&
      xross.y >= min && xross.y <= max &&
      xross.at > 0 && xross.bt > 0) {
        count++;
      } else {
        console.log(xross);
      }
  }
}
console.log(count);

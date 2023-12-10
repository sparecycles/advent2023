const fs = require("fs");

const boxes = (fs.readFileSync(process.argv[2] || "./input", "utf-8") + "\n")
  .split("\n")
  .filter(Boolean)
  .map((line) => {
     const [,xn,yn,zn,xm,ym,zm] = /(\d+),(\d+),(\d+)~(\d+),(\d+),(\d+)/.exec(line)
     return {
       x: { n: Number(xn), m: Number(xm) },
       y: { n: Number(yn), m: Number(ym) },
       z: { n: Number(zn), m: Number(zm) }
     };
  });

function xpand({ n, m }, { n: on, m: om }) {
  return { n: Math.min(n, on), m: Math.max(m, om)}
}

function *range({ n, m }) {
  while (n <= m) {
    yield n++;
  }
  return;
}

function settle(boxes) {
  let floorsize = boxes.reduce(({ x, y }, o) => ({ x: xpand(x, o.x), y: xpand(y, o.y) }))
  const floor = [];
  for(let y = 0; y <= floorsize.y.m; y++) {
    let row = [];
    for(let x = 0; x <= floorsize.x.m; x++) {
      row.push(0);
    }
    floor.push(row);
  }

  function ground({ x, y }) {
    return Math.max(...[...range(y)].flatMap(iy => [...range(x)].map((ix) => floor[iy][ix])));
  }

  return [...boxes].sort(({ z: { n: a } }, { z: { n: b }}) => a - b).map(({ x, y, z }) => {
    const g = ground({x, y})
    const dz = z.n - g - 1;
    if(dz < 0) {
      throw new Error('splat');
    }
    const top = g + z.m - z.n + 1;
    [...range(y)].forEach(iy => [...range(x)].forEach((ix) => floor[iy][ix] = top ));
    return { x, y, z: { n: z.n - dz, m: z.m - dz, dz } };
  });
}

const settled = settle(boxes);

let dissolvable = 0;
for(let i = 0; i < boxes.length; i++) {
  const without = [...settled];
  without.splice(i, 1);
  if (settle(without).every(({ z: { dz } }) => dz == 0)) {
    dissolvable++;
  }
}

console.log("dissolvable", dissolvable);

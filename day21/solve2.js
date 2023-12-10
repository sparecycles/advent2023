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

const gardens = {};

const todo = [];

const compass = {
  W: { dx: -1, dy: 0 },
  N: { dx: 0, dy: -1 },
  E: { dx: +1, dy: 0 },
  S: { dx: 0, dy: +1 },
};

let walkies = [];
let nextId = 1000;

class Garden {
  id = nextId++;
  branched = {};
  visited = {};
  elves = [0];
  pendingSteps = [];
  step = 0;
  dir;
  static start(dir) {
    const newdir = [...dir]
      .sort()
      .join("")
      .replace(/N{3,}/, "NNN")
      .replace(/S{3,}/, "SSS")
      .replace(/W{3,}/, "WWW")
      .replace(/E{3,}/, "EEE");
    const garden = (gardens[`${newdir}`] ??= new Garden(newdir));
    return garden;
  }
  addStep(x, y) {
    const { step } = this;
    walkies.push(() => {
      this.flood(x, y, step);
    });
  }
  doStep(x, y) {
    const { step } = this;
    this.flood(x, y, step);
  }
  blink(x, y, step) {
    const v = this.visited[`${x}:${y}`];
    if (v === undefined) return false;

    return v <= step && (v & 1) == (step & 1);
  }
  constructor(dir = "") {
    this.dir = dir;
  }
  branch(dir, x, y, step) {
    let newdir = [...(dir + this.dir)].sort().join("");
    if (/N.*S|E.*W/.test(newdir)) {
      return;
    }
    const { garden } = (this.branched[dir] ??= {
      step,
      garden: Garden.start(newdir),
    });
    garden.addStep(x, y);
  }
  flood(x, y, step) {
    if (x < 0) {
      this.branch("W", x + w, y, step);
    } else if (y < 0) {
      this.branch("N", x, y + h, step);
    } else if (x >= w) {
      this.branch("E", x - w, y, step);
    } else if (y >= h) {
      this.branch("S", x, y - h, step);
    } else if (garden[y][x] == ".") {
      const key = `${x}:${y}`;
      if (key in this.visited) {
        return false;
      }
      this.visited[key] = step;
      this.elves[step] = (this.elves[step] ?? 0) + 1;

      this.addStep(x - 1, y);
      this.addStep(x + 1, y);
      this.addStep(x, y - 1);
      this.addStep(x, y + 1);

      return true;
    }
  }
}

let startGarden = (gardens["start"] = new Garden(""));
startGarden.addStep(start.x, start.y);

while (walkies.length) {
  for (const garden of Object.values(gardens)) {
    garden.step++;
  }
  for (const walk of walkies.splice(0, walkies.length)) {
    walk();
  }
}

for (const garden of Object.values(gardens)) {
  let odds = 0;
  let evens = 0;
  garden.elves = garden.elves.map((n, i) => {
    if (i & 1) {
      return (odds += n);
    } else {
      return (evens += n);
    }
  });
  delete garden.pendingSteps;
}

function visit(steps) {
  let visited = {};
  let elves = 0;
  let elvegroups = [];

  let grid = {};
  let gminx = 0,
    gminy = 0,
    gmaxx = 0,
    gmaxy = 0;

  function doVisit(x, y, garden, steps) {
    if (steps < 0) {
      return;
    }

    const key = `${x}:${y}`;
    if (visited[key]) {
      return;
    }

    gminx = Math.min(x, gminx);
    gmaxx = Math.max(x, gmaxx);
    gminy = Math.min(y, gminy);
    gmaxy = Math.max(y, gmaxy);

    visited[key] = garden;

    let effectivesteps;
    if (steps < garden.elves.length) {
      elves += grid[key] = garden.elves[steps];
      elvegroups.push(`${garden.dir || "*"}:${steps}`);
    } else {
      if (garden.elves.length & 1) {
        elves += grid[key] =
          garden.elves[
            (effectivesteps = garden.elves.length - 1 - (steps & 1))
          ];
      } else {
        elves += grid[key] =
          garden.elves[
            (effectivesteps = garden.elves.length - 1 - ((steps + 1) & 1))
          ];
      }
      elvegroups.push(`fill:` + grid[key]);
    }

    for (const [dir, { step, garden: branch }] of Object.entries(
      garden.branched,
    )) {
      const { dx, dy } = compass[dir];
      //console.log(`dir = ${dir} = ${dx}, ${dy} / ${steps} - ${step} = ${steps - step}`);
      todo.push(() => {
        doVisit(x + dx, y + dy, branch, steps - step);
      });
    }
  }

  doVisit(0, 0, startGarden, steps);

  while (todo.length) {
    todo.shift()();
  }

  return {
    elvegroups: elvegroups.reduce(
      (map, group) =>
        Object.assign(map, {
          [group]: (map[group] ?? 0) + 1,
        }),
      {},
    ),
    range: { gminx, gmaxx, gminy, gmaxy },
    grid,
    elves,
  };
}

//console.log(JSON.stringify(gardens, null, 2));

function dg(a, b) {
  return {
    ...Object.entries(b).reduce(
      (map, [k, v]) => (k in a ? map : Object.assign(map, { [k]: v })),
      {},
    ),
    ...Object.entries(a).reduce(
      (map, [k, v]) =>
        (b[k] ?? 0) - v == 0
          ? map
          : Object.assign(map, {
              [k]: (b[k] ?? 0) - v,
            }),
      {},
    ),
  };
}

function sign(i) {
  console.log(`---- ${i} ----`);
  let { grid, range} = show(visit(i));
    console.log('\n\n');
    const { gminx, gminy, gmaxx, gmaxy} = range;
    function sample(xn, xm, yn, ym) {
        const s = [];
        for(let y = yn; y <= ym; y++)
        for(let x = xn; x <= xm; x++)
            s.push(grid[`${x}:${y}`]);

        return s.join(',');
    }

    let sig = [
        (i & 1) ? 'odd' : 'even',
        `W${sample(gminx, gminx + 1, -1, 1)}`,
        `E${sample(gminx-1, gminx, -1, 1)}`,
        `N${sample(-1, 1, gminy, gminy + 1)}`,
        `S${sample(-1, 1, gmaxy - 1, gmaxy)}`
    ].join(',');

    return { sig, range };
}

const edgecases = {};
const edgerange = {}
let wrap;
let growthspeed;
for(let i = 0; ; i++) {
    const { sig, range } = sign(i);

console.log({ i, sig })

    if (edgecases[sig]) {
        wrap = [edgecases[sig], i];
        let archetype = edgerange[edgecases[sig]];
        growthspeed = [
            range.gmaxx - range.gminx - (archetype.gmaxx - archetype.gminx),
            range.gmaxy - range.gminy - (archetype.gmaxy - archetype.gminy),
        ]

        console.log({ wrap });

        break;
    }
    edgecases[sig] = i;
    edgerange[i] = range;
}

function fastvisit(n) {
    if (n < wrap[0]) {
        return show(visit(n));
    }

    let growth = Math.floor((n - wrap[0]) / (wrap[1] - wrap[0]));
    let character = ((n - wrap[0]) % (wrap[1] - wrap[0])) + wrap[0];

    const archetype = visit(character);

    const { range, grid } = archetype;
    let w =  range.gmaxx - range.gminx + 1 + growth * growthspeed[0];
    let h =  range.gmaxy - range.gminy + 1 + growth * growthspeed[1];

    show(archetype);
    console.log('with growth = ' + growth, w, h);

    const oe = (w-1)/2;
    let ie = (oe-1);

    let oes = oe * (
        (archetype.grid[`${archetype.range.gminx}:${1}`] ?? 0) +
        (archetype.grid[`${archetype.range.gminx}:${-1}`] ?? 0) +
        (archetype.grid[`${archetype.range.gmaxx}:${1}`] ?? 0) +
        (archetype.grid[`${archetype.range.gmaxx}:${-1}`] ?? 0)
    );

    let ies = ie * (
        (archetype.grid[`${archetype.range.gminx+1}:${1}`] ?? 0) +
        (archetype.grid[`${archetype.range.gminx+1}:${-1}`] ?? 0) +
        (archetype.grid[`${archetype.range.gmaxx-1}:${1}`] ?? 0) +
        (archetype.grid[`${archetype.range.gmaxx-1}:${-1}`] ?? 0)
    );

    const cardinal = {
        w: (archetype.grid[`${archetype.range.gminx}:${0}`] ?? 0),
        ww: (archetype.grid[`${archetype.range.gminx+1}:${0}`] ?? 0),
        e: (archetype.grid[`${archetype.range.gmaxx}:${0}`] ?? 0),
        ee: (archetype.grid[`${archetype.range.gmaxx-1}:${0}`] ?? 0),
        n: (archetype.grid[`${0}:${archetype.range.gminy}`] ?? 0),
        nn: (archetype.grid[`${0}:${archetype.range.gminy+1}`] ?? 0),
        s: (archetype.grid[`${0}:${archetype.range.gmaxy}`] ?? 0),
        ss: (archetype.grid[`${0}:${archetype.range.gmaxy-1}`] ?? 0),
    }

    let interior = archetype.grid['0:0'];

    while (--ie) {
      interior += (ie*archetype.grid[`${0}:${~ie&1}`] + archetype.grid[`${0}:${ie&1}`])*4;
    }
    
    const sum =  ies + oes + Object.values(cardinal).reduce((a,b) => a + b)  + interior;
    console.log({ sum: sum, ies, oes, interior, cardinal });

    if(n < 1000) {
      const actual = visit(n);
      show(actual);

      console.log('total:', actual.elves, 'off: ', actual.elves - sum)
    }
}

fastvisit(400);

function show(walkies) {
  const {
    range: { gminx, gminy, gmaxx, gmaxy },
    grid,
    elves,
    elvegroups,
  } = walkies;

  if (true)
    for (let y = gminy; y <= gmaxy; y++) {
      let row = [];
      for (let x = gminx; x <= gmaxx; x++) {
        row.push(grid[`${x}:${y}`] ?? 0);
      }
      console.log(row.map((n) => `      ${n}`.slice(-3)).join(","));
    }

    return walkies;
 // console.log(Object.keys(elvegroups).sort());
 // console.log(`total: ${elves}`);
}

function blinky(garden, steps) {
  for (let y = 0; y < h; y++) {
    const row = [];
    for (let x = 0; x < w; x++) {
      let tile = garden[y][x];
      switch (tile) {
        case "#":
          row.push(tile);
          break;
        case ".":
        case "S":
          row.push(gardens.blink(x, y, steps) ? "O" : ".");
          break;
      }
    }
    console.log(row.join(""));
  }
}

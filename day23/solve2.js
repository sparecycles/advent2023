const fs = require("fs");
const chalk = require('chalk');

const map = (fs.readFileSync(process.argv[2] || "./input", "utf-8") + "\n")
  .split("\n")
  .filter(Boolean)
  .map((line) => {
    return line.split('');
  });

let start = [0, map[0].indexOf('.')]

function branches(y, x) {
  let tiles = [
    map[y+1]?.[x],
    map[y-1]?.[x],
    map[y]?.[x+1],
    map[y]?.[x-1]
  ];
  let branches = tiles.filter(tile => tile && '+.<>^vx'.indexOf(tile) > -1).length >= 3;
  return branches;
}

let todo = [];
let paths = {};
let pathsteps = {};
let id = 0;
function color([y,x] = start, steps = []) {
  if(y < 0 || y >= map.length) return;
  let tile = map[y][x];

  switch(tile) {
  case '.':
  case '>':
  case '<':
  case '^':
  case 'v':
  case 'x':
    if (steps.find(([py,px]) => py === y && px ===x )) {
      return;
    }
    steps.push([y,x]);
    let done = y == map.length - 1;
    if (branches(y, x) || done) {
      let pathrec = { steps: steps, id: id++ };
      let start = `${steps[0][1]}:${steps[0][0]}`;
      let end = `${x}:${y}`;
      (paths[end] ??= []).push({ ...pathrec, next: start });
      (paths[start] ??= []).push({ ...pathrec, next: end, done });
      pathsteps[pathrec.id] = steps;
      map[y][x] = 'x';
      todo.push(
        () => color([y-1, x], [[y,x]]),
        () => color([y+1, x], [[y,x]]),
        () => color([y, x-1], [[y,x]]),
        () => color([y, x+1], [[y,x]])
      );
    } else {
      map[y][x] = '+';
      todo.push(
        () => color([y-1, x], [...steps]),
        () => color([y+1, x], [...steps]),
        () => color([y, x-1], [...steps]),
        () => color([y, x+1], [...steps])
      );
    }

    break;
  }
}

color();
while(todo.length) {
  todo.pop()();
}

function walk(visited = [`${start[1]}:${start[0]}`], ids = []) {
  let options = paths[visited[0]];
  
  return options.flatMap(({ next, id, done }) => {
    if (visited.includes(next)) {
      return [];
    }

    if (done) {
      return [{ visited: [next, ...visited], ids: [...ids, id] }];
    }

    return walk([next, ...visited], [...ids, id]);
  });
}

const walks = walk().map((result, i) => {
  result.length = result.ids.map(id => pathsteps[id].length).reduce((a, b) => a + b - 1) - 1;
  return result;
});

const longest = walks.sort(({ length: a }, { length: b}) => b-a)[0];

map.forEach((row,y) => {
  console.log(row.map((tile,x) => 
  longest.ids.some((id) => pathsteps[id].find(([py, px]) => py==y && px == x))? chalk.blue(tile) :
  Object.keys(pathsteps).some((id) => pathsteps[id].find(([py, px]) => py==y && px == x)) ? chalk.red(tile) :
     tile
  ).join(''));
})


console.log(longest.length);


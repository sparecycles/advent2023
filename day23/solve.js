const fs = require("fs");

const map = (fs.readFileSync(process.argv[2] || "./input", "utf-8") + "\n")
  .split("\n")
  .filter(Boolean)
  .map((line) => {
    return line.split('');
  });

let start = [0, map[0].indexOf('.')]


function walks(visited, [y,x]) {
  if(y < 0 || y > map.length ||x < 0 || x > map[0].length)
   return [];

  let tile = map[y][x];

  if(tile == '#') return [];

  let loc = `${x}:${y}`;

  if (visited.includes(loc))
    return [];

  visited = [...visited, loc];

  if(y === map.length - 1) {
    return [{ visited, x, y }];
  }

  switch(tile) {
  case '<':
    return walks(visited, [y, x-1]);
  case '>':
    return walks(visited, [y, x+1]);
  case '^':
    return walks(visited, [y-1, x]);
  case 'v':
    return walks(visited, [y+1, x]);
  }

  return [[-1,0], [0,-1], [1,0], [0,1]].flatMap(([dy,dx]) =>walks(visited, [y+dy, x+dx]));
}

let paths = walks([], start);
let { visited } = paths[0];

let vset = new Set(visited);
map.forEach((row,y) => {
  console.log(row.map((tile,x) => vset.has(`${x}:${y}`) ? 'O' : tile).join(''));
});

console.log(Math.max(...paths.map(({ visited }) => visited.length)) - 1);

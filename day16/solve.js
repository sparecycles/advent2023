const fs = require('fs');
const mirrors = (fs.readFileSync(process.argv[2] || './input', 'utf-8') + '\n')
    .split('\n')
    .filter(Boolean);

function trace([x,y], dx, dy) {
    const passed = new Set();
    const energized = {};
    cast([x,y], dx, dy);
    return Object.keys(energized).length;

    function cast([x,y], dx, dy) {
        const tile = mirrors[y]?.[x];
        if(!tile) {
            return;
        }

        const key = `${x},${y}:${dx},${dy}`;
        if (passed.has(key)) {
            return;
        }

        passed.add(key);

        energized[`${x},${y}`] = true;

        if (tile == '.' || (dy == 0 && tile == '-') || (dx == 0 && tile == '|')) {
            return cast([x + dx, y + dy], dx, dy);
        }

        if (tile == '\\') {
            return cast([x+dy,y+dx], dy, dx);
        }
        if (tile == '/') {
            return cast([x-dy,y-dx], -dy, -dx);
        }

        if(tile == '|') {
            cast([x,y], 0, -1);
            cast([x,y], 0, +1);
            return;
        }

        if(tile !== '-') {
            throw new Error('oops');
        }

        cast([x,y], -1, 0);
        cast([x,y], +1, 0);
    }
}

function range(min, max) {
    let a = [];
    for(let i = min; i < max; i++) {
        a.push(i);
    }
    return a;
}

let max = Math.max(...[
    { starts: range(0, mirrors[0].length).map((x) => [x, 0]), d: [0, 1] },
    { starts: range(0, mirrors[0].length).map((x) => [x, mirrors.length-1]), d: [0, -1] },
    { starts: range(0, mirrors.length).map((y) => [0, y]), d: [1, 0] },
    { starts: range(0, mirrors.length).map((y) => [mirrors[0].length-1, y]), d: [-1, 0] },
].flatMap(({ starts, d: [dx, dy] }) => starts.map(([x,y]) => trace([x,y], dx, dy))));

console.log(trace([0, 0], 1, 0))
console.log(max);

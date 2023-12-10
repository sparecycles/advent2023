const fs = require('fs');
const lines = fs.readFileSync(process.argv[2] || './input', 'utf-8')
    .split('\n')
    .filter(Boolean)
    .filter(line => !/^#/.test(line));

const connections = {
    '|': [[0,-1], [0,+1]],
    '-': [[-1,0], [1,0]],
    'F': [[1,0], [0,1]],
    'J': [[-1,0],[0,-1]],
    'L': [[1,0], [0,-1]],
    '7': [[-1,0], [0,1]],
};

const grid = lines.map(line => [...line]);
const startY = grid.findIndex(row => row.includes('S'));
const startX = grid[startY].indexOf('S');

function findStep1() {
    if (startY > 0 && 'F|7'.includes(grid[startY-1][startX])) {
        return [startX, startY-1];
    }
    if (startX > 0 && 'F-L'.includes(grid[startY][startX-1])) {
        return [startX-1, startY];
    }
    if (startY < grid.length-1 && 'J|L'.includes(grid[startY+1][startX])) {
        return [startX, startY+1];
    }
    if ('J-7'.includes(grid[startY][startX+1])) {
        return [startX+1, startY];
    }
    throw new Error('no start for grid');
}

let [nx,ny] = findStep1();

function area() {
    let px = startX, py = startY;
    let steps = 1;
    let [dx,dy] = [nx - px, ny - py];
    let xarea = dx*ny;
    let yarea = dy*nx;
    
    while (nx != startX || ny != startY) {
        const tile = grid[ny][nx];
        ([[dx, dy]] = connections[tile].filter(([dx, dy]) => dx != px - nx || dy != py - ny));
        
        ([px, py] = [nx, ny]);
        nx += dx;
        ny += dy;
        xarea += dx*ny;
        yarea += dy*nx;
        
        steps++;
    }

    console.log(xarea, -yarea);

    return Math.abs(xarea - yarea)/2 - steps/2 + 1;
}

console.log(area());

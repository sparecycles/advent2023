const fs = require('fs');
const lines = fs.readFileSync(process.argv[2] || './input', 'utf-8')
    .split('\n')
    .filter(Boolean)
    .filter(line => !/^@/.test(line));

const galaxies = lines.flatMap((line, y) => [...line].flatMap((c, x) => {
    if (c === '#') {
        return [[x, y]];
    }
    return [];
}));

const xs = [...new Set(galaxies.map(([x]) => x))].sort((a, b) => a - b);
const ys = [...new Set(galaxies.map(([,y]) => y))].sort((a, b) => a - b);

const expanded = galaxies.map(([x,y]) => {
    x += x - xs.findIndex((xr) => xr >= x);
    y += y - ys.findIndex((yr) => yr >= y);
    return [x,y];
})

const sum = expanded.flatMap((each, index) => {
    return expanded.slice(index+1).map(alt => {
        const [ex,ey] = each;
        const [ax,ay] = alt;
        return Math.abs(ax-ex) + Math.abs(ay - ey)
    })
}).reduce((sum, a) => sum + a, 0);

console.log(sum);

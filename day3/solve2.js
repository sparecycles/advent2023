const fs = require('fs');
const lines = fs.readFileSync(process.argv[2] || './input', 'utf-8')
    .split('\n')
    .filter(Boolean)
    .filter(line => !/^#/.test(line));

const syms = lines.flatMap((line, i) => {
    const sym = /[^.0-9]/g;
    const syms = [];
    while(sym.exec(line)) {
        syms.push([sym.lastIndex - 1, i]);
    }
    return syms;
});

const dots = syms.reduce((dots, [x,y]) => (dots[`${x}:${y}`] = [], dots), {});

function adjacent(y, x, num) {
    for(let iy = y - 1; iy <= y + 1; iy++)
    for(let ix = x - num.length - 1; ix <= x; ix++) {
        dots[`${ix}:${iy}`]?.push(Number(num));
    }
}

lines.flatMap((line, i) => {
    const num = /[0-9]+/g;
    let match;
    while ((match = num.exec(line))) {
        adjacent(i, num.lastIndex, match[0]);
    }
})

const result = Object.values(dots).filter(p => p.length === 2)
    .reduce((acc, [p,q]) => acc + p*q, 0);

console.log(dots, result);

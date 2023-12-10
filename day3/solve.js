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

const dots = syms.reduce((dots, [x,y]) => (dots[`${x}:${y}`] = true, dots), {});

function adjacent(y, x, len) {
    for(let iy = y - 1; iy <= y + 1; iy++)
    for(let ix = x - len - 1; ix <= x; ix++) {
        if(dots[`${ix}:${iy}`]) return true;
    }

    return false;
}

const nums = lines.flatMap((line, i) => {
    const num = /[0-9]+/g;
    const nums = [];
    let match;
    while ((match = num.exec(line))) {
        if (adjacent(i, num.lastIndex, match[0].length)) {
            nums.push(Number(match[0]));
        }
    }
    return nums;
})

console.log(nums, nums.reduce((a,b) => a + b));

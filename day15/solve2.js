const fs = require('fs');
const steps = (fs.readFileSync(process.argv[2] || './input', 'utf-8') + '\n')
    .split('\n')
    .filter(Boolean)
    .join('').split(',');

function hash(step) {
    return [...step].reduce((a, c) => (a + c.charCodeAt(0))*17 % 256, 0);
}

const boxes = [];
for(var i = 0; i < 256; i++) boxes.push([]);

for(const step of steps) {
    if (step.endsWith('-')) {
        const name = step.slice(0, -1);
        const ix = hash(name);
        boxes[ix] = boxes[ix].filter((({ name: _ }) => _ != name))
        continue;
    }

    const [name,num] = step.split('=');
    const ix = hash(name);
    const bx = boxes[ix].findIndex(({ name: _ }) => _ == name);
    if(bx == -1) {
        boxes[ix].push({ name, num });
    } else {
        boxes[ix][bx].num = num;
    }
}

console.log(boxes);
console.log(boxes.reduce((sum, box, ix) => {
    return sum + (ix+1)*box.reduce((sum, { num }, bx) => sum + (bx+1)*Number(num), 0)
}, 0));


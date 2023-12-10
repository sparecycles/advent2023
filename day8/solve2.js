const fs = require('fs');
const lines = fs.readFileSync(process.argv[2] || './input', 'utf-8')
    .split('\n')
    .filter(Boolean)
    .filter(line => !/^#/.test(line));
const steps = lines[0];

const map = lines.slice(1).map(line => {
    const [,step, L, R] = /([A-Z]+)\s*=\s*\(\s*([A-Z]+),\s*([A-Z]+)\s*\)/.exec(line);
    return { step, L, R };
}).reduce((map, { step, L, R }) => Object.assign(map, { [step]: { L, R } }), {});

function stepsFor(node) {
    let count = 0;
    let todo = [...steps];
    while(!node.endsWith('Z')) {
        count++;
        node = map[node][todo.shift()];
        if(todo.length == 0) {
            todo = [...steps];
        }
    }
    return count;
}

const nodes = Object.keys(map).filter(key => key.endsWith('A'));
const allSteps = nodes.map(node => stepsFor(node));

function gcd(a, b) {
    if (!b) {
        return a;
    }

    return gcd(b, a % b);
}

console.log(allSteps.reduce((a, step) => step * a / gcd(step, a), 1));


const fs = require('fs');
const steps = (fs.readFileSync(process.argv[2] || './input', 'utf-8') + '\n')
    .split('\n')
    .filter(Boolean)
    .join('').split(',');

function hash(step) {
    return [...step].reduce((a, c) => (a + c.charCodeAt(0))*17 % 256, 0);
}

console.log(hash('HASH'));
console.log(steps);
console.log(steps.map(hash));
console.log(steps.map(hash).reduce((a, b) => a + b, 0));


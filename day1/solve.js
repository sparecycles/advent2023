const fs = require('fs');
const lines = fs.readFileSync('./input', 'utf-8').split('\n');

const total = lines.filter(Boolean).map(line => line.replace(/[^\d]*/g, '')).reduce((total, line) => {
    return total + Number(line[0] + line.slice(-1))
}, 0);

console.log(total)

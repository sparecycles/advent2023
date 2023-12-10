const fs = require('fs');
const lines = fs.readFileSync(process.argv[2] || './input', 'utf-8')
    .split('\n')
    .filter(Boolean)
    .filter(line => !/^#/.test(line));

const score = lines.map(line => {
    const [wins, card] = line.split(':')[1].split('|').map(s => s.trim().split(/\s+/).map(Number));

    const count = card.filter(n => wins.includes(n)).length;
    return count == 0 ? 0 : (1 << (count - 1));
}).reduce((a,c) => a + c, 0)

console.log(score);

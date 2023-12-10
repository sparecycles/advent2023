const fs = require('fs');
const lines = fs.readFileSync(process.argv[2] || './input', 'utf-8')
    .split('\n')
    .filter(Boolean)
    .filter(line => !/^#/.test(line));

let cards = 0;
let copies = [];
lines.map(line => {
    const [wins, card] = line.split(':')[1].split('|').map(s => s.trim().split(/\s+/).map(Number));
    const ncopies = 1 + (copies.shift() ?? 0);
    cards += ncopies;

    const count = card.filter(n => wins.includes(n)).length;
    for (let n = 0; n < count; n++) {
        copies[n] = (copies[n] ?? 0) + ncopies;
    }
})

console.log(cards);

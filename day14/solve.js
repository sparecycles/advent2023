const fs = require('fs');
const rocks = (fs.readFileSync(process.argv[2] || './input', 'utf-8') + '\n')
    .split('\n')
    .filter(Boolean)
    .map(line => {
        return line;
    });

function rotate(lines) {
    const map = [];
    for (let i = 0; i < lines[0].length; i++) {
        map.push(lines.map(line => line[i]).join(''));
    }
    return map;
}

function roll(rocks) {
    let columns = rotate(rocks);

    columns = columns.map(line => {
        return line.split('#').map(part => [...part].sort((a,b) => b.localeCompare(a)).join('')).join('#');
    })

    return rotate(columns);
}

function score(rocks) {
    return rocks.reduce((score, line, i) => {
         return score + (rocks.length - i) * [...line].filter(c => c == 'O').length;
    }, 0)
}

console.log(score(roll(rocks)));

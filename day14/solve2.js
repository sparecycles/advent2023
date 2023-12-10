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

function rolln(rocks) {
    let columns = rotate(rocks);

    columns = columns.map(line => {
        return line.split('#').map(part => [...part].sort((a,b) => b.localeCompare(a)).join('')).join('#');
    })

    return rotate(columns);
}

function rolls(rocks) {
    let columns = rotate(rocks);

    columns = columns.map(line => {
        return line.split('#').map(part => [...part].sort((a,b) => -b.localeCompare(a)).join('')).join('#');
    })

    return rotate(columns);
}

function rollw(rocks) {
    return rocks.map(line => {
        return line.split('#').map(part => [...part].sort((a,b) => b.localeCompare(a)).join('')).join('#');
    })
}

function rolle(rocks) {
    return rocks.map(line => {
        return line.split('#').map(part => [...part].sort((a,b) => -b.localeCompare(a)).join('')).join('#');
    })
}

function cycle(rocks) {
    return rolle(rolls(rollw(rolln(rocks))));
}

function cycles(n, rocks) {
    const cache = {}
    for (let i = 1; i <= n; i++) {
        const key = rocks.join('\n');
        const k = cache[key];
        if (k) {
            n = i + ((n - i) % (i - k));
        }
        rocks = cycle(rocks);

        cache[key] ??= i;
    }
    return rocks;
}

function score(rocks) {
    return rocks.reduce((score, line, i) => {
         return score + (rocks.length - i) * [...line].filter(c => c == 'O').length;
    }, 0)
}

console.log(score(cycles(1000000000, rocks)));

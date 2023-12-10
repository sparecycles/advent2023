const fs = require('fs');
const {patterns} = (fs.readFileSync(process.argv[2] || './input', 'utf-8') + '\n')
    .split('\n')
    .reduce(({ patterns, pattern }, line) => {
        if (!line && pattern.length) {
            const map = pattern.splice(0, pattern.length);
            patterns.push({
                h: map,
                v: rotate(map)
            });
        } else {
            pattern.push(line);
        }
        return { patterns, pattern }
    }, { patterns: [], pattern: [] });

function rotate(lines) {
    const map = [];
    for(let i = 0; i < lines[0].length; i++) {
        map.push(lines.map(line => line[i]).join(''));
    }
    return map;
}

function mirror(pattern) {
    for(let i = 1; i < pattern.length; i++) {
        if (pattern.slice(i).every((line, index) => {
            let mirror = i - index - 1;
            return mirror < 0 || line === pattern[mirror];
        }))
        return i;
    }
    return 0;
}

console.log(patterns.map(({ h, v }) => mirror(h)*100 +mirror(v)).reduce((a, b) => a+ b, 0));

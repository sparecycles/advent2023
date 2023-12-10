const fs = require('fs');
const {patterns} = (fs.readFileSync(process.argv[2] || './input', 'utf-8') + '\n')
    .split('\n')
    .reduce(({ patterns, pattern }, line) => {
        if (!line && pattern.length) {
            const map = pattern.splice(0, pattern.length);
            patterns.push({
                h: map.map(nums),
                v: rotate(map).map(nums)
            });
        } else {
            pattern.push(line);
        }
        return { patterns, pattern }
    }, { patterns: [], pattern: [] });

function nums(line) {
    return parseInt(line.replace(/[#.]/g, (match) => ({ '#': '1', '.': '0' }[match])), 2);
}

function rotate(lines) {
    const map = [];
    for(let i = 0; i < lines[0].length; i++) {
        map.push(lines.map(line => line[i]).join(''));
    }
    return map;
}

function count(b) {
    let c = 0;
    for (; b; c++)
    {
        b &= b - 1; // clear the least significant bit set
    }
    return c;
}

function mirror(pattern) {
    for(let i = 1; i < pattern.length; i++) {
        if (pattern.slice(i).reduce((a, line, index) => {
            let mirror = i - index - 1;
            return a + (mirror < 0 ? 0 : count(line ^ pattern[mirror]));
        }, 0) == 1) {
            return i;
        }
    }
    return 0;
}

console.log(patterns.map(({ h, v }) => mirror(h)*100 +mirror(v)).reduce((a, b) => a+ b, 0));

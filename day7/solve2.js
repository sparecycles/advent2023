const fs = require('fs');
const lines = fs.readFileSync(process.argv[2] || './input', 'utf-8')
    .split('\n')
    .filter(Boolean)
    .filter(line => !/^#/.test(line));

const hands = lines.map(line => {
    const [,hand, bid] = /(.{5}) (\d+)/.exec(line);
    return {
        hand,
        bid: Number(bid)
    }
});

const result = hands
    .sort(({ hand: a }, { hand: b }) => compare(a, b))
    .map(({ bid }, i) => bid * (hands.length - i))
    .reduce((a, b) => a + b, 0);

console.log(result);

function type(hand) {
    const jokers = [...hand].filter(c => c === 'J').length;
    
    const counts = Object.values([...hand].filter(c => c != 'J').reduce((m, c) => Object.assign(m, {
            [c]: (m[c] ?? 0) + 1
    }), {})).sort((a, b) => b - a);

    return [counts[0] || 0 + jokers, ...counts.slice(1)].join('');
}

function strength(c) {
    return 15 - 'AKQKT98765432J'.indexOf(c);
}

function compare(a, b) {
    return type(b).localeCompare(type(a)) ||
        strength(b[0]) - strength(a[0]) ||
        strength(b[1]) - strength(a[1]) ||
        strength(b[2]) - strength(a[2]) ||
        strength(b[3]) - strength(a[3]) ||
        strength(b[4]) - strength(a[4]);
}


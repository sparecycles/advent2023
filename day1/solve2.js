const fs = require('fs');
const lines = fs.readFileSync('./input', 'utf-8').split('\n');

const total = lines.filter(Boolean)
    .reduce((total, line) => {
        console.log(line, firstNumber(line), lastNumber(line))
    return total + Number(firstNumber(line) + lastNumber(line))
}, 0);

console.log(total)

function r(s) {
    return [...s].reduce((a, c) => (({ '(': ')', ')': '(' })[c] ?? c) + a, '');
}

function firstNumber(line) {
    line = line.replace(/(one)|(two)|(three)|(four)|(five)|(six)|(seven)|(eight)|(nine)/g, (_,...grp) => {
        return String(grp.findIndex(Boolean) + 1);
    });
    return line.replace(/[^\d]*/g, '')[0];
}


function lastNumber(line) {
    line = r(line).replace(new RegExp(r(/(one)|(two)|(three)|(four)|(five)|(six)|(seven)|(eight)|(nine)/.source), 'g'), (_,...grp) => {
        return String(9 - grp.findIndex(Boolean));
    });
    return line.replace(/[^\d]*/g, '')[0];
}


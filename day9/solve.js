const fs = require('fs');
const lines = fs.readFileSync(process.argv[2] || './input', 'utf-8')
    .split('\n')
    .filter(Boolean)
    .filter(line => !/^#/.test(line));

function parse(line) {
    return line.split(/\s+/).map(s => Number(s.trim()));
}

function differences(nums) {
    return nums.slice(1).map((n, i) => n - nums[i])
}

function extrapolate(...nums) {
    console.log(...nums);
    const diffs = differences(nums);
    if (diffs.every(n => n == 0)) {
        return 0;
    }

    return extrapolate(...diffs) + diffs.slice(-1)[0];
}

const n = lines.map(line => {
    const nums = parse(line);
    return extrapolate(...nums) + nums.slice(-1)[0]
});
console.log(n);
console.log(n.reduce((a,b) => a + b));

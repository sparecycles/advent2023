const fs = require('fs');
const lines = fs.readFileSync(process.argv[2] || './input', 'utf-8')
    .split('\n')
    .filter(Boolean)
    .map(line => {
        const [springs, nums] = line.split(/\s+/, 2);

        return {
            springs: springs.split(/[.]\+/).join('.'),
            nums: nums.split(/\s*,\s*/).map(Number)
        };
    });

const ways = ({springs, nums}) => {
    const re = new RegExp(`^[.?]*${nums.map(n => `[?#]{${n}}`).join(`[?.]+`)}[.?]*$`);
    function matches(springs, i) {
        if (!re.test(springs) || i == springs.length) {
            return 0;
        }

        let index = springs.indexOf('?', i);
        if(index == -1) {
            return 1;
        }
        
        let sprung = Object.assign([...springs], { [index]: '#' }).join('');
        let sprang = Object.assign([...springs], { [index]: '.' }).join('');
        return matches(sprung, index) + matches(sprang, index);
    }

    return matches(springs, 0);
};

const mapped = lines.map(({ springs, nums }) => {
    return ways({ springs, nums });
})

console.log(mapped.reduce((a, b) => a + b, 0));

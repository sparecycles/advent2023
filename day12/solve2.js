const fs = require('fs');
const lines = fs.readFileSync(process.argv[2] || './input', 'utf-8')
    .split('\n')
    .filter(Boolean)
    .map(line => {
        const [springs, nums] = line.split(/\s+/, 2);

        const ns = nums.split(/\s*,\s*/).map(Number);
        const reduced = springs.split(/[.]\+/).join('.');
        return {
            springs: [reduced, reduced,reduced,reduced,reduced].join('?') + '.',
            nums: [...ns, ...ns, ...ns, ...ns, ...ns]
        };
    });

const ways = ({springs, nums}) => {
    let parts = [...springs.replace(/^[.]+/, '')];
    let cache = {};
    function ways(i = 0, p = 0, n = -1) {
        let key = `${i},${p},${n}`
        if(key in cache) {
            return cache[key];
        }
        while (p < parts.length) {
            if (n == 0) switch(parts[p++]) {
                case '#':
                    return 0;
                case '?':
                case '.':
                    n = -1;
                    continue;
            } else if (n == -1) switch(parts[p++]) {
                case '?':
                    if (i == nums.length) {
                        return cache[key] = ways(i, p, n);
                    }
                    return cache[key] = ways(i, p, n) + ways(i+1, p, nums[i]-1);
                case '#':
                    if (i == nums.length) {
                        return 0;
                    }
                    n = nums[i++] - 1;
                    continue;
                case '.':
                    continue;
            } else switch (parts[p++]) {
                case '?':
                case '#':
                    n--;
                    continue;
                case '.':
                    return 0;
            }
        }
        return cache[key] = (n <= 0 && i == nums.length ? 1 : 0);
    }

    return ways();
};

const mapped = lines.map(({ springs, nums }) => {
    return ways({ springs, nums });
})

console.log(mapped.reduce((a, b) => a + b, 0));

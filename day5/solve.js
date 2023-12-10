const fs = require('fs');
const lines = fs.readFileSync(process.argv[2] || './input', 'utf-8')
    .split('\n')
    .filter(Boolean)
    .filter(line => !/^#/.test(line));

function parse(lines) {
    const seeds = /seeds: (.*)/.exec(lines.shift())[1].trim().split(/\s+/).map(Number);
    const mappings = [];
    while(lines.length) {
        while(lines.length && !/([a-z]+)-to-([a-z]+) map:/.test(lines[0])) {
            lines.shift();
        }
        if(!lines.length) {
            break;
        }
        const [,from,to] = /([a-z]+)-to-([a-z]+) map:/.exec(lines.shift());
        const mapping = { from, to, ranges: [] };
        let match;
        while(/(\d+) (\d+) (\d+)/.test(lines[0])) {
            match = /(\d+) (\d+) (\d+)/.exec(lines.shift());
            if(!match) {
                break;
            }
            const [,dest,source,size] = match;
            mapping.ranges.push({
                source: Number(source),
                dest: Number(dest),
                size: Number(size)
            })
        }
        mappings.push(mapping);
    }
    return { seeds, mappings };
}

const { seeds, mappings } = parse(lines.slice())
function mapSeed(seed) {
    return mappings.reduce((seed, { from, to, ranges }) => {
        const range = ranges.find(({ source, size }) => (seed >= source && seed < source + size));
        return range ? seed - range.source + range.dest : seed;
    }, seed)
}
console.log(Math.min(...seeds.map(mapSeed)));

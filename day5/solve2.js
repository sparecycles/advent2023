const fs = require('fs');
const lines = fs.readFileSync(process.argv[2] || './input', 'utf-8')
    .split('\n')
    .filter(Boolean)
    .filter(line => !/^#/.test(line));

function parse(lines) {
    const seednums = /seeds: (.*)/.exec(lines.shift())[1].trim().split(/\s+/).map(Number);
    const seeds = [];
    for(var i = 0; i < seednums.length; i += 2) {
        seeds.push({ start: seednums[i], seeds: seednums[i+1] })
    }
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
                offset: Number(dest) - Number(source),
                size: Number(size)
            })
        }
        mapping.ranges.sort(({ source: a }, { source: b }) => a - b);
        mappings.push(mapping);
    }
    return { seeds, mappings };
}

const { seeds, mappings } = parse(lines.slice())
function mapSeeds(seedlist) {
    return mappings.reduce((seedlist, { ranges }) => {
        ranges = ranges.slice();

        const mapped = [];
        while (seedlist.length && ranges.length) {
            const { source, offset, size } = ranges[0];
            const { start, seeds } = seedlist[0];
            if (start + seeds <= source) {
                mapped.push(seedlist.shift());
            } else if (start < source) {
                seedlist.shift();
                mapped.push({ start, seeds: source - start });
                if (start + seeds <= source + size) {
                    mapped.push({ start: source + offset, seeds: seeds - source + start });
                } else {
                    mapped.push({ start: source + offset, seeds: size });
                    seedlist.unshift({ start: source + size, seeds: seeds - size - source + start });
                }
            } else if (start < source + size) {
                seedlist.shift();
                if (start + seeds < source + size) {
                    mapped.push({ start: start + offset, seeds });
                } else {
                    mapped.push({ start: start + offset, seeds: size - start + source });
                    seedlist.unshift({
                        start: source + size, seeds: seeds - size - source + start
                    });
                }
            } else {
                ranges.shift();
            }
        }
        
        mapped.push(...seedlist);

        return mapped.filter(({ seeds }) => seeds != 0);
    }, seedlist);
}

console.log(Math.min(...mapSeeds(seeds).map(({ start }) => start)));

const fs = require('fs');
const modules = (fs.readFileSync(process.argv[2] || './input', 'utf-8') + '\n')
    .split('\n')
    .filter(Boolean)
    .map(line => {
        const [,src,targets] = /([^\s-]*)\s*->\s*(.*)/.exec(line);

        const type = src[0];
        return { type, name: type === 'b' ? src : src.slice(1), targets: targets.split(/,\s*/).map(s => s.trim()) };
    });

const machine = modules.reduce((map, mod) => Object.assign(map, {
    [mod.name]: mod
}), {});

const flipflops = modules.filter(({ type }) => type === '%').reduce((map, { name }) => {
    return Object.assign(map, {
        [name]: false
    });
}, {});

const conjuctionsources = modules.filter(({ type }) => type === '&').reduce((map, { name }) => {
    const sources = modules.flatMap(({ name: mod, targets }) => {
        if(targets.includes(name)) {
            return [mod]
        };
        return [];
    });

    return Object.assign(map, {
        [name]: { sources: sources.reduce((map, source) => Object.assign(map, {
            [source]: false
        }), {}), value: sources.length }
    });
}, {})

let trues = 0, falses = 0;
function pulse() {
    const todo = [{ target: 'broadcaster', current: false, from: null}];

    function send() {
        let { target, current, from } = todo.shift();
        if(current)
        trues++; else falses++;

        if(!machine[target]) {
            return;
        }

        const { type, name, targets } = machine[target];

        if (type === '%') {
            if (current === true) {
                return;
            }
            current = flipflops[name] = !flipflops[name];
        } else if(type === '&') {
            const cv = conjuctionsources[name];
            if(cv.sources[from] != current) {
                cv.sources[from] = current;
                if (!current) {
                  cv.value++;
                } else {
                  cv.value--;
                }
            }
            current = cv.value != 0;
        }

        targets.forEach(next => todo.push({ target: next, current, from: target }));
    }

    while(todo.length) {
        send();
    }
}

for(let i = 0; i < 1000; i++) {
    pulse();
}

console.log(falses, trues, falses*trues);

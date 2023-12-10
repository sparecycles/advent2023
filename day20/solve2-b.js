const fs = require("fs");
const chalk = new (require('chalk').Instance)({ level: 3 })
const modules = (fs.readFileSync(process.argv[2] || "./input", "utf-8") + "\n")
  .split("\n")
  .filter(Boolean)
  .map((line) => {
    const [, src, targets] = /([^\s-]*)\s*->\s*(.*)/.exec(line);

    const type = src[0];
    return {
      type,
      name: type === "b" ? src : src.slice(1),
      idx: -1,
      targets: targets.split(/,\s*/).map((s) => s.trim()),
      fired: 0
    };
  }).sort(({ type: a }, { type: b }) => a.localeCompare(b));

const names = modules.reduce(
  (map, mod, index) =>
    Object.assign(map, {
      [mod.name]: (mod.idx = index),
    }),
  { rx: modules.length },
);

modules.forEach((mod) => mod.targets = mod.targets.map(target => names[target] ?? (
  console.log('missing ' + target), -1)))

const bits = 30;

function on(state, bit) {
  let sid = 0;
  while(bit > bits) {
    sid++;
    bit -= bits;
  }
  state[sid] |= (1 << (bits - bit));
}

function off(state, bit) {
  let sid = 0;
  while(bit > bits) {
    sid++;
    bit -= bits;
  }
  state[sid] &= ~(1 << (bits - bit));
}

function get(state, bit) {
  let sid = 0;
  while(bit > bits) {
    sid++;
    bit -= bits;
  }
  return (state[sid] & (1 << (bits - bit))) != 0;
}

const conjuctionsources = modules
  .filter(({ type }) => type === "&")
  .reduce((map, { idx }) => {
    const sources = modules.flatMap(({ idx: mod, targets }) => {
      if (targets.includes(idx)) {
        return [mod];
      }
      return [];
    });

    return Object.assign(map, {
      [idx]: sources.reduce(
        (state, source) => {
          on(state, source);
          return state;
        },
        [0,0]
      ),
      [`${idx}-source`]: sources
    });
  }, {});
const conjuctionmasks = Object.entries(conjuctionsources).reduce((map, [key, value]) => Object.assign(map,
  { [key]: value.slice() }
), {})

function bitcount(b) {
    let c = 0;
    for (; b; c++)
    {
        b &= b - 1; // clear the least significant bit set
    }
    return c;
}

let i = 0;
let rx = false;
let firsts = {};
let remaining = 4;
const rxname = names['rx'];
let trues = 0, falses = 0;
function pulse(state) {
  let involved = [0,0];
  const todo = [{ targets: [names['broadcaster']], current: false, from: null }];

  for(const [k,mask] of Object.entries(conjuctionmasks)) {
    conjuctionsources[k] = mask.map((m, i) => (m & ~state[i]));
  }

  function send(target, current, from) {
    if (target == rxname) {
      if (!current) {
        rx = true;
      }

      const masked = conjuctionmasks[names['hj']].map((m,i) => m & state[i]);

      const key = fmt(masked, false);
      if (firsts[key] === undefined) {
        firsts[key] = i+1;
        console.log(firsts);
        console.log(lcm(...Object.values(firsts)));
      }
    }
    
    if(current) { trues ++} else { falses++ };

    if (!modules[target]) {
      return;
    }
    on(involved, target);
    
    const { type, idx, targets } = modules[target];
    modules[target].fired++;

    if (type === "%") {
      if (current === true) {
        return;
      }

      current = !get(state, idx);;
    } else if (type === "&") {
        const cv = conjuctionsources[idx];
        if (current) {
          off(cv, from);
        } else {
          on(cv, from);
        }
        current = (cv[0] + cv[1] != 0);
    }

    if (current) {
      on(state, idx);
    } else {
      off(state, idx);
    }

    todo.push({ targets, current, from: target });
  }

  while (todo.length) {
    const { targets, current, from } = todo.shift();
    targets.forEach(target => {
      send(target, current, from);
    })
  }

  return involved;
}

//console.log('initial:  ' + fmt(state));

let countdown = 10000000;

function fmt(state, colors = true, involved = [~0, ~0], popular) {
  let s = state.map((s) => `000000000000000000000000000000${s.toString(2)}`.slice(-bits)).join('').slice(0, modules.length);

  return colors ? colorize(s, involved, popular) : s;
}

function colorize(s, involved, popular) {
  if(popular) {
    return popular.map(i => {
      const n = s[i];
      if(!get(involved, i)) {
        return n;
      }
      switch(modules[i].type) {
        case 'b': return chalk.yellow(n);
        case '%': return chalk.blue(n);
        case '&': return chalk.magenta(n);
      }  
    }).join('');
  }
  return [...s].map((n,i) => {
    if(!get(involved, i)) {
      return n;
    }
    //console.log(i, modules[i]);
    switch(modules[i].type) {
      case 'b': return chalk.yellow(n);
      case '%': return chalk.blue(n);
      case '&': return chalk.magenta(n);
    }
  }).join('')
}

let state = [0,0];
//for(let i = 0; i < modules.length; i++) on(state, i);

for (i = 0; i < 318504960; i++) {
  let involved = pulse(state);
//  console.log(`    ${i}`.slice(-5), fmt(state, true, involved));
}


function gcd(a, b) {
  if (!b) {
      return a;
  }

  return gcd(b, a % b);
}

function lcm(...nums) {
  return nums.reduce((a, b) => a*b/gcd(a,b))
}

console.log(i, falses, trues, trues * falses);

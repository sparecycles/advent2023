const fs = require('fs');
const lines = (fs.readFileSync(process.argv[2] || './input', 'utf-8') + '\n')
    .split('\n');


const rules = {};

// px{a<2006:qkq,m>2090:A,rfg}

let start = 'in';
while(lines[0].length) {
  let [,name, actions] = /([^{]*)\{([^}]*)\}/.exec(lines.shift());
  actions = actions.split(',').map(action => {
    let [test,result] = action.split(':');
    if(!result) {
      return { test: () => true, result: test };
    }
    return { test: (part) => (new Function('part', `return part.${test}`))(part), result }
  });
  start ??= name;
  rules[name] = actions;
}

const parts = lines.filter(Boolean).map(line => {
  return line.slice(1, -1).split(',').map(kv => kv.split('=')).reduce((attr, [k,v]) => Object.assign(attr, {
    [k]: Number(v)
  }), {});
});

function apply(part, rule) {
  for(const { test, result } of rules[rule]) {
    if (test(part)) {
      return result;
    }
  }
  throw new Error('failed to eval');
}

function processp(part) {
  let rule = start
  while(rule != 'A' && rule != 'R') {
    rule = apply(part, rule);
  }

  return rule;
}

console.log(parts.filter(part => processp(part) === 'A').reduce((sum, { x, m, a, s }) => sum + x + m + a + s, 0));


const fs = require('fs');
const lines = (fs.readFileSync(process.argv[2] || './input', 'utf-8') + '\n')
    .split('\n');

const rules = {};

let start = 'in';
while(lines[0].length) {
  let [,name, actions] = /([^{]*)\{([^}]*)\}/.exec(lines.shift());
  actions = actions.split(',').map(action => {
    let [test,result] = action.split(':');
    if (!result) {
      return { test: null, result: test };
    }
    return { test: { value: test[0], op: test[1], ref: Number(test.slice(2)) }, result }
  });
  start ??= name;
  rules[name] = actions;
}


function partrange() {
  return ;
}

let todo = [{ rule: start, step: 0, part: { x: [1, 4000], m: [1, 4000], a: [1, 4000], s: [1, 4000] } }]
let accepted = [];
function game() {
  let { rule, step, part } = todo.shift()
  if (rule == 'A') {
    accepted.push(part);
    return;
  }
  if (rule == 'R') {
    return;
  }
  let { test, result } = rules[rule][step];
  if (!test) {
    todo.push({ rule: result, step: 0, part });
    return;
  }

  const { value, op, ref } = test;
  const [min, max] = part[value];
  if (op === '<') {
    if (max < ref) {
      todo.push({ rule: result, step: 0, part });
    } else if (min < ref) {
      let tpart = { ...part, [value]: [min, ref-1] };
      let fpart = { ...part, [value]: [ref, max] };
      todo.push({ rule: result, step: 0, part: tpart });
      todo.push({ rule, step: step + 1, part: fpart });
    } else {
      todo.push({ rule, step: step + 1, part });
    }
  } else {
    if (min > ref) {
      todo.push({ rule: result, step: 0, part });
    } else if (max > ref) {
      let tpart = {...part, [value]: [ref+1, max] };
      let fpart = {...part, [value]: [min, ref] };
      todo.push({ rule: result, step: 0, part: tpart });
      todo.push({ rule, step: step + 1, part: fpart });
    } else {
      todo.push({ rule, step: step + 1, part });
    }
  }
}

while (todo.length) {
  game();
}

console.log(accepted.reduce((sum, {
  x: [_x, x_], m: [_m, m_], a: [_a, a_], s: [_s, s_]
}) => sum + 
  (x_ - _x + 1) *
  (m_ - _m + 1) *
  (a_ - _a + 1) *
  (s_ - _s + 1), 0));




const fs = require("fs");
const { connections, wires } = (fs.readFileSync(process.argv[2] || "./input", "utf-8") + "\n")
  .split("\n")
  .filter(Boolean)
  .reduce(({ connections, wires }, line) => {
    const [node, nodes] = line.split(':').map(s => s.trim());

    for (const alt of nodes.split(/\s+/).map(s => s.trim())) {
      (connections[node] ??= []).push(alt);
      (connections[alt] ??= []).push(node);
      wires[[node,alt].sort().join(':')] = true;
    }
    return { connections, wires };
  }, { connections: {}, wires: {} });

const start = Object.keys(connections)[0]

let visited = {};
let todo = [];
function visit(node) {
  if(visited[node]) {
    return;
  }
  visited[node] = true;
  connections[node].forEach(node => {
    todo.push(() => visit(node));
  })
}
visit(start);
while(todo.length) {
  todo.shift()();
}

const asize = Object.keys(visited).length;
const bsize = Object.keys(connections).length - asize;
console.log(asize * bsize)

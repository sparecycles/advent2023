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

console.log(`
digraph G_component_0 {
  layout=sfdp
  ${Object.keys(connections).map(node => `${node} [label="${node}"];`).join(`
  `)}
  ${Object.entries(connections).map(([node,alts]) => alts.filter(alt => wires[`${node}:${alt}`]).map(alt =>
    `${node} -> "${alt}";`).join(`
  `)).join('')}
}
`)


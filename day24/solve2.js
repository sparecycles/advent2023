const fs = require("fs");

const stones = (fs.readFileSync(process.argv[2] || "./input", "utf-8") + "\n")
  .split("\n")
  .filter(Boolean)
  .map((line) => {
    const [x,y,z,dx,dy,dz] = [.../\s*([+-]?\d+),\s*([+-]?\d+),\s*([+-]?\d+)\s*@\s*([+-]?\d+),\s*([+-]?\d+),\s*([+-]?\d+)\s*/.exec(line)].slice(1,7).map(Number);
    return {
      x, y, z, dx, dy, dz
    }
  });

let three = stones.slice(0,3);
let bx = Math.min(...three.map(({ x }) => x))
let by = Math.min(...three.map(({ y }) => y))
let bz = Math.min(...three.map(({ z }) => z))

three.map((s) => s.x -= bx)
three.map((s) => s.y -= by)
three.map((s) => s.z -= bz)

console.log(three);

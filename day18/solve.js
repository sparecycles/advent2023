const fs = require('fs');
const digs = (fs.readFileSync(process.argv[2] || './input', 'utf-8') + '\n')
    .split('\n')
    .filter(Boolean)
    .map(line => {
      const [,dir,n,color] = /([LRDU])\s+(\d+)\s+\(#(.*)\)/.exec(line);
      return { dir, n: Number(n), color };
    })

function area() {
  const { area, steps } = digs.reduce(({ pos: [x,y], area, steps }, { dir, n }) => {
    steps += n;
    switch(dir) {
      case 'R':
        return { pos: [x+n,y], area: area - y*n, steps }
      case 'D':
        return { pos: [x,y+n], area: area + x*n, steps }
      case 'L':
        return { pos: [x-n,y], area: area + y*n, steps }
      case 'U':
        return { pos: [x,y-n], area: area - x*n, steps }
      }
      throw new Error('oops: ' + dir);
  }, {pos: [1000,1000], area: 0, steps: 0 });
  return area / 2 + steps / 2 + 1;
}

console.log(area());

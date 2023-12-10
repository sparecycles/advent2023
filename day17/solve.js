const fs = require('fs');
const map = (fs.readFileSync(process.argv[2] || './input', 'utf-8') + '\n')
    .split('\n')
    .filter(Boolean)
    .map(line => [...line].map(n => Number(n)))

const losses = {};

let pending = [];
function todo(x, y, dx, dy, loss) {
    pending.push({ x, y, dx, dy, loss })
}

function move(x, y, dx, dy, loss) {
    if (x < 0 || y < 0 || x >= map[0].length || y >= map.length) {
        return;
    }

    loss += map[y][x];

    if (dy == 0) {
        let key = `${x},${y},${dx},${dy}`;
        if (losses[key] && losses[key] <= loss) {
            return;
        }
        losses[key] = loss;
    } else {
        let key = `${x},${y},${dx},${dy}`
        if (losses[key] && losses[key] <= loss) {
            return;
        }
        losses[key] = loss;
    }

    if (dx > 0) {
        if(dx > 1) {
            todo(x + 1, y, dx - 1, dy, loss)
        }
        todo(x, y + 1, 0, +3, loss)
        todo(x, y - 1, 0, -3, loss)
    } else if(dy > 0) {
        if(dy > 1) {
            todo(x, y + 1, dx, dy - 1, loss)
        }
        todo(x + 1, y, +3, 0, loss)
        todo(x - 1, y, -3, 0, loss)
    } else if(dx < 0) {
        if(dx < -1) {
            todo(x - 1, y, dx + 1, dy, loss)
        }
        todo(x, y + 1, 0, +3, loss)
        todo(x, y - 1, 0, -3, loss)
    } else if(dy < 0) {
        if(dy < -1) {
            todo(x, y - 1, dx, dy + 1, loss)
        }
        todo(x + 1, y, +3, 0, loss)
        todo(x - 1, y, -3, 0, loss)
    }
}


function range(min, max) {
    let a = [];
    for(let i = min; i < max; i++) {
        a.push(i);
    }
    return a;
}

move(0, 0, 4, 0, -map[0][0]);
move(0, 0, 0, 4, -map[0][0]);

while (pending.length) {
    pending.splice(0, pending.length).forEach(({ x, y, dx, dy, loss }) => move(x, y, dx, dy, loss))
    pending.sort(({ loss: a }, { loss: b }) => a - b);
}

console.log(
    Math.min(...range(-4, 4).flatMap(x => range(-4, 4).map(y => losses[`${map[0].length-1},${map.length-1},${x},${y}`])).filter(Boolean))
);

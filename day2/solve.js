const fs = require('fs');
const lines = fs.readFileSync('./input', 'utf-8')
    .split('\n')
    .filter(Boolean)
    .filter(line => !/^#/.test(line));

const total = lines.map(line => {
    /** @type {string[]} */
    const [,num, playline] = /Game (\d+): (.*)/.exec(line);

    const plays = playline.split(';').map(play => play.split(',').reduce((colors, cubes) => {
        [,n,color] = /\s*(\d+)\s+(\S*)/.exec(cubes);
        return Object.assign(colors, {[color]: Number(n)})
    }, {}));
    
    return {
        num: Number(num),
        plays
    };
}).filter(({ plays }) => plays.every(({ red = 0, green = 0, blue = 0}) => red <= 12 && green <= 13 && blue <= 14)).reduce((total, { num }) => total + num, 0);
    
console.log(total);

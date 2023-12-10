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
}).map(({ plays }) => plays.reduce((min, { red = 0, green = 0, blue = 0}) => ({
    red: Math.max(red, min.red),
    blue: Math.max(blue, min.blue),
    green: Math.max(green, min.green),
}), { red: 0, green: 0, blue: 0 })).reduce((total, { red, green, blue }) => total + red*green*blue, 0);
    
console.log(total);

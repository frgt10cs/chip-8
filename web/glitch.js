import { randomInt } from './rand.js';

const glitch = (canvas, ctx) => {    
    let data = ctx.getImageData(0, 0, canvas.width, canvas.height);
    let k1 = randomInt(1, 5);
    let k2 = randomInt(5, 8);
    for (let y = 0; y < data.height; y++) {
        let deltaY = y * data.width;
        let skew = Math.ceil((y % (16 * k1)) / k2)
        for (let x = 0; x < data.width; x++) {
            data.data[(deltaY + x) * 4] = data.data[(deltaY + (x + skew)) * 4];
            data.data[(deltaY + x) * 4 + 1] = data.data[(deltaY + (x + skew)) * 4 + 1];
            data.data[(deltaY + x) * 4 + 2] = data.data[(deltaY + (x + skew)) * 4 + 2];
            data.data[(deltaY + x) * 4 + 3] = data.data[(deltaY + (x + skew)) * 4 + 3];
        }
    }
    ctx.putImageData(data, 0, 0);    
}

export { glitch };
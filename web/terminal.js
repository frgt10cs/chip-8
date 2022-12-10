import { glitch } from './glitch.js';
import { randomInt } from './rand.js';

class Terminal {

    constructor(canvas, frontColor, scale) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.scale = scale;
        this.frontColor = frontColor;
        this.ctx.fillStyle = frontColor;
        this.glitchEffect = true;
        this.runGlitch();
    }

    enableGlitchEffect() {
        this.glitchEffect = true;
        this.runGlitch();
    }

    disableGlitchEffect() {
        this.glitchEffect = false;
    }

    enableBlickEffect() {

    }

    disableBlickEffect() {

    }

    randomInt(min, max) {
        return Math.floor(min + Math.random() * (max + 1 - min));
    }

    runGlitch() {
        if (this.glitchEffect) {
            glitch(this.canvas, this.ctx);
            setTimeout(() => this.runGlitch(), randomInt(300, 5000));
        }
    }

    draw(display_memory) {
        this.clear();
        this.ctx.fillStyle = this.frontColor;
        for (let y = 0; y < 32; y++) {
            for (let x = 0; x < 64; x++) {
                if (display_memory[y * 64 + x] != 0) {
                    this.ctx.fillRect(x * this.scale, y * this.scale, this.scale, this.scale);
                }
            }
        }
    }

    drawText(text, x, y, font) {
        if (font != undefined)
            this.ctx.font = font;
        this.ctx.fillText(text, x, y);
    }

    drawMenuCursor(option) {
        var path = new Path2D();
        path.moveTo(50, 220 + option * 40);
        path.lineTo(50, 190 + option * 40);
        path.lineTo(70, 205 + option * 40);
        this.ctx.fill(path);
    }

    clear() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }
}

export { Terminal };
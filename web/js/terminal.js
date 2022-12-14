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
        this.blickEffect = true;
        this.parent = canvas.parentElement;
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
        this.blickEffect = true;
        this.parent.classList.add("blick");
    }

    disableBlickEffect() {
        this.blickEffect = false;
        this.parent.classList.remove("blick");
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

    drawPath(path) {
        this.ctx.fill(path);
    }

    drawText(text, x, y, font) {
        if (font != undefined)
            this.ctx.font = font;
        this.ctx.fillText(text, x, y);
    }

    drawCursor(option, step) {
        var path = new Path2D();
        path.moveTo(50, 280 + option * step);
        path.lineTo(50, 250 + option * step);
        path.lineTo(70, 265 + option * step);
        this.ctx.fill(path);
    }

    drawRect(x, y, length, width) {
        this.ctx.fillRect(x * scale, y * scale, length * scale, width * scale);
    }

    clear() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }
}

export { Terminal };
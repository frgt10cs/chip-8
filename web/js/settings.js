
const DelayMode = { GAME_BASED: "Game Based", VALUE: "Value" };

class DelaySettings {
    constructor(mode, delay) {
        this.mode = mode;
        this.value = delay;
    }
}

class Settings {
    constructor(glitchEffect, blickEffect, delayMode, delay) {
        this.glitchEffect = glitchEffect;
        this.blickEffect = blickEffect;
        this.delaySettings = new DelaySettings(delayMode, delay);
    }
}

export { DelayMode, DelaySettings, Settings };
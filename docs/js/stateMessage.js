const MessageTypes = {
    // common
    SWITCH_STATE: "switchWindow", BACK: "back",
    // settings
    SWITCH_GLITCH: "switchGlitch", SWITCH_BLICK: "switchBlick",
    SWITCH_DELAY_MODE: "switchDelayMode", SET_DELAY_VALUE: "setDelayValue",
    // games
    RUN_GAME: "loadGame", ESCAPE_FROM_GAME: "escapeFromGame"
};

class StateMessage {
    constructor(type, value) {
        this.type = type;
        this.value = value;
    }
}

export { MessageTypes, StateMessage };
const MessageTypes = {
    SWITCH_STATE: "switchWindow", SWITCH_GLITCH: "switchGlitch",
    SWITCH_BLICK: "switchBlick", SWITCH_DELAY_MODE: "switchDelayMode",
    BACK: "back"
};

class StateMessage {
    constructor(type, value) {
        this.type = type;
        this.value = value;
    }
}

export { MessageTypes, StateMessage };
const MessageTypes = { SWITCH_STATE: "switchWindow", SWITCH_GLITCH: "switchGlitch", SWITCH_BLICK: "switchBlick", BACK: "back" };

class StateMessage {
    constructor(type, value) {
        this.type = type;
        this.value = value;
    }
}

export { MessageTypes, StateMessage };
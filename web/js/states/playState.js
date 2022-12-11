import { load_rom, exec_cycle, get_display_memory, set_keys_states, reset } from "../../pkg/chip8.js";
import { State } from "./state.js";

class PlayState extends State {
    constructor(terminal) {
        super();
        this.terminal = terminal;
        this.keyStates = {
            "1": 0, "2": 0, "3": 0, "4": 0,
            "q": 0, "w": 0, "e": 0, "r": 0,
            "a": 0, "s": 0, "d": 0, "f": 0,
            "z": 0, "x": 0, "c": 0, "v": 0,
        };
        this.keyStatesValues = [];
        reset();
    }

    reset = () => {
        reset();
    }

    keyDownHandler = (key) => {
        if (this.keyStates[key] != undefined) {
            this.keyStates[key] = 1;
        }
    }

    keyUpHandler = (key) => {
        if (this.keyStates[key] != undefined) {
            this.keyStates[key] = 0;
        }
    }

    draw = () => {
        set_keys_states(Object.values(this.keyStates));
        exec_cycle();
        this.terminal.draw(get_display_memory());
    }
}

export { PlayState };
import { load_rom, exec_cycle, get_display_memory, set_keys_states, reset } from "../../../pkg/chip8.js";
import { State } from "./state.js";
import { MessageTypes, StateMessage } from '../stateMessage.js';

class PauseState extends State {
    constructor(terminal) {
        super();
        this.terminal = terminal;
        reset();
    }

    getName = () => "pause";

    reset = () => {
    }

    keyDownHandler = (key) => {
        let handleKeyResult = null;
        switch (key) {
            case "Escape":
                handleKeyResult = this.escHandler();
                break;
            case "Enter":
                handleKeyResult = this.enterHandler();
                break;
        }
        return handleKeyResult;
    }

    keyUpHandler = (key) => {
        if (this.keyStates[key] != undefined) {
            this.keyStates[key] = 0;
        }
    }

    escHandler = () => new StateMessage(MessageTypes.ESCAPE_FROM_GAME);

    enterHandler = () => new StateMessage(MessageTypes.BACK);

    draw = () => {
        this.terminal.draw(get_display_memory());
        this.terminal.drawRect(10, 10, 20, 20);
    }
}

export { PauseState };
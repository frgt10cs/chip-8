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

    }

    escHandler = () => new StateMessage(MessageTypes.ESCAPE_FROM_GAME);

    enterHandler = () => new StateMessage(MessageTypes.BACK);

    draw = () => {
        this.terminal.draw(get_display_memory());
        this.terminal.drawRect(18, 6, 28, 12);
        let font = 'bolder 64px Unscreen';
        this.terminal.drawText('Pause', 530, 180, font, "rgb(0, 0, 0)");
        font = 'bold 36px Unscreen';
        this.terminal.drawText('[ENTER] - continue', 450, 260, font, "rgb(0, 0, 0)");
        this.terminal.drawText('[ESC] - exit to menu', 450, 310, font, "rgb(0, 0, 0)");
    }
}

export { PauseState };
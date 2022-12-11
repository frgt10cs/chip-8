import { MessageTypes, StateMessage } from '../stateMessage.js';
import { State } from "./state.js";

class DelaySettingsState extends State {
    constructor(terminal) {
        super();
        this.terminal = terminal;
        this.gameBaseDelayMode = true;        
        this.reset();
    }

    reset = () => { this.option = 0; }


    keyDownHandler = (key) => {
        let handleKeyResult = null;
        switch (key) {
            case "Escape":
                handleKeyResult = this.escHandler();
                break;
            case "ArrowDown":
                handleKeyResult = this.arrowDownHandler();
                break;
            case "ArrowUp":
                handleKeyResult = this.arrowUpHandler();
                break;
            case "Enter":
                handleKeyResult = this.enterHandler();
                break;
        }
        return handleKeyResult;
    }

    keyUpHandler = () => {

    }

    arrowUpHandler = () => {
        this.option -= this.option == 0 ? 0 : 1;
    }

    arrowDownHandler = () => {
        let len = this.gameBaseDelayMode ? 0 : 1;
        this.option += this.option == len ? 0 : 1;
    }

    enterHandler = () => { }

    escHandler = () => {
        return new StateMessage(MessageTypes.BACK);
    }

    draw = () => {
        let font = 'bolder 64px Unscreen';
        this.terminal.drawText('Settings > Delay', 80, 120, font);

        font = 'bold 36px Unscreen';
        this.terminal.drawText('Mode', 80, 280, font);
        this.terminal.drawText('Value', 80, 360, font);

        this.terminal.drawText(this.gameBaseDelayMode ? "Game based" : "Value", 460, 280, font);
        this.terminal.drawText(this.delay, 460, 360, font);

        this.terminal.drawCursor(this.option, 80);
    }
}

export { DelaySettingsState };
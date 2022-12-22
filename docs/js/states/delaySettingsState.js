import { DelayMode, DelaySettings } from '../settings.js';
import { MessageTypes, StateMessage } from '../stateMessage.js';
import { State } from "./state.js";

class DelaySettingsState extends State {
    constructor(terminal, delaySettings) {
        super();
        this.terminal = terminal;
        this.delaySettings = delaySettings;
        this.optionHadlers = [this.switchDelayMode, this.switchEditDelayValueState];
        this.reset();
    }

    getName = () => "delaySettings";

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
        let len = this.delaySettings.mode == DelayMode.GAME_BASED ? 0 : 1;
        this.option += this.option == len ? 0 : 1;
    }

    enterHandler = () => this.optionHadlers[this.option]();

    escHandler = () => {
        return new StateMessage(MessageTypes.BACK);
    }

    switchDelayMode = () => new StateMessage(MessageTypes.SWITCH_DELAY_MODE);

    switchEditDelayValueState = () => new StateMessage(MessageTypes.SWITCH_STATE, "editDelayValue");

    draw = () => {
        let font = 'bolder 64px Unscreen';
        this.terminal.drawText('Settings > Delay', 80, 120, font);

        font = 'bold 36px Unscreen';
        this.terminal.drawText('Mode', 80, 280, font);
        this.terminal.drawText(this.delaySettings.mode, 460, 280, font);

        if (this.delaySettings.mode == DelayMode.VALUE) {
            this.terminal.drawText('Value', 80, 360, font);
            this.terminal.drawText(this.delaySettings.value, 460, 360, font);
        }

        this.terminal.drawCursor(this.option, 80);
    }
}

export { DelaySettingsState };
import { DelayMode, DelaySettings } from '../settings.js';
import { MessageTypes, StateMessage } from '../stateMessage.js';
import { State } from "./state.js";

class EditDelayValueState extends State {
    constructor(terminal, delaySettings) {
        super();
        this.terminal = terminal;
        this.delaySettings = delaySettings;
        this.reset();
    }

    getName = () => "editDelayValue";

    reset = () => { this.delayValue = this.delaySettings.value.toString(); }

    keyDownHandler = (key) => {
        let handleKeyResult = null;
        switch (key) {
            case "Escape":
                handleKeyResult = this.escHandler();
                break;
            case "Backspace":
                if (this.delayValue.length > 0)
                    this.delayValue = this.delayValue.substring(0, this.delayValue.length - 1);
                break;
            case "Enter":
                handleKeyResult = this.enterHandler();
                break;
            default:
                if (this.delayValue.length < 4) {
                    let num = Number(key);
                    if (!isNaN(num)) {
                        this.delayValue = this.delayValue + key;
                    }
                }
                break;
        }
        return handleKeyResult;
    }

    keyUpHandler = () => {

    }

    enterHandler = () => {
        if (this.delayValue != "")
            return new StateMessage(MessageTypes.SET_DELAY_VALUE, this.delayValue);
    }

    escHandler = () => new StateMessage(MessageTypes.BACK);

    draw = () => {
        let font = 'bolder 64px Unscreen';
        this.terminal.drawText('Settings > Delay', 80, 120, font);

        font = 'bold 36px Unscreen';
        this.terminal.drawText('Mode', 80, 280, font);
        this.terminal.drawText(this.delaySettings.mode, 460, 280, font);

        this.terminal.drawText('Value', 80, 360, font);
        this.terminal.drawText(this.delayValue + "▮", 460, 360, font);

        // this.terminal.drawTextCursor(10, 10, 36);

        this.terminal.drawCursor(this.option, 80);
    }
}

export { EditDelayValueState };
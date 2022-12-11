import { MessageTypes, StateMessage } from '../stateMessage.js';
import { State } from './state.js';

class SettingsState extends State {
    constructor(terminal) {
        super();
        this.terminal = terminal;
        this.optionHadlers = [this.switchGlitchEffect, this.switchBlickEffect, this.changeToDelayState];
        this.reset();
    }

    reset = () => {
        this.option = 0;
    }

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
        this.option += this.option == this.optionHadlers.length - 1 ? 0 : 1;
    }

    enterHandler = () => this.optionHadlers[this.option]();

    escHandler = () => new StateMessage(MessageTypes.BACK);

    switchGlitchEffect = () => new StateMessage(MessageTypes.SWITCH_GLITCH);

    switchBlickEffect = () => new StateMessage(MessageTypes.SWITCH_BLICK);

    changeToDelayState = () => new StateMessage(MessageTypes.SWITCH_STATE, "delaySettings");

    draw = () => {
        let font = 'bolder 64px Unscreen';
        this.terminal.drawText('Settings', 80, 120, font);

        font = 'bold 36px Unscreen';
        this.terminal.drawText('Glitch Effect', 80, 280, font);
        this.terminal.drawText('Blick', 80, 360, font);
        this.terminal.drawText('Delay', 80, 440, font);

        this.terminal.drawText("[" + (this.terminal.glitchEffect ? "x" : "") + "]", 460, 280, font);
        this.terminal.drawText("[" + (this.terminal.blickEffect ? "x" : "") + "]", 460, 360, font);
        this.terminal.drawText(this.gameBaseDelayMode ? "Game based" : this.delay, 460, 440, font);

        this.terminal.drawCursor(this.option, 80);
    }
}

export { SettingsState };
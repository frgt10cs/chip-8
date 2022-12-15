import { MessageTypes, StateMessage } from '../stateMessage.js';
import { State } from './state.js';

class SettingsState extends State {
    constructor(terminal, settings) {
        super();
        this.terminal = terminal;
        this.settings = settings;
        this.optionHadlers = [this.switchGlitchEffect, this.switchBlickEffect, this.changeToDelayState];
        this.reset();
    }

    getName = () => "settings";

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

        this.terminal.drawText("[" + (this.settings.glitchEffect ? "x" : "") + "]", 460, 280, font);
        this.terminal.drawText("[" + (this.settings.blickEffect ? "x" : "") + "]", 460, 360, font);
        this.terminal.drawText("...", 460, 440, font);

        this.terminal.drawCursor(this.option, 80);
        
        this.terminal.drawText('1 2 3 4', 900, 280, font);        
        this.terminal.drawText('q w e r', 900, 320, font);        
        this.terminal.drawText('a s d f', 900, 360, font);        
        this.terminal.drawText('z x c v', 900, 400, font);        

        font = '20px Unscreen';
        this.terminal.drawText('--------------', 900, 420, font);       
        this.terminal.drawText('⮬ Control ⮭', 905, 440, font);       
    }
}

export { SettingsState };
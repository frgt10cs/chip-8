import { MessageTypes, StateMessage } from '../stateMessage.js';
import { State } from './state.js';

class MainMenuState extends State {

    constructor(terminal) {
        super();
        this.terminal = terminal;
        this.menuSubStates = ["selectGame", "settings", "about"];
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
        this.option += this.option == 2 ? 0 : 1;
    }

    enterHandler = () => {
        return new StateMessage(MessageTypes.SWITCH_STATE, this.menuSubStates[this.option]);
    }

    escHandler = () => { }

    draw = () => {
        let font = 'bolder 64px Unscreen';
        this.terminal.drawText('CHIP-8 emulator', 80, 120, font);

        font = 'bold 36px Unscreen';
        this.terminal.drawText('Play', 80, 280, font);
        this.terminal.drawText('Settings', 80, 360, font);
        this.terminal.drawText('About', 80, 440, font);

        font = '24px Unscreen';
        this.terminal.drawText('frgt10 (2022)', 1075, 610, font);

        this.terminal.drawCursor(this.option, 80);
    }
}

export { MainMenuState };
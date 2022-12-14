import { MessageTypes, StateMessage } from '../stateMessage.js';
import { State } from './state.js';

class SelectGameState extends State {
    constructor(terminal, games) {
        super();
        this.terminal = terminal;
        this.games = games;
        this.option = 0;
        this.reset();
    }

    getName = () => "selectGame";

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
        this.option += this.option == this.games.length - 1 ? 0 : 1;
    }

    enterHandler = () => {
        // load game message
        reset();
        let arrayBuffer = this.base64ToArrayBuffer(this.games[this.option].game);
        let u8a = new Uint8Array(arrayBuffer);
        let data = Array.from(u8a);
        load_rom(data);
        this.playingState();
    }

    escHandler = () => {
        return new StateMessage(MessageTypes.BACK);
    }

    draw = () => {
        let font = 'bolder 64px Unscreen';
        this.terminal.drawText('Games', 80, 120, font);
        font = 'bold 36px Unscreen';

        for (let i = 0; i < this.games.length; i++) {
            this.terminal.drawText(this.games[i].name, 80, 280 + i * 60, font);
        }

        font = '24px Unscreen';
        this.terminal.drawText('frgt10 (2022)', 1075, 610, font);

        this.terminal.drawCursor(this.option, 60);
    }
}

export { SelectGameState };
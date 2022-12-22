import { MessageTypes, StateMessage } from '../stateMessage.js';
import { State } from './state.js';

class AboutState extends State {
    constructor(terminal, settings) {
        super();
        this.terminal = terminal;                
    }

    getName = () => "about";

    reset = () => { }

    keyDownHandler = (key) => {
        let handleKeyResult = null;
        switch (key) {
            case "Escape":
                handleKeyResult = this.escHandler();
                break;           
        }
        return handleKeyResult;
    }

    keyUpHandler = () => { } 

    escHandler = () => new StateMessage(MessageTypes.BACK);

    draw = () => {
        let font = 'bolder 64px Unscreen';
        this.terminal.drawText('About', 80, 120, font);

        font = 'bold 36px Unscreen';
        this.terminal.drawText('         CHIP-8 is an interpreted programming language,', 80, 220, font);
        this.terminal.drawText('developed by Joseph Weisbecker made on his', 80, 260, font);
        this.terminal.drawText('1802 Microprocessor. It was initially used on the ', 80, 300, font);
        this.terminal.drawText('COSMAC VIP and Telmac 1800 8-bit microcomputers in the ', 80, 340, font);
        this.terminal.drawText('mid-1970s. CHIP-8 programs are run on a CHIP-8 virtual ', 80, 380, font);
        this.terminal.drawText('machine. It was made to allow video games to be more ', 80, 420, font);
        this.terminal.drawText('easily programmed for these computers. The simplicity of ', 80, 460, font);
        this.terminal.drawText('CHIP-8, and its long history and popularity, has ensured', 80, 500, font);
        this.terminal.drawText('that CHIP-8 emulators and programs are still being made ', 80, 540, font);
        this.terminal.drawText('to this day. ', 80, 580, font);                  
    }
}

export { AboutState };
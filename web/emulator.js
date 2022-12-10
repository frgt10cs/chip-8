class Emulator {

    constructor(terminal) {
        this.terminal = terminal;
        this.keyStates = {
            "1": 0, "2": 0, "3": 0, "4": 0,
            "q": 0, "w": 0, "e": 0, "r": 0,
            "a": 0, "s": 0, "d": 0, "f": 0,
            "z": 0, "x": 0, "c": 0, "v": 0,
        };
        this.keyStatesValues = [];
        this.state = "MainMenu";
        this.menuOption = 1;
        this.stateFunction = this.drawMainMenu;
        this.mainCycle = null;
        this.delay = 20;
    }

    onKeyDown(key) {
        switch (key) {
            case "Escape":
                console.log("Escaped");
                stop();
                break;
            case "ArrowDown":
                if (this.state == "MainMenu") {
                    this.menuOption += this.menuOption == 3 ? 0 : 1;
                }
                break;
            case "ArrowUp":
                if (this.state == "MainMenu") {
                    this.menuOption -= this.menuOption == 1 ? 0 : 1;
                }
                break;
            case "Enter":
                if (this.state == "MainMenu") {

                }
                break;
            default:
                if (keyStates[e.key] != undefined) {
                    keyStates[e.key] = 1;
                }
                break;
        }
    }

    onKeyUp(key) {
        if (this.keyStates[key] != undefined) {
            this.keyStates[key] = 0;
        }
    }

    drawMainMenu() {
        this.terminal.clear();
        let font = 'bolder 64px Unscreen';
        this.terminal.drawText('CHIP-8 emulator', 80, 120, font);

        font = 'bold 36px Unscreen';
        this.terminal.drawText('Play', 80, 280, font);
        this.terminal.drawText('Settings', 80, 360, font);
        this.terminal.drawText('About', 80, 440, font);

        font = '24px Unscreen';
        this.terminal.drawText('frgt10 (2022)', 1075, 610, font);        

        this.drawMenuCursor(this.menuOption);
    }

    drawMenuCursor(option) {
        var path = new Path2D();
        path.moveTo(50, 200 + option * 80);
        path.lineTo(50, 170 + option * 80);
        path.lineTo(70, 185 + option * 80);
        this.terminal.drawPath(path);
    }

    run() {
        this.mainCycle = setInterval(() => {
            this.stateFunction();
        }, this.delay);
    }
}

export { Emulator };
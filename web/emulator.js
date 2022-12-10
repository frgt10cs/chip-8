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
        let font = '48px serif';
        this.terminal.drawText('Welcome to frgt10\'s CHIP-8 emulator!', 20, 70, font);

        font = '36px serif';
        this.terminal.drawText('Play', 80, 220, font);
        this.terminal.drawText('Settings', 80, 300, font);
        this.terminal.drawText('About author', 80, 380, font);

        this.drawMenuCursor(this.menuOption);
    }

    drawMenuCursor(option) {
        var path = new Path2D();
        path.moveTo(50, 140 + option * 80);
        path.lineTo(50, 110 + option * 80);
        path.lineTo(70, 125 + option * 80);
        this.terminal.drawPath(path);
    }

    run() {
        this.mainCycle = setInterval(() => {
            this.stateFunction();
        }, this.delay);
    }
}

export { Emulator };
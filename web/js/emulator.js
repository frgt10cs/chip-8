import { load_rom, exec_cycle, get_display_memory, set_keys_states, reset } from "../../pkg/chip8.js";
import { MainMenuState } from "./states/mainMenuState.js";
import { SelectGameState } from "./states/selectGameState.js";
import { SettingsState } from "./states/settingsState.js";
import { DelaySettingsState } from "./states/delaySettingsState.js";
import { MessageTypes, StateMessage } from "./stateMessage.js";
import { DelayMode, Settings, } from './settings.js';

class Emulator {

    constructor(terminal, games) {
        this.terminal = terminal;
        this.keyStates = {
            "1": 0, "2": 0, "3": 0, "4": 0,
            "q": 0, "w": 0, "e": 0, "r": 0,
            "a": 0, "s": 0, "d": 0, "f": 0,
            "z": 0, "x": 0, "c": 0, "v": 0,
        };
        this.keyStatesValues = [];
        this.mainCycle = null;

        this.gameBaseDelayMode = true;
        this.delay = 20;

        this.settings = new Settings(true, true, DelayMode.GAME_BASED, 20);

        this.states = {
            "menu": new MainMenuState(this.terminal),
            "selectGame": new SelectGameState(this.terminal, games),
            "settings": new SettingsState(this.terminal, this.settings),
            "delaySettings": new DelaySettingsState(this.terminal, this.settings.delaySettings)
        }
        this.statesStack = [this.states.menu];
    }

    getState = () => this.statesStack[this.statesStack.length - 1];

    onKeyDown(key) {
        let handleKeyResult = this.getState().keyDownHandler(key);
        if (handleKeyResult != null) {
            switch (handleKeyResult.type) {
                case MessageTypes.SWITCH_STATE:
                    let newState = this.states[handleKeyResult.value];
                    this.statesStack.push(newState);
                    break;
                case MessageTypes.SWITCH_GLITCH:
                    if (this.terminal.glitchEffect) {
                        this.terminal.disableGlitchEffect();
                    }
                    else {
                        this.terminal.enableGlitchEffect();
                    }
                    this.settings.glitchEffect = !this.settings.glitchEffect;
                    break;
                case MessageTypes.SWITCH_BLICK:
                    if (this.terminal.blickEffect) {
                        this.terminal.disableBlickEffect();
                    }
                    else {
                        this.terminal.enableBlickEffect();
                    }
                    this.settings.blickEffect = !this.settings.blickEffect;
                    break;
                case MessageTypes.SWITCH_DELAY_MODE:                    
                    if (this.gameBaseDelayMode) {
                        this.settings.delaySettings.mode = DelayMode.VALUE;
                    }
                    else {
                        this.settings.delaySettings.mode = DelayMode.GAME_BASED;
                    }
                    this.gameBaseDelayMode = !this.gameBaseDelayMode;
                    break;
                case MessageTypes.BACK:
                    this.statesStack.pop();
                    break;
            }
        }
    }

    onKeyUp(key) {
        this.getState().keyUpHandler(key);
        // if (this.keyStates[key] != undefined) {
        //     this.keyStates[key] = 0;
        // }
    }

    // mainMenuCursorMoveUp() {
    //     this.menuOption -= this.menuOption == 0 ? 0 : 1;
    // }

    // mainMenuCursorMoveDown() {
    //     this.menuOption += this.menuOption == 2 ? 0 : 1;
    // }

    // drawMainMenu() {
    //     let font = 'bolder 64px Unscreen';
    //     this.terminal.drawText('CHIP-8 emulator', 80, 120, font);

    //     font = 'bold 36px Unscreen';
    //     this.terminal.drawText('Play', 80, 280, font);
    //     this.terminal.drawText('Settings', 80, 360, font);
    //     this.terminal.drawText('About', 80, 440, font);

    //     font = '24px Unscreen';
    //     this.terminal.drawText('frgt10 (2022)', 1075, 610, font);

    //     this.drawCursor(this.menuOption, 80);
    // }

    // mainMenuEnterHandler() {
    //     this.menuSubStates[this.menuOption].bind(this)();
    // }


    // SELECT GAME

    // selectGameState() {
    //     this.state = "SelectGame";
    //     this.stateFunction = this.drawGamesList;
    //     this.cursorMoveUp = this.selectGameCursorMoveUp;
    //     this.cursorMoveDown = this.selectGameCursorMoveDown;
    //     this.enterHandler = this.selectGameEnterHandler;
    //     this.escHandler = this.selectGameEscHandler;
    // }

    // selectGameCursorMoveUp() {
    //     this.gameOption -= this.gameOption == 0 ? 0 : 1;
    // }

    // selectGameCursorMoveDown() {
    //     this.gameOption += this.gameOption == this.preloadGames.length - 1 ? 0 : 1;
    // }

    // selectGameEnterHandler() {
    //     reset();
    //     let arrayBuffer = this.base64ToArrayBuffer(this.preloadGames[this.gameOption].game);
    //     let u8a = new Uint8Array(arrayBuffer);
    //     let data = Array.from(u8a);
    //     load_rom(data);
    //     this.playingState();
    // }

    // selectGameEscHandler() {
    //     this.mainMenuState();
    // }

    // drawGamesList() {
    //     let font = 'bolder 64px Unscreen';
    //     this.terminal.drawText('Games', 80, 120, font);
    //     font = 'bold 36px Unscreen';

    //     for (let i = 0; i < this.preloadGames.length; i++) {
    //         this.terminal.drawText(this.preloadGames[i].name, 80, 280 + i * 60, font);
    //     }

    //     font = '24px Unscreen';
    //     this.terminal.drawText('frgt10 (2022)', 1075, 610, font);

    //     this.drawCursor(this.gameOption, 60);
    // }


    // SETTINGS

    // settingsState() {
    //     this.state = "Settings";
    //     this.stateFunction = this.drawSettings;
    //     this.cursorMoveUp = this.settingsCursorMoveUp;
    //     this.cursorMoveDown = this.settingsCursorMoveDown;
    //     this.enterHandler = this.settingsEnterHandler;
    //     this.escHandler = this.settingsEscHandler;
    // }

    // settingsCursorMoveUp() {
    //     this.settingsOption -= this.settingsOption == 0 ? 0 : 1;
    // }

    // settingsCursorMoveDown() {
    //     this.settingsOption += this.settingsOption == this.settingsOptions.length - 1 ? 0 : 1;
    // }

    // settingsEscHandler() {
    //     this.mainMenuState();
    // }

    // settingsEnterHandler() {
    //     this.settingsOptions[this.settingsOption].bind(this)();
    // }

    // switchGlitchEffect() {
    //     if (this.terminal.glitchEffect) {
    //         this.terminal.disableGlitchEffect();
    //     }
    //     else {
    //         this.terminal.enableGlitchEffect();
    //     }
    // }

    // switchBlickEffect() {
    //     if (this.terminal.blickEffect) {
    //         this.terminal.disableBlickEffect();
    //     }
    //     else {
    //         this.terminal.enableBlickEffect();
    //     }
    // }

    // drawSettings() {

    //     let font = 'bolder 64px Unscreen';
    //     this.terminal.drawText('Settings', 80, 120, font);

    //     font = 'bold 36px Unscreen';
    //     this.terminal.drawText('Glitch Effect', 80, 280, font);
    //     this.terminal.drawText('Blick', 80, 360, font);
    //     this.terminal.drawText('Delay', 80, 440, font);

    //     this.terminal.drawText("[" + (this.terminal.glitchEffect ? "x" : "") + "]", 460, 280, font);
    //     this.terminal.drawText("[" + (this.terminal.blickEffect ? "x" : "") + "]", 460, 360, font);
    //     this.terminal.drawText(this.gameBaseDelayMode ? "Game based" : this.delay, 460, 440, font);

    //     this.drawCursor(this.settingsOption, 80);
    // }

    // DELAY SETTING

    // changeDelayState() {
    //     this.state = "Delay settings";
    //     this.stateFunction = this.drawDelaySettings;
    //     this.cursorMoveUp = this.delaySettingsCursorMoveUp;
    //     this.cursorMoveDown = this.delaySettingsCursorMoveDown;
    //     this.enterHandler = this.delaySettingsEnterHandler;
    //     this.escHandler = this.delaySettingsEscHandler;
    // }

    // delaySettingsCursorMoveUp() {
    //     this.delaySettingsOption -= this.delaySettingsOption == 0 ? 0 : 1;
    // }

    // delaySettingsCursorMoveDown() {
    //     let len = this.gameBaseDelayMode ? 0 : 1;
    //     this.settingsOption += this.settingsOption == len ? 0 : 1;
    // }

    // delaySettingsEnterHandler() {

    // }

    // delaySettingsEscHandler() {
    //     this.mainMenuState();
    // }

    // drawDelaySettings() {

    //     let font = 'bolder 64px Unscreen';
    //     this.terminal.drawText('Settings > Delay', 80, 120, font);

    //     font = 'bold 36px Unscreen';
    //     this.terminal.drawText('Mode', 80, 280, font);
    //     this.terminal.drawText('Value', 80, 360, font);

    //     this.terminal.drawText(this.gameBaseDelayMode ? "Game based" : "Value", 460, 280, font);
    //     this.terminal.drawText(this.delay, 460, 360, font);

    //     this.drawCursor(this.delaySettingsOption, 80);
    // }

    // PLAYING

    playingState() {
        this.state = "Playing";
        this.stateFunction = this.gameCycle;
        this.escHandler = this.playingEscHandler;
    }

    gameCycle() {
        set_keys_states(Object.values(this.keyStates));
        exec_cycle();
        this.terminal.draw(get_display_memory());
    }

    base64ToArrayBuffer(base64) {
        var binary_string = window.atob(base64);
        var len = binary_string.length;
        var bytes = new Uint8Array(len);
        for (var i = 0; i < len; i++) {
            bytes[i] = binary_string.charCodeAt(i);
        }
        return bytes.buffer;
    }

    playingEscHandler() {
        this.selectGameState();
    }


    // MAIN CYCLE

    run() {
        this.mainCycle = setInterval(() => {
            this.terminal.clear();
            this.getState().draw();
        }, this.delay);
    }
}

export { Emulator };
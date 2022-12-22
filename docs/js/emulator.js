import { MainMenuState } from "./states/mainMenuState.js";
import { SelectGameState } from "./states/selectGameState.js";
import { SettingsState } from "./states/settingsState.js";
import { DelaySettingsState } from "./states/delaySettingsState.js";
import { MessageTypes, StateMessage } from "./stateMessage.js";
import { DelayMode, Settings, } from './settings.js';
import { EditDelayValueState } from './states/editDelayValueState.js';
import { PlayState } from "./states/playState.js";
import { PauseState } from './states/pauseState.js';
import { load_rom, reset } from "../pkg/chip8.js";
import {AboutState} from './states/aboutState.js';

class Emulator {

    constructor(terminal, games) {
        this.terminal = terminal;
        this.games = games;
        this.currentGame = null;
        this.mainCycle = null;
        
        this.settings = new Settings(true, true, DelayMode.GAME_BASED, 20);
        this.gameBaseDelayMode = true;
        this.delay = 20;
        this.menuDelay = 20;

        this.states = [
            new MainMenuState(this.terminal),
            new SelectGameState(this.terminal, games),
            new SettingsState(this.terminal, this.settings),
            new DelaySettingsState(this.terminal, this.settings.delaySettings),
            new AboutState(this.terminal),
            new EditDelayValueState(this.terminal, this.settings.delaySettings),
            new PlayState(this.terminal),
            new PauseState(this.terminal)
        ]
        this.statesStack = [this.getStateByName("menu")];
    }

    getState = () => this.statesStack[this.statesStack.length - 1];

    getStateByName = (name) => this.states.find(state => state.getName() == name);

    getDelay = () => {
        if (this.getState().getName() == "play") {
            if (this.settings.delaySettings.mode == DelayMode.GAME_BASED) {
                return this.currentGame.delay;
            }
            else {
                return this.delay;
            }
        }
        else {
            return this.menuDelay;
        }
    }

    onKeyDown = (key) => {
        let handleKeyResult = this.getState().keyDownHandler(key);
        if (handleKeyResult != null) {
            switch (handleKeyResult.type) {
                case MessageTypes.SWITCH_STATE:
                    let newState = this.getStateByName(handleKeyResult.value);
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
                case MessageTypes.SET_DELAY_VALUE:
                    this.delay =  handleKeyResult.value;
                    this.settings.delaySettings.value = handleKeyResult.value;
                    break;
                case MessageTypes.RUN_GAME:
                    reset();
                    this.currentGame = this.games[handleKeyResult.value];
                    let arrayBuffer = this.base64ToArrayBuffer(this.currentGame.game);
                    let u8a = new Uint8Array(arrayBuffer);
                    let data = Array.from(u8a);
                    load_rom(data);                    
                    this.statesStack.push(this.getStateByName("play"));                 
                    this.restart();
                    break;
                case MessageTypes.ESCAPE_FROM_GAME:
                    this.statesStack.pop();
                    this.statesStack.pop();
                    break;
                case MessageTypes.BACK:
                    this.statesStack.pop();
                    break;
            }
        }
    }

    onKeyUp = (key) => {
        this.getState().keyUpHandler(key);
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

    run = () => {
        this.mainCycle = setInterval(() => {
            this.terminal.clear();
            this.getState().draw();
        }, this.getDelay());
    }

    restart = () => {
        clearInterval(this.mainCycle);
        this.run();
    }
}

export { Emulator };
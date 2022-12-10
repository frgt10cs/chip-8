import init, { load_rom, exec_cycle, get_display_memory, get_memory, get_current_opcode, reset, set_keys_states } from '../pkg/chip8.js';
import { glitch } from './glitch.js';
import { Terminal } from './terminal.js';
import { Emulator } from './emulator.js';

await init();


let state = "MainMenu";


const gameSelector = document.getElementById("game_selector");
const runGameBtn = document.getElementById("run_game");

const canvas = document.getElementById('terminal');

const terminal = new Terminal(canvas, "rgb(30, 109, 47)", 20);
terminal.clear();

const emulator = new Emulator(terminal);
emulator.run();

document.onkeyup = function (e) {
  emulator.onKeyUp(e.key);
}

document.onkeydown = function (e) {  
  emulator.onKeyDown(e.key);  
}

// const stop = () => {
//   if (mainCycle != null) {
//     clearInterval(mainCycle);
//     console.log("Main interval has been cleared");
//   }
// }

// const resetAll = () => {
//   stop();
//   reset();
// }

// runGameBtn.onclick = async function () {
//   resetAll();
//   let romName = gameSelector.value;
//   let response = await fetch(romName);
//   if (response.ok) {
//     let arrayBuffer = await response.arrayBuffer();
//     let u8a = new Uint8Array(arrayBuffer);
//     let data = Array.from(u8a);
//     console.log(u8a);
//     console.log(data);
//     console.log("loaded: " + data.length + " bytes");



//     try {
//       load_rom(data);
//     }
//     catch (ex) {
//       console.error(ex);
//     }

//     let display_memory = null;

//     mainCycle = setInterval(() => {
//       keyStatesValues = Object.values(keyStates);
//       set_keys_states(keyStatesValues);
//       exec_cycle();
//       display_memory = get_display_memory();
//       terminal.draw(display_memory);

//     }, delay);
//   }
//   else {

//   }
// }

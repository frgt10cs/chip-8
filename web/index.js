import init, { load_rom, exec_cycle, get_display_memory, get_memory, get_current_opcode, reset, set_keys_states } from '../pkg/chip8.js';
import { glitch } from './glitch.js';

await init();

const gameSelector = document.getElementById("game_selector");
const runGameBtn = document.getElementById("run_game");

const canvas = document.getElementById('terminal');
const ctx = canvas.getContext('2d');

let mainCycle = null;
let delay = 20;

let keyStates = {
  "1": 0, "2": 0, "3": 0, "4": 0,
  "q": 0, "w": 0, "e": 0, "r": 0,
  "a": 0, "s": 0, "d": 0, "f": 0,
  "z": 0, "x": 0, "c": 0, "v": 0,
};

let keyStatesValues = [];

document.onkeyup = function (e) {
  if (keyStates[e.key] != undefined) {
    keyStates[e.key] = 0;
  }
}

document.onkeydown = function (e) {
  switch (e.key) {
    case "Escape":
      console.log("Escaped");
      stop();
      break;
    // more funcational keys
    case "":
      break;
    default:
      if (keyStates[e.key] != undefined) {
        keyStates[e.key] = 1;
      }
      break;
  }
}

const stop = () => {
  if (mainCycle != null) {
    clearInterval(mainCycle);
    console.log("Main interval has been cleared");
  }
}

const resetAll = () => {
  stop();
  reset();
}

runGameBtn.onclick = async function () {
  resetAll();
  let romName = gameSelector.value;
  let response = await fetch(romName);
  if (response.ok) {
    let arrayBuffer = await response.arrayBuffer();
    let u8a = new Uint8Array(arrayBuffer);
    let data = Array.from(u8a);
    console.log(u8a);
    console.log(data);
    console.log("loaded: " + data.length + " bytes");

    ctx.font = '48px serif';
    ctx.fillText('Welcome to vand0s\'s CHIP-8 emulator!', 20, 70);

    ctx.font = '24px serif';
    ctx.fillText('Loading ROM...', 20, 120);

    try {
      load_rom(data);
    }
    catch (ex) {
      console.error(ex);
    }

    let display_memory = null;

    mainCycle = setInterval(() => {
      keyStatesValues = Object.values(keyStates);
      set_keys_states(keyStatesValues);
      exec_cycle();
      display_memory = get_display_memory();

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      ctx.fillStyle = "rgb(30, 109, 47)";
      for (let y = 0; y < 32; y++) {
        for (let x = 0; x < 64; x++) {
          if (display_memory[y * 64 + x] != 0) {
            ctx.fillStyle = "rgb(30, 109, 47)";
            ctx.fillRect(x * 20, y * 20, 20, 20);
          }
        }
      }
    }, delay);
  }
  else {

  }
}

glitch(canvas, ctx);
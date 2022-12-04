import init, { load_rom, exec_cycle, get_display_memory, get_memory, get_current_opcode } from '../pkg/chip8.js';

await init();

const gameSelector = document.getElementById("game_selector");
const runGameBtn = document.getElementById("run_game");

const canvas = document.getElementById('terminal');
const ctx = canvas.getContext('2d');

let mainCycle = null;

function handleKey(e) {
  console.log("Handling key: " + e.code);
  if (e.code == "KeyE") {
    if (mainCycle != null) {
      console.log("Stopped");
      clearInterval(mainCycle);
    }
  }
}

document.addEventListener('keydown', handleKey, false);


runGameBtn.onclick = async function () {
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
    let delay = 0;
    let prevTime = new Date();
    let curTime = null;
    let timeDiff = null;            

    mainCycle = setInterval(() => {
      exec_cycle();      
      // console.log("[" + it + "] " + get_current_opcode());
      display_memory = get_display_memory();            

      // it doesn't work
      // ctx.clearRect(0, 0, canvas.width, canvas.height);          

      ctx.fillStyle = "rgb(30, 109, 47)";
      for (let y = 0; y < 32; y++) {
        for (let x = 0; x < 64; x++) {
          if (display_memory[y * 64 + x] != 0) {      
            ctx.fillStyle = "rgb(30, 109, 47)";      
            ctx.fillRect(x*20, y*20, (x + 1)*20, (y + 1)*20);            
          }
          else{
            ctx.fillStyle = "rgb(0, 0, 0)";      
            ctx.fillRect(x*20, y*20, (x + 1)*20, (y + 1)*20);
          }
        }        
      }           
    }, delay);
  }
  else {

  }
}

function draw(x1, y1, x2, y2) {
  ctx.fillStyle = "rgb(30, 109, 47)";
  ctx.fillRect(x1 * 20, y1 * 20, x2 * 20, y2 * 20);
}

draw(63, 31, 64, 32);

draw(0, 0, 1, 1);
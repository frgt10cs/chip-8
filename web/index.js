import init, { init_cpu, run_rom, get_display_memory } from '../pkg/chip8.js';

await init();

const gameSelector = document.getElementById("game_selector");
const runGameBtn = document.getElementById("run_game");

const canvas = document.getElementById('terminal');
const ctx = canvas.getContext('2d');


runGameBtn.onclick = async function () {
  let cpu = init_cpu();
  console.log(cpu);
  console.log(cpu.get_display_memory());
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

    run_rom(data);    
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
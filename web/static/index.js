import init from "./wasm/chip8.js";

 
const runWasm = async () => {

 

  const chip8_wasm = await init("./wasm/chip8_bg.wasm");
  chip8_wasm.ping();
  console.log(chip8_wasm.ping_calc(20, 30));
 

};

runWasm();

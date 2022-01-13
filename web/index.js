import init from "./wasm/chip8.js";

 

const runWasm = async () => {

 

  const chip8_wasm = await init("./wasm/chip8_bg.wasm");
  chip8_wasm.ping();
  console.log(chip8_wasm.ping_calc(20, 30));

 

//  const Result_1 = helloWorld.call_me_from_javascript(9, 2);

      

  //const Result_2 = helloWorld.alert_window();

  

  //var div_1 = document.getElementById("1");

 

//  div_1.textContent = Result_1;


 

};

runWasm();

pub mod chip8;
use chip8::cpu::CPU;
use wasm_bindgen::prelude::*;

static mut CPU: CPU = CPU::default();

// Called when the wasm module is instantiated
#[wasm_bindgen(start)]
pub fn main() -> Result<(), JsValue> {
    // let window = web_sys::window().expect("no global `window` exists");
    // let document = window.document().expect("should have a document on window");
    // let body = document.body().expect("document should have a body");

    // let val = document.create_element("p")?;
    // val.set_inner_html("Hello from Rust!");

    // body.append_child(&val)?;

    Ok(())
}

#[wasm_bindgen]
pub fn load_rom(data: &[u8]) {
    // let window = web_sys::window().expect("no global `window` exists");
    // let document = window.document().expect("should have a document on window");
    // let body = document.body().expect("document should have a body");

    // let val = document.create_element("p").unwrap();
    // val.set_inner_html(&format!(
    //     "{}: {:?}",
    //     data.len(),
    //     data.iter()
    //         .map(|d| format!("{}", d))
    //         .collect::<Vec<String>>()
    //         .join(", ")
    // ));

    // body.append_child(&val);
    unsafe {
        CPU.reset();
        CPU.load_instructions(data.to_vec());
    }
}

#[wasm_bindgen]
pub fn exec_cycle() {
    unsafe {
        CPU.exec_cycle();
    }
}

#[wasm_bindgen]
pub fn get_display_memory() -> Box<[u32]> {
    unsafe { Box::new(CPU.get_display_memory()) }
}

#[wasm_bindgen]
pub fn get_memory() -> Box<[u8]> {
    unsafe { Box::new(CPU.get_memory()) }
}

#[wasm_bindgen]
pub fn get_current_opcode() -> String {
    unsafe {
        let opcode = CPU.get_current_opcode();
        format!(
            "{}: {}, {}, {}, {}",
            opcode.opcode, opcode.op_1, opcode.op_2, opcode.op_3, opcode.op_4
        )
    }
}

#[wasm_bindgen]
pub fn reset() {
    unsafe {
        CPU.reset();
    }
}

#[wasm_bindgen]
pub fn set_keys_states(data: &[u8]) {
    unsafe {
        CPU.set_keys_states(data);
    }
}

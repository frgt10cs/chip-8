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
pub fn run_rom(data: &mut [u8]) {
    let window = web_sys::window().expect("no global `window` exists");
    let document = window.document().expect("should have a document on window");
    let body = document.body().expect("document should have a body");

    let val = document.create_element("p").unwrap();
    val.set_inner_html(&format!(
        "{}: {:?}",
        data.len(),
        data.iter()
            .map(|d| format!("{}", d))
            .collect::<Vec<String>>()
            .join(", ")
    ));

    body.append_child(&val);
    unsafe {
        CPU.load_instructions(data.to_vec());
        CPU.start_execute_instructions();
    }
}

#[wasm_bindgen]
pub fn get_display_memory() {}

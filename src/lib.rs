pub mod chip8;
use crate::chip8::{cpu::CPU, memory::Memory};


#[no_mangle]
pub fn init(){
    let mut cpu = CPU::default();    
}
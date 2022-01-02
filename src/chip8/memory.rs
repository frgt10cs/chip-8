
pub const SCREEN_WIDTH: usize = 64;
pub const SCREEN_HEIGHT: usize = 32;

pub struct Memory{    
    pub cells: [u8; 4096],
    pub stack: [u16; 16],
    pub display: [u32; SCREEN_WIDTH*SCREEN_HEIGHT]
}

impl Default for Memory{
    
fn default() -> Self { 
    Memory{
        cells:[0; 4096],
        stack:[0; 16],
        display: [0; SCREEN_WIDTH*SCREEN_HEIGHT]
    }
 }
}
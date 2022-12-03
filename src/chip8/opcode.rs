#[derive(Default)]
pub struct Opcode {
    pub opcode: u16,
    pub op_1: u8,
    pub op_2: u8,
    pub op_3: u8,
    pub op_4: u8,
}

impl Opcode {   

    pub const fn default() -> Opcode{
        Opcode{
            opcode: 0,
            op_1: 0,
            op_2: 0,
            op_3: 0,
            op_4: 0,
        }
    }

    pub fn set(&mut self, opcode: u16) {
        self.opcode = opcode;

        self.op_1 = (opcode & 0xF000 >> 12) as u8;
        self.op_2 = (opcode & 0x0F00 >> 8) as u8;
        self.op_3 = (opcode & 0x00F0 >> 4) as u8;
        self.op_4 = (opcode & 0x000F) as u8;
    }    
}
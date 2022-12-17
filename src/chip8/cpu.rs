use crate::chip8::opcode::Opcode;
use crate::chip8::memory::*;
use rand::Rng;

const START_PC: u16 = 0x200;
const START_FONT: u16 = 0x050;

const FONT_SIZE: usize = 80;

const FONT_SET: [u8; FONT_SIZE] = [
    0xF0, 0x90, 0x90, 0x90, 0xF0, // 0
    0x20, 0x60, 0x20, 0x20, 0x70, // 1
    0xF0, 0x10, 0xF0, 0x80, 0xF0, // 2
    0xF0, 0x10, 0xF0, 0x10, 0xF0, // 3
    0x90, 0x90, 0xF0, 0x10, 0x10, // 4
    0xF0, 0x80, 0xF0, 0x10, 0xF0, // 5
    0xF0, 0x80, 0xF0, 0x90, 0xF0, // 6
    0xF0, 0x10, 0x20, 0x40, 0x40, // 7
    0xF0, 0x90, 0xF0, 0x90, 0xF0, // 8
    0xF0, 0x90, 0xF0, 0x10, 0xF0, // 9
    0xF0, 0x90, 0xF0, 0x90, 0x90, // A
    0xE0, 0x90, 0xE0, 0x90, 0xE0, // B
    0xF0, 0x80, 0x80, 0x80, 0xF0, // C
    0xE0, 0x90, 0x90, 0x90, 0xE0, // D
    0xF0, 0x80, 0xF0, 0x80, 0xF0, // E
    0xF0, 0x80, 0xF0, 0x80, 0x80, // F
];

pub struct CPU {
    registers: [u8; 16],
    /// Index Register
    ir: u16,
    /// Programm Counter
    pc: u16,
    /// Stack Pointer
    sp: usize,
    /// Delay Timer
    dt: u8,
    /// Sound Timer
    st: u8,
    current_opcode: Opcode,
    // keys: [Key; 16],
    keys_states: [u8; 16],
    instructions_count: u16,
    memory: Memory,
}

impl CPU {
    pub const fn default() -> Self {
        CPU {
            registers: [0; 16],
            ir: 0,
            pc: START_PC,
            sp: 0,
            dt: 0,
            st: 0,
            current_opcode: Opcode::default(),
            keys_states: [0; 16],
            instructions_count: 0,
            memory: Memory::default(),
        }
    }

    fn get_random_byte() -> u8 {
        let mut rng = rand::thread_rng();
        rng.gen_range(0..=255)
    }

    pub fn reset(&mut self) {
        self.ir = 0;
        self.pc = START_PC;
        self.sp = 0;
        self.dt = 0;
        self.st = 0;
        self.current_opcode = Opcode::default();
        self.keys_states = [0; 16];
        self.instructions_count = 0;
        self.memory = Memory::default();
        for i in 0..FONT_SIZE {
            self.memory.cells[START_FONT as usize + i] = FONT_SET[i];
        }
    }

    pub fn load_instructions(&mut self, bytes: Vec<u8>) {
        for i in 0..bytes.len() {
            self.memory.cells[START_PC as usize + i] = bytes[i];
        }
        self.instructions_count = (bytes.len() / 2) as u16;
    }

    pub fn get_display_memory(&self) -> [u32; 2048] {
        self.memory.display
    }

    pub fn get_memory(&self) -> [u8; 4096] {
        self.memory.cells
    }

    pub fn get_current_opcode(&mut self) -> Opcode {
        self.current_opcode
    }

    pub fn get_pc(&self) -> u16 {
        self.pc
    }

    pub fn set_keys_states(&mut self, states: &[u8]) {
        if states.len() == 16 {
            self.keys_states.copy_from_slice(states);
        } else {
            // TODO: handle
        }
    }

    pub fn exec_cycle(&mut self) {
        self.current_opcode.set(
            (self.memory.cells[self.pc as usize] as u16) << 8
                | self.memory.cells[self.pc as usize + 1] as u16,
        );
        self.exec_cur_op();
    }

    fn exec_cur_op(&mut self) {
        self.pc += 2;
        match (
            self.current_opcode.op_1,
            self.current_opcode.op_2,
            self.current_opcode.op_3,
            self.current_opcode.op_4,
        ) {
            (0x0, _, 0xE, 0x0) => {
                self.op_00E0();
            }
            (0x0, _, 0xE, 0xE) => {
                self.op_00EE();
            }
            (0x1, _, _, _) => {
                self.op_1nnn();
            }
            (0x2, _, _, _) => {
                self.op_2nnn();
            }
            (0x3, _, _, _) => {
                self.op_3xkk();
            }
            (0x4, _, _, _) => {
                self.op_4xkk();
            }
            (0x5, _, _, _) => {
                self.op_5xy0();
            }
            (0x6, _, _, _) => {
                self.op_6xkk();
            }
            (0x7, _, _, _) => {
                self.op_7xkk();
            }
            (0x8, _, _, 0x0) => {
                self.op_8xy0();
            }
            (0x8, _, _, 0x1) => {
                self.op_8xy1();
            }
            (0x8, _, _, 0x2) => {
                self.op_8xy2();
            }
            (0x8, _, _, 0x3) => {
                self.op_8xy3();
            }
            (0x8, _, _, 0x4) => {
                self.op_8xy4();
            }
            (0x8, _, _, 0x5) => {
                self.op_8xy5();
            }
            (0x8, _, _, 0x6) => {
                self.op_8xy6();
            }
            (0x8, _, _, 0x7) => {
                self.op_8xy7();
            }
            (0x8, _, _, 0xE) => {
                self.op_8xyE();
            }
            (0x9, _, _, _) => {
                self.op_9xy0();
            }
            (0xA, _, _, _) => {
                self.op_Annn();
            }
            (0xB, _, _, _) => {
                self.op_Bnnn();
            }
            (0xC, _, _, _) => {
                self.op_Cxkk();
            }
            (0xD, _, _, _) => {
                self.op_Dxyn();
            }
            (0xE, _, 0xA, 0x1) => {
                self.op_ExA1();
            }
            (0xE, _, 0x9, 0xE) => {
                self.op_Ex9E();
            }
            (0xF, _, 0x0, 0x7) => {
                self.op_Fx07();
            }
            (0xF, _, 0x0, 0xA) => {
                self.op_Fx0A();
            }
            (0xF, _, 0x1, 0x5) => {
                self.op_Fx15();
            }
            (0xF, _, 0x1, 0x8) => {
                self.op_Fx18();
            }
            (0xF, _, 0x1, 0xE) => {
                self.op_Fx1E();
            }
            (0xF, _, 0x2, 0x9) => {
                self.op_Fx29();
            }
            (0xF, _, 0x3, 0x3) => {
                self.op_Fx33();
            }
            (0xF, _, 0x5, 0x5) => {
                self.op_Fx55();
            }
            (0xF, _, 0x6, 0x5) => {
                self.op_Fx65();
            }
            value => {
                panic!("{}", format!("Unknown opcode: {:?}", value));
            }
        }

        if self.dt > 0 {
            self.dt -= 1;
        }

        if self.st > 0 {
            self.st -= 1;
        }
    }
}

// CHIP-8 Operations
impl CPU {
    /// `CLS`
    /// Clear The Display
    ///
    fn op_00E0(&mut self) {
        self.memory.display.fill(0);
    }

    /// `RET`
    /// Return from a subroutine
    ///
    fn op_00EE(&mut self) {
        self.sp -= 1;
        self.pc = self.memory.stack[self.sp];
    }

    /// `JP`
    /// Jump to location
    ///
    fn op_1nnn(&mut self) {
        let addr = self.current_opcode.opcode & 0x0FFF;
        self.pc = addr;
    }

    /// `CALL`
    /// Call subroutine at address
    ///
    fn op_2nnn(&mut self) {
        let addr = self.current_opcode.opcode & 0x0FFF;
        self.memory.stack[self.sp] = self.pc;
        self.sp += 1;
        self.pc = addr;
    }

    /// 'SE Vx, byte'
    /// Skip next instruction if Vx = kk
    ///
    fn op_3xkk(&mut self) {
        let vx = self.current_opcode.op_2 as usize;
        let byte = (self.current_opcode.opcode & 0x00FF) as u8;
        if self.registers[vx] == byte {
            self.pc += 2;
        }
    }

    /// 'SNE Vx, byte'
    /// Skip next instruction if Vx = kk
    ///
    fn op_4xkk(&mut self) {
        let vx = self.current_opcode.op_2 as usize;
        let byte = (self.current_opcode.opcode & 0x00FF) as u8;
        if self.registers[vx] != byte {
            self.pc += 2;
        }
    }

    /// `SE Vx, Vy`
    /// Skip next instruction if Vx = Vy
    ///
    fn op_5xy0(&mut self) {
        let vx = self.current_opcode.op_2 as usize;
        let vy = self.current_opcode.op_3 as usize;
        if self.registers[vx] == self.registers[vy] {
            self.pc += 2;
        }
    }

    /// `LD Vx, byte`
    /// Set Vx = byte
    ///
    fn op_6xkk(&mut self) {
        let vx = self.current_opcode.op_2 as usize;
        let byte = (self.current_opcode.opcode & 0x00FF) as u8;
        self.registers[vx] = byte;
    }

    /// `ADD Vx, byte`
    /// Set Vx = VX + byte
    ///
    fn op_7xkk(&mut self) {
        let vx = self.current_opcode.op_2 as usize;
        let byte = (self.current_opcode.opcode & 0x00FF) as u8;
        self.registers[vx] += byte;
    }

    /// `LD Vx, byte`
    /// Set Vx = Vy
    ///
    fn op_8xy0(&mut self) {
        let vx = self.current_opcode.op_2 as usize;
        let vy = self.current_opcode.op_3 as usize;
        self.registers[vx] = self.registers[vy];
    }

    /// `OR Vx, Vy`
    /// Set Vx = Vx OR Vy
    ///
    fn op_8xy1(&mut self) {
        let vx = self.current_opcode.op_2 as usize;
        let vy = self.current_opcode.op_3 as usize;
        self.registers[vx] |= self.registers[vy];
    }

    /// `AND Vx, Vy`
    /// Set Vx = Vx AND Vy
    ///
    fn op_8xy2(&mut self) {
        let vx = self.current_opcode.op_2 as usize;
        let vy = self.current_opcode.op_3 as usize;
        self.registers[vx] &= self.registers[vy];
    }

    /// XOR Vx, Vy
    /// Set Vx = Vx XOR Vy
    ///
    fn op_8xy3(&mut self) {
        let vx = self.current_opcode.op_2 as usize;
        let vy = self.current_opcode.op_3 as usize;
        self.registers[vx] ^= self.registers[vy];
    }

    /// `ADD Vx, Vy`
    /// Set Vx = Vx + Vy, VF = 1 if overflow and Vx = lowest bits of result
    ///
    fn op_8xy4(&mut self) {
        let vx = self.current_opcode.op_2 as usize;
        let vy = self.current_opcode.op_3 as usize;
        let result: u16 = (self.registers[vx] + self.registers[vy]) as u16;
        self.registers[0xF] = if result > 255 { 1 } else { 0 };
        self.registers[vx] = (result & 0xFF) as u8;
    }

    /// `SUB Vx, Vy`
    /// If Vx > Vy set VF = 1. Set Vx = Vx - Vy
    ///
    fn op_8xy5(&mut self) {
        let vx = self.current_opcode.op_2 as usize;
        let vy = self.current_opcode.op_3 as usize;
        self.registers[0xF] = if vx > vy { 1 } else { 0 };
        self.registers[vx] -= self.registers[vy];
    }

    /// `SHR Vx`
    /// Right shift + set bit to VF
    ///
    fn op_8xy6(&mut self) {
        let vx = self.current_opcode.op_2 as usize;
        self.registers[0xF] = self.registers[vx] & 0x1;
        self.registers[vx] >>= 1;
    }

    /// `SUBN Vx, Vy`
    /// If Vy > Vx set VF = 1. Set Vx = Vy - Vx
    ///
    fn op_8xy7(&mut self) {
        let vx = self.current_opcode.op_2 as usize;
        let vy = self.current_opcode.op_3 as usize;
        self.registers[0xF] = if vy > vx { 1 } else { 0 };
        self.registers[vx] = self.registers[vy] - self.registers[vx];
    }

    /// `SHL Vx`
    /// Left shift + set bit to VF
    ///     
    fn op_8xyE(&mut self) {
        let vx = self.current_opcode.op_2 as usize;
        self.registers[0xF] = self.registers[vx] & 0x80;
        self.registers[vx] <<= 1;
    }

    /// `SNE Vx, Vy`
    /// Skip instruction if Vx != Vy
    ///
    fn op_9xy0(&mut self) {
        let vx = self.current_opcode.op_2 as usize;
        let vy = self.current_opcode.op_3 as usize;
        if self.registers[vx] != self.registers[vy] {
            self.pc += 2;
        }
    }

    /// `LD I, addr`
    /// Set I = addr (nnn)
    ///
    fn op_Annn(&mut self) {
        let addr = self.current_opcode.opcode & 0x0FFF;
        self.ir = addr;
    }

    /// `JP V0, addr`
    /// Jumo to location addr (nnn) + V0
    ///
    fn op_Bnnn(&mut self) {
        let addr = self.current_opcode.opcode & 0x0FFF;
        self.pc = addr + self.registers[0] as u16;
    }

    /// `RND Vx, byte`
    /// Set Vx = random byte AND byte (kk)
    ///
    fn op_Cxkk(&mut self) {
        let vx = self.current_opcode.op_2 as usize;
        let byte = (self.current_opcode.opcode & 0x00FF) as u8;
        self.registers[vx] = CPU::get_random_byte() & byte;
    }

    /// `DRW Vx, Vy, nibble`
    /// Display n-bite sprite starting at memory location I at (Vx, Vy), set VF = collision
    ///
    fn op_Dxyn(&mut self) {
        let vx = self.current_opcode.op_2 as usize;
        let vy = self.current_opcode.op_3 as usize;
        let n = self.current_opcode.op_4 as usize;

        let mut erased = false;

        let x_pos = self.registers[vx] as usize % SCREEN_WIDTH;
        let y_pos = self.registers[vy] as usize % SCREEN_HEIGHT;

        self.registers[0xF] = 0;

        for y in 0..n {
            let current_y = (y_pos + y) % SCREEN_HEIGHT;
            let sprite_byte = self.memory.cells[self.ir as usize + y];
            for x in 0..8 as usize {
                let current_x = (x_pos + x) % SCREEN_WIDTH;
                let pixel_value = sprite_byte & (0x80 >> x);
                if pixel_value != 0 {
                    if self.memory.display[current_y * SCREEN_WIDTH + current_x] == 0xFFFFFFFF {
                        erased = true;
                    }
                    self.memory.display[current_y * SCREEN_WIDTH + current_x] ^= 0xFFFFFFFF;
                }
            }
        }

        self.registers[0xF] = if erased { 1 } else { 0 };
    }

    /// `SKP Vx`
    /// Skip next instruction if key with value of Vx is pressed
    ///
    fn op_Ex9E(&mut self) {
        let vx = self.current_opcode.op_2 as usize;
        let key = self.registers[vx] as usize;
        if self.keys_states[key] == 1 {
            self.pc += 2;
        }
    }

    /// `SKNP Vx`
    /// Skip next instruction if key with value of Vx is not pressed
    ///
    fn op_ExA1(&mut self) {
        let vx = self.current_opcode.op_2 as usize;
        let key = self.registers[vx] as usize;
        if self.keys_states[key] == 0 {
            self.pc += 2;
        }
    }

    /// `LD Vx, DT`
    /// Set Vx = delay timer value
    ///
    fn op_Fx07(&mut self) {
        let vx = self.current_opcode.op_2 as usize;
        self.registers[vx] = self.dt;
    }

    /// 'LD Vx, K'
    /// Wait for a key press, store the value of the key in Vx
    ///
    fn op_Fx0A(&mut self) {
        let vx = self.current_opcode.op_2 as usize;
        'ext: loop {
            for i in 0..self.keys_states.len() {
                if self.keys_states[i] == 1 {
                    self.registers[vx] = i as u8;
                    break 'ext;
                }
            }
        }
    }

    /// `LD DT, Vx`
    /// Set delay timer = Vx
    ///
    fn op_Fx15(&mut self) {
        let vx = self.current_opcode.op_2 as usize;
        self.dt = self.registers[vx];
    }

    /// `LD ST, Vx`
    /// Set delay timer = Vx
    ///
    fn op_Fx18(&mut self) {
        let vx = self.current_opcode.op_2 as usize;
        self.st = self.registers[vx];
    }

    /// `ADD I, Vx`
    /// Set I = I + Vx
    ///
    fn op_Fx1E(&mut self) {
        let vx = self.current_opcode.op_2 as usize;
        self.ir += self.registers[vx] as u16;
    }

    /// `LD F, Vx`
    /// Set I = location of sprite for digit Vx
    ///
    fn op_Fx29(&mut self) {
        let vx = self.current_opcode.op_2 as usize;
        let addr = START_FONT + 5 * self.registers[vx] as u16;
        self.ir = addr;
    }

    /// `LD B, Vx`
    /// Store BSD represenation of Vx in memory location I, I+1, I+2
    ///
    fn op_Fx33(&mut self) {
        let vx = self.current_opcode.op_2 as usize;
        let mut value = self.registers[vx];
        self.memory.cells[self.ir as usize + 2] = value % 10;
        value /= 10;
        self.memory.cells[self.ir as usize + 1] = value % 10;
        value /= 10;
        self.memory.cells[self.ir as usize] = value % 10;
    }

    /// `LD [I], Vx`
    /// Store registers V0 through Vx in memory starting at location I
    ///
    fn op_Fx55(&mut self) {
        let vx = self.current_opcode.op_2 as usize;
        for i in 0..=vx as usize {
            self.memory.cells[self.ir as usize + i] = self.registers[i];
        }
    }

    /// `LD Vx, [I]`
    /// Read registers V0 through Vx from memory starting at location I.
    ///
    fn op_Fx65(&mut self) {
        let vx = self.current_opcode.op_2 as usize;
        for i in 0..=vx as usize {
            self.registers[i] = self.memory.cells[self.ir as usize + i];
        }
    }
}

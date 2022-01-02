use crate::chip8::{key::Key, memory::*};
use rand::Rng;
use std::collections::HashMap;

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
    keys: [Key; 16],
    key_states: [bool; 16],
    memory: Memory,
}

impl Default for CPU {
    fn default() -> Self {
        let mut cpu = CPU {
            registers: [0; 16],
            ir: 0,
            pc: START_PC,
            sp: 0,
            dt: 0,
            st: 0,
            keys: [
                Key::new('1', '1'),
                Key::new('2', '2'),
                Key::new('3', '3'),
                Key::new('C', '4'),
                Key::new('4', 'Q'),
                Key::new('5', 'W'),
                Key::new('6', 'E'),
                Key::new('D', 'R'),
                Key::new('7', 'A'),
                Key::new('8', 'S'),
                Key::new('9', 'D'),
                Key::new('E', 'F'),
                Key::new('A', 'Z'),
                Key::new('0', 'X'),
                Key::new('B', 'C'),
                Key::new('F', 'V'),
            ],
            key_states: [false; 16],
            memory: Memory::default(),
        };

        for i in 0..FONT_SIZE {
            cpu.memory.cells[START_FONT as usize + i] = FONT_SET[i];
        }

        cpu
    }
}

impl CPU {
    fn get_random_byte() -> u8 {
        let mut rng = rand::thread_rng();
        rng.gen_range(0..=255)
    }

    fn load_instructions(&mut self, instructions: Vec<u8>) {
        for i in 0..instructions.len() {
            self.memory.cells[START_PC as usize + i] = instructions[i];
        }
    }
}

// CHIP-8 Operations
impl CPU {
    /// `CLS`
    /// Clear The Display
    ///
    fn OP_00E0(&mut self) {
        self.memory.display.fill(0);
    }

    /// `RET`
    /// Return from a subroutine
    ///
    fn OP_00EE(&mut self) {
        self.sp -= 1;
        self.pc = self.memory.stack[self.sp];
    }

    /// `JP`
    /// Jump to location
    ///
    fn OP_1nnn(&mut self, addr: u16) {
        self.pc = addr;
    }

    /// `CALL`
    /// Call subroutine at address
    ///
    fn OP_2nnn(&mut self, addr: u16) {
        self.memory.stack[self.sp] = self.pc;
        self.sp += 1;
        self.pc = addr;
    }

    /// 'SE Vx, byte'
    /// Skip next instruction if Vx = kk
    ///
    fn OP_3xkk(&mut self, vx: usize, byte: u8) {
        if self.registers[vx] == byte {
            self.pc += 2;
        }
    }

    /// 'SNE Vx, byte'
    /// Skip next instruction if Vx = kk
    ///
    fn OP_4xkk(&mut self, vx: usize, byte: u8) {
        if self.registers[vx] != byte {
            self.pc += 2;
        }
    }

    /// `SE Vx, Vy`
    /// Skip next instruction if Vx = Vy
    ///
    fn OP_5xy0(&mut self, vx: usize, vy: usize) {
        if self.registers[vx] == self.registers[vy] {
            self.pc += 2;
        }
    }

    /// `LD Vx, byte`
    /// Set Vx = byte
    ///
    fn OP_6xkk(&mut self, vx: usize, byte: u8) {
        self.registers[vx] = byte;
    }

    /// `ADD Vx, byte`
    /// Set Vx = VX + byte
    ///
    fn OP_7xkk(&mut self, vx: usize, byte: u8) {
        self.registers[vx] += byte;
    }

    /// `LD Vx, byte`
    /// Set Vx = Vy
    ///
    fn OP_8xy0(&mut self, vx: usize, vy: usize) {
        self.registers[vx] = self.registers[vy];
    }

    /// `OR Vx, Vy`
    /// Set Vx = Vx OR Vy
    ///
    fn OP_8xy1(&mut self, vx: usize, vy: usize) {
        self.registers[vx] |= self.registers[vy];
    }

    /// `AND Vx, Vy`
    /// Set Vx = Vx AND Vy
    ///
    fn OP_8xy2(&mut self, vx: usize, vy: usize) {
        self.registers[vx] &= self.registers[vy];
    }

    /// XOR Vx, Vy
    /// Set Vx = Vx XOR Vy
    ///
    fn OP_8xy3(&mut self, vx: usize, vy: usize) {
        self.registers[vx] ^= self.registers[vy];
    }

    /// `ADD Vx, Vy`
    /// Set Vx = Vx + Vy, VF = 1 if overflow and Vx = lowest bits of result
    ///
    fn OP_8xy4(&mut self, vx: usize, vy: usize) {
        let result: u16 = (self.registers[vx] + self.registers[vy]) as u16;
        self.registers[0xF] = if result > 255 { 1 } else { 0 };
        self.registers[vx] = (result & 0xFF) as u8;
    }

    /// `SUB Vx, Vy`
    /// If Vx > Vy set VF = 1. Set Vx = Vx - Vy
    ///
    fn OP_8xy5(&mut self, vx: usize, vy: usize) {
        self.registers[0xF] = if vx > vy { 1 } else { 0 };
        self.registers[vx] -= self.registers[vy];
    }

    /// `SHR Vx`
    /// Right shift + set bit to VF
    ///
    fn OP_8xy6(&mut self, vx: usize) {
        self.registers[0xF] = self.registers[vx] & 0x1;
        self.registers[vx] >>= 1;
    }

    /// `SUBN Vx, Vy`
    /// If Vy > Vx set VF = 1. Set Vx = Vy - Vx
    ///
    fn OP_8xy7(&mut self, vx: usize, vy: usize) {
        self.registers[0xF] = if vy > vx { 1 } else { 0 };
        self.registers[vx] = self.registers[vy] - self.registers[vx];
    }

    /// `SHL Vx`
    /// Left shift + set bit to VF
    ///     
    fn OP_8xyE(&mut self, vx: usize) {
        self.registers[0xF] = self.registers[vx] & 0x80;
        self.registers[vx] <<= 1;
    }

    /// `SNE Vx, Vy`
    /// Skip instruction if Vx != Vy
    ///
    fn OP_9xy0(&mut self, vx: usize, vy: usize) {
        if self.registers[vx] != self.registers[vy] {
            self.pc += 2;
        }
    }

    /// `LD I, addr`
    /// Set I = addr (nnn)
    ///
    fn OP_Annn(&mut self, addr: u16) {
        self.ir = addr;
    }

    /// `JP V0, addr`
    /// Jumo to location addr (nnn) + V0
    ///
    fn OP_Bnnn(&mut self, addr: u16) {
        self.pc = addr + self.registers[0] as u16;
    }

    /// `RND Vx, byte`
    /// Set Vx = random byte AND byte (kk)
    ///
    fn OP_Cxkk(&mut self, vx: usize, byte: u8) {
        self.registers[vx] = CPU::get_random_byte() & byte;
    }

    /// `DRW Vx, Vy, nibble`
    /// Display n-bite sprite starting at memory location I at (Vx, Vy), set VF = collision
    ///
    fn OP_Dxyn(&mut self, vx: usize, vy: usize, n: u8) {
        let mut erased = false;

        let xPos = self.registers[vx] as usize % SCREEN_WIDTH;
        let yPos = self.registers[vy] as usize % SCREEN_HEIGHT;

        for y in 0..n as usize {
            let currentY = ((yPos + y) % SCREEN_HEIGHT) * SCREEN_WIDTH;
            for x in 0..8 as usize {
                let currentX = (xPos + x) % SCREEN_WIDTH;
                let pixelValue = (self.memory.cells[self.ir as usize] >> x) & 0x1;
                if pixelValue != 0 {
                    if self.memory.display[currentY + currentX] == 0xFFFFFFFF {
                        erased = true;
                        self.memory.display[currentY + currentX] = 0x00000000;
                    }
                }
            }
        }

        self.registers[0xF] = if erased { 1 } else { 0 };
    }

    /// `SKP Vx`
    /// Skip next instruction if key with value of Vx is pressed
    ///
    fn OP_Ex9E(&mut self, vx: usize) {
        let key = self.registers[vx] as usize;
        if self.key_states[key] {
            self.pc += 2;
        }
    }

    /// `SKNP Vx`
    /// Skip next instruction if key with value of Vx is not pressed
    ///
    fn OP_ExA1(&mut self, vx: usize) {
        let key = self.registers[vx] as usize;
        if !self.key_states[key] {
            self.pc += 2;
        }
    }

    /// `LD Vx, DT`
    /// Set Vx = delay timer value
    ///
    fn OP_Fx07(&mut self, vx: usize) {
        self.registers[vx] = self.dt;
    }

    /// 'LD Vx, K'
    /// Wait for a key press, store the value of the key in Vx
    ///
    fn OP_Fx0A(&mut self, vx: usize) {
        'ext: loop {
            for i in 0..self.key_states.len() {
                if self.key_states[i] {
                    self.registers[vx] = i as u8;
                    break 'ext;
                }
            }
        }
    }

    /// `LD DT, Vx`
    /// Set delay timer = Vx
    ///
    fn OP_Fx15(&mut self, vx: usize) {
        self.dt = self.registers[vx];
    }

    /// `LD ST, Vx`
    /// Set delay timer = Vx
    ///
    fn OP_Fx18(&mut self, vx: usize) {
        self.st = self.registers[vx];
    }

    /// `ADD I, Vx`
    /// Set I = I + Vx
    ///
    fn OP_Fx1E(&mut self, vx: usize) {
        self.ir += self.registers[vx] as u16;
    }

    /// `LD F, Vx`
    /// Set I = location of sprite for digit Vx
    ///
    fn OP_Fx29(&mut self, vx: usize) {
        let addr = START_FONT + 5 * self.registers[vx] as u16;
        self.ir = addr;
    }

    /// `LD B, Vx`
    /// Store BSD represenation of Vx in memory location I, I+1, I+2
    ///
    fn OP_Fx33(&mut self, vx: usize, addr: u16) {
        let mut value = self.registers[vx];
        self.memory.cells[addr as usize + 2] = value % 10;
        value /= 10;
        self.memory.cells[addr as usize + 1] = value % 10;
        value /= 10;
        self.memory.cells[addr as usize] = value % 10;
    }

    /// `LD [I], Vx`
    /// Store registers V0 through Vx in memory starting at location I
    /// 
    fn OP_Fx55(&mut self, vx:usize, addr:u16){
        for i in 0..=vx as usize{
            self.memory.cells[addr as usize + i] = self.registers[i];
        }
    }

    /// `LD Vx, [I]`
    /// Read registers V0 through Vx from memory starting at location I.
    /// 
    fn OP_Fx65(&mut self, vx:usize, addr:u16){
        for i in 0..=vx as usize{
            self.registers[i] = self.memory.cells[addr as usize + i];
        }
    }
}

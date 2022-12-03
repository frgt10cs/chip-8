pub struct Key {
    keypad: char,
    keyboard: char,
    isPressed: bool,
}

impl Key {
    pub fn new(keypad: char, keyboard: char) -> Key {
        Key {
            keypad: keypad,
            keyboard: keyboard,
            isPressed: false,
        }
    }
}

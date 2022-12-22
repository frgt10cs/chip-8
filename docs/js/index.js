import init from '../pkg/chip8.js';
import { Terminal } from './terminal.js';
import { Emulator } from './emulator.js';
import { ChipGame } from './chipGame.js';

await init();

const canvas = document.getElementById('terminal');

const terminal = new Terminal(canvas, "rgb(30, 109, 47)", 20);
terminal.clear();

let games = [
  new ChipGame("Test OpCode",
    "Ek7qrKrqzqqqruCgoODAQEDg4CDA4OBgIOCg4CAgYEAgQOCA4ODgICAg4OCg4ODgIOBAoOCg4MCA4OCAwICgQKCgogLatADuogLatBPcaAFpBWoKawFlKmYrohbYtKI+2bSiAjYrogbatGsGohrYtKI+2bSiBkUqogLatGsLoh7YtKI+2bSiBlVgogLatGsQoibYtKI+2bSiBnb/RiqiAtq0axWiLti0oj7ZtKIGlWCiAtq0axqiMti0oj7ZtCJCaBdpG2ogawGiCti0ojbZtKIC2rRrBqIq2LSiCtm0ogaHUEcqogLatGsLoirYtKIO2bSiBmcqh7FHK6IC2rRrEKIq2LSiEtm0ogZmeGcfh2JHGKIC2rRrFaIq2LSiFtm0ogZmeGcfh2NHZ6IC2rRrGqIq2LSiGtm0ogZmjGeMh2RHGKIC2rRoLGkwajRrAaIq2LSiHtm0ogZmjGd4h2VH7KIC2rRrBqIq2LSiItm0ogZm4IZuRsCiAtq0awuiKti0ojbZtKIGZg+GZkYHogLatGsQojrYtKIe2bSj6GAAYTDxVaPp8GWiBkAwogLatGsVojrYtKIW2bSj6GaJ9jPyZaICMAGiBjEDogYyB6IG2rRrGqIO2LSiPtm0EkgT3A==",
    20),
  new ChipGame("Soccer",
    "AOBqDGsMaABpAGYAZwBlAGQAo0gjIiM0Iz5gYPAV8AdAABImEh5kAmYCZxAjCCLUIwgjDEZAElxG/hKAIwhPASLkYAHgoSKkYATgoSKwYAzgoSK8YA3goSLIEjAjIngBSApoACMiYBTwGGYCZxBkAiLUIwhgYPAV8AdAABIwEngjInkBSQppACMiYBTwGGY6ZxBk/iLUIwhgYPAV8AdAABIwEpxKAADuIzR6/iM0AO5KGgDuIzR6AiM0AO5LAADuIz57/iM+AO5LGgDuIz57AiM+AO7AA0AAZf9AAWUAQAJlAQDuRgAS9kYUEvZGKBL2RjwS9gDuItRgBPAYRP4TBGT+AO5kAgDu1nEA7oZEh1RHABMaRx8THgDuZQEA7mX/AO5hFWAA+CnRBXEU+SnRBaNIAO5hANGmcSjRpgDuYRTRtnEo0bYA7oCAgICAgA==",
    6),
  new ChipGame("UFO",
    "os1pOGoI2aOi0GsAbAPbw6LWZB1lH9RRZwBoDyKiIqxIABIiZB5lHKLT1FNuAGaAbQTtoWb/bQXtoWYAbQbtoWYBNoAi2KLQ28PNAYvU28M/ABKSos3Zo80BPQBt/3n+2aM/ABKMTgASLqLT1FNFABKGdf+EZNRTPwESRm0IjVJNCBKMEpIirHj/Eh4ioncFEpYioncPIqJtA/0YotPUUxKGovj3M2MAIrYA7qL4+DNjMiK2AO5tG/Jl8CnT1XMF8SnT1XMF8inT1QDuAXz+fGDwYEDgoPjUbgFtEP0YAO4=",
    20),
  new ChipGame("Airplane",
    "agBrBGwBbQBuAiMmIyBgMGEB8BXwB/EYMAASFCJCIyB9ASMgYAjgoSMKSgASPqNi2JF5AdiRTwES9EkYEuQishIeTAEibEwCInpMAyKITAQilkwFIqSjWdZyRAAA7qNX1FJCAADuo1vSMgDuZihnCWQAZQBiAGMAAO5mKGcOZChlFGIAYwAA7mYoZwdkKGUMYhZjEQDuZihnB2QoZQ5iFmMUAO5mKGcFZChlEGIWYwsA7qNZ1nJ2/tZyRAAA7qNX1FJ0AkREdMDUUkIAAO6jW9IycgJMBHICTAVyAkJEcsDSMgDufAFtAG4CAOBMBmwBagASCmAG8Bh7/0sAEwhtAG4CAOBqABIKEwhKAQDuYALwGGoBiNB4AYngeQHYkQDuo1Td4gDuZBljAKNW00FzCDNAEyxjHmQb/CnTRUsEo19LA6NgSwKjYUsBo2JjAXQC00EA7oD4/4DgEHCI7hF3qqiggAA=",
    20)
]

const emulator = new Emulator(terminal, games);
emulator.run();

document.onkeyup = function (e) {  
  emulator.onKeyUp(e.key);
}

document.onkeydown = function (e) {
  emulator.onKeyDown(e.key);
}
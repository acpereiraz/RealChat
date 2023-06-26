import { Hsl } from "../types/Hsl.types";
import HSLToHex from "./HSLToHEX";

function PastelColorGen(): string{ 
    const color: Hsl = {
        h: 360*Math.random(),
        s: 25+70*Math.random(),
        l: 85+10*Math.random()
    }
    return HSLToHex(color)
}

export default PastelColorGen;
import { MOVES } from "./moves.js";

const MOVE_NAMES = Object.keys(MOVES);

function randomMove(){
    const index = Math.floor(Math.random() * MOVE_NAMES.length);
    return MOVE_NAMES[index];
}

export function generateScramble(length = 20){
    const scramble = [];
    for(let i = 0; i < length; i++){
        scramble.push( MOVES[randomMove()]);
    }

    return scramble;
}
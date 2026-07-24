import { performMove } from "./controller.js";

export const moveHistory = [];
export const redoHistory = [];
export function addMove(move) {
    moveHistory.push(move);
    redoHistory.length = 0;
}

export function undoMove(){
    return moveHistory.pop();
}

export function redoMove(){
    return redoHistory.pop();
}


export function addRedo(move){
    redoHistory.push(move);
}

export function inverseMove(move){

    return {
        axis: move.axis,
        value: move.value,
        direction: -move.direction
    };
}

export function undo(){

    const move = undoMove();
    if(!move) return;

    addRedo(move);
    performMove(inverseMove(move), false);
}

export function redo(){

    const move = redoMove();
    if(!move) return;

    addMove(move);
    performMove(move, false);
}
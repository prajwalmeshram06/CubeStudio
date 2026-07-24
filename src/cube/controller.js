import { isRotating, setMovesQueue, prepareMove, startMove } from "./rotation.js";
import { getRotationState } from "./rotation.js";
import { startTimer, getTimerState } from "../ui/timer.js";
import { redoMove, addMove, inverseMove } from "./history.js";



export function performMove(move, save=true){

    if(getRotationState()){
        return;
    }

    if(!getTimerState()){
        startTimer();
    }

    if(save){
        addMove(move);
    }

    if (move.turns === 2) {

        setMovesQueue([
            {
                ...move,
                turns: 1
            },
            {
                ...move,
                turns: 1
            }
        ]);

    } else {

        setMovesQueue([move]);

    }

    prepareMove();

    startMove();

}

export function undo(){

    const lastMove = undoMove();

    if(!lastMove){
        return;
    }

    const reverse = inverseMove(lastMove);

    addRedo(lastMove);

    performMove(reverse,false);

}




export function redo(){

    if(getRotationState()) return;


    const move = redoMove();

    if(!move) return;


    addMove(move);

    performMove(move);

}

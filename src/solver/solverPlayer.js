import { getCurrentMove, getCurrentMoveIndex, isFinished, resetMoveIndex, getSolution } from "./solverState.js";
import { setMovesQueue, prepareMove, startMove, setRotationMode, setRotationSpeed } from "../cube/rotation.js";
import { SOLVER_SPEED, ROTATION_SPEED } from "../config.js";
import { setCurrentMove, setMoveProgress, showSolved } from "./moveDisplay.js";
import { highlightMove } from "./moveDisplay.js";
import { restoreReplayState } from "./replay.js";
import { setSolverStarted } from "./solverState.js";
import { clearHint } from "./hintController.js";
import { lockSolverButtons, unlockSolverButtons } from "./moveDisplay.js";
import { stopTimer, getElapsedTime } from "../ui/timer.js";
import { getMoveCount } from "../cube/state.js";
import { showCongratulations } from "../ui/popup.js";
let isPaused = false;


export function startPlayback() {

    lockSolverButtons();
    resetMoveIndex();
    setSolverStarted(true);
    setRotationMode("solver");
    setRotationSpeed(SOLVER_SPEED);
    playNextMove();

}


export function playNextMove() {

    if (isFinished()) {

        unlockSolverButtons();
        document.getElementById("solver-restart-btn").disabled = false;
        setSolverStarted(false);
        stopTimer();
        showCongratulations(getElapsedTime(), getMoveCount());
        showSolved();
        setRotationMode("normal");
        setRotationSpeed(ROTATION_SPEED);
        return;
    }

    const move = getCurrentMove();

    const totalMoves = getSolution().length;

    setCurrentMove(move.name);
    highlightMove(getCurrentMoveIndex());
    setMoveProgress(getCurrentMoveIndex() + 1, totalMoves);

    if(isPaused) return;

    setMovesQueue([move]);
    prepareMove();
    startMove();

}

export function replaySolution(){
    document.getElementById("solver-restart-btn").disabled = true;
    clearHint();
    isPaused=false;
    restoreReplayState();
    resetMoveIndex();
    setSolverStarted(true);
    setRotationMode("solver");
    setRotationSpeed(SOLVER_SPEED);
    playNextMove();

}

export function pausePlayback(){

    isPaused = true;

}

export function resumePlayback(){

    if(!isPaused) return;

    isPaused = false;
    playNextMove();

}

export function togglePause(){

    if(isPaused){
        resumePlayback();
    }
    else{
        pausePlayback();
    }
}

export function resetPlayback(){

    isPaused = false;

}
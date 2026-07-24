import { stopRotation } from "../cube/rotation.js";
import { restoreReplayState } from "./replay.js";
import { clearSolution, resetMoveIndex, setSolverStarted } from "./solverState.js";
import { unlockSolverButtons } from "./moveDisplay.js";
import { hideMoveBox, hideSolutionQueue, hideHint, clearCurrentMove, setMoveProgress } from "./moveDisplay.js";
import { resetTimer } from "../ui/timer.js";
import { resetMoveCount } from "../cube/state.js";
import { updateMoveDisplay } from "../ui/updateUI.js";


export function restartHandler() {

    resetMoveCount();
    updateMoveDisplay("solver-move-count");
    resetTimer("solver-timer");
    unlockSolverButtons();
    stopRotation();
    restoreReplayState();
    clearSolution();
    resetMoveIndex();
    setSolverStarted(false);
    clearCurrentMove();
    setMoveProgress(0,0);
    hideMoveBox();
    hideSolutionQueue();
    hideHint();

}
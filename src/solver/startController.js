import { resetCube } from "../cube/reset.js";
import { resetMoveCount } from "../cube/state.js";
import { updateMoveDisplay } from "../ui/updateUI.js";
import { resetTimer, startTimer } from "../ui/timer.js";
import { generateScramble } from "../cube/scramble.js";
import { clearSolution, resetMoveIndex } from "./solverState.js";
import { setMovesQueue, prepareMove, startMove, setRotationSpeed, getRotationState, getRotationMode, setRotationMode } from "../cube/rotation.js";
import { clearHint } from "./hintController.js";
import { SCRAMBLE_SPEED } from "../config.js";


export function startSolver(){

    if(getRotationState() || getRotationMode() !== "normal") {
        return;
    }
    clearHint();
    clearSolution();
    resetMoveIndex();
    resetCube();
    resetMoveCount();
    updateMoveDisplay("solver-move-count");
    resetTimer("solver-timer");
    startTimer("solver-timer");
    setRotationMode("solverScramble");
    setRotationSpeed(SCRAMBLE_SPEED);

    const scramble = generateScramble(50);

    setMovesQueue(scramble);
    prepareMove();
    startMove();
}
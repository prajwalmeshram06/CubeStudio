import { getCubeNotation } from "./cubeNotation.js";
import { solveCube } from "./api.js";
import { parseSolution } from "./solutionParser.js";
import { setSolution, resetMoveIndex} from "./solverState.js";
import { playNextMove} from "./solverPlayer.js";
import { setRotationMode, setRotationSpeed} from "../cube/rotation.js";
import { showMoveBox, showSolutionQueue, setSolutionQueue } from "./moveDisplay.js";
import { SOLVER_SPEED } from "../config.js";
import { cubies } from "../cube/state.js";
import { setReplayState } from "./solverState.js";
import { setSolverStarted } from "./solverState.js";
import { clearHint } from "./hintController.js";


export async function solveCubeHandler() {

    document.getElementById("solver-restart-btn").disabled = true;
    clearHint();

    const notation = getCubeNotation();

    setReplayState(cubies);

    try {
        
        const response = await solveCube(notation);
        const moves = parseSolution(response.solution);
        
        resetMoveIndex();
        setSolution(moves);
        setRotationMode("solver");
        setRotationSpeed(SOLVER_SPEED);
        showSolutionQueue();
        setSolutionQueue(response.solution.trim().split(" "));
        showMoveBox();
        setSolverStarted(true);
        playNextMove();

    }
    catch (error) {

        console.error("Solver Error:", error);

    }
}
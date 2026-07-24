import { getCubeNotation } from "./cubeNotation.js";
import { solveCube } from "./api.js";
import { parseSolution } from "./solutionParser.js";
import { getSolution, setSolution, clearSolution, getCurrentMoveIndex, incrementMoveIndex, resetMoveIndex} from "./solverState.js";
import { showHint, hideHint } from "./moveDisplay.js";

let hintTimeout = null;



export async function hintHandler() {

    let solution = getSolution();

    if (solution.length === 0) {
        const notation = getCubeNotation();
        const response = await solveCube(notation);
        const parsed = parseSolution(response.solution);
        setSolution(parsed);
        solution = parsed;
    }

    const move = solution[getCurrentMoveIndex()];

    if (!move) return;

    showHint(move.name);
    clearTimeout(hintTimeout);
    hintTimeout = setTimeout(() => {
        hideHint();
    }, 10000);
}

export function clearHint() {

    clearTimeout(hintTimeout);
    hideHint();
}

export function onUserMove(moveName) {

    clearHint();
    const solution = getSolution();
    if (solution.length === 0) return;

    const expected = solution[getCurrentMoveIndex()];

    if (moveName === expected.name) {

        incrementMoveIndex();

    } else {

        clearSolution();
        resetMoveIndex();
    }
}
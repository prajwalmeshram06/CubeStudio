let startNotation = null;
let solution = [];
let currentMoveIndex = 0;
let solverStarted = false;

export function setStartNotation(notation) {
    startNotation = notation;
}

export function getStartNotation() {
    return startNotation;
}

export function setSolution(newSolution) {
    solution = newSolution;
}

export function getSolution() {
    return solution;
}

export function hasSolution() {
    return solution.length > 0;
}

export function clearSolution() {
    solution = [];
    currentMoveIndex = 0;
    solverStarted = false;
}

export function getCurrentMoveIndex() {
    return currentMoveIndex;
}

export function incrementMoveIndex() {
    currentMoveIndex++;
}

export function resetMoveIndex() {
    currentMoveIndex = 0;
}

export function getCurrentMove() {

    if (currentMoveIndex >= solution.length) {
        return null;
    }

    return solution[currentMoveIndex];
}

export function isFinished() {
    return currentMoveIndex >= solution.length;
}

export function setSolverStarted(value) {
    solverStarted = value;
}

export function isSolverStarted() {
    return solverStarted;
}

let replayState = null;


export function setReplayState(state){

    replayState = JSON.parse(
        JSON.stringify(state)
    );

}


export function getReplayState(){

    return replayState;

}
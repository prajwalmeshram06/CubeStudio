let solution = [];
let currentHint = 0;

export function setSolution(moves) {
    solution = moves || [];
    currentHint = 0;
}

export function getSolution() {
    return solution;
}

export function getCurrentHint() {
    return currentHint;
}

export function nextHint() {
    if (currentHint < solution.length) {
        return solution[currentHint++];
    }
    return null;
}

export function resetSolver() {
    solution = [];
    currentHint = 0;
}
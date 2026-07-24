export function setCurrentMove(move) {

    const element = document.getElementById("current-move");

    if (!element) return;

    element.textContent = move;

}

export function clearCurrentMove() {

    const element = document.getElementById("current-move");

    if (!element) return;

    element.textContent = "-";

}

export function setMoveProgress(current, total) {

    const element = document.getElementById("move-progress");

    if (!element) return;

    element.textContent = `${current} / ${total}`;

}

export function showSolved() {

    const element = document.getElementById("current-move");

    if (!element) return;

    element.textContent = "Solved ✓";

}

export function showMoveBox(){

    document
    .getElementById("current-move-box")
    .classList.remove("hidden");

}


export function hideMoveBox(){

    document
    .getElementById("current-move-box")
    .classList.add("hidden");

}

export function showSolutionQueue(){

    document
    .getElementById("solution-queue-box")
    .classList.remove("hidden");

}

export function setSolutionQueue(solution){

    const box = document.getElementById("solution-queue");

    if(!box) return;

    box.innerHTML = "Solution : ";


    solution.forEach((move,index)=>{

        const span = document.createElement("span");

        span.textContent = move;

        span.className = "move-token";

        span.id = `move-${index}`;

        box.appendChild(span);

    });

}

export function highlightMove(index){

    document
    .querySelectorAll(".move-token")
    .forEach(token=>{

        token.classList.remove("active");

    });


    const current =
    document.getElementById(`move-${index}`);


    if(current){

        current.classList.add("active");

        current.scrollIntoView({
            behavior:"smooth",
            block:"nearest"
        });

    }

}

export function hideSolutionQueue(){

    document
    .getElementById("solution-queue-box")
    .classList.add("hidden");

}

export function hideSolverUI(){

    hideMoveBox();

    hideSolutionQueue();

}

export function showHint(move){

    const bar =
        document.getElementById("hint-bar");

    bar.textContent = `Hint : ${move}`;

    bar.classList.remove("hidden");

}

export function hideHint(){

    document
        .getElementById("hint-bar")
        .classList.add("hidden");

}


const ids = [
    "solver-start-btn",
    "solver-hint-btn",
    "solver-solve-btn",
    "solver-replay-btn",
    "solver-restart-btn"
];

export function lockSolverButtons() {

    ids.forEach(id => {

        if (id === "solver-solve-btn") return;

        document.getElementById(id).disabled = true;

    });

}

export function unlockSolverButtons() {

    ids.forEach(id => {

        document.getElementById(id).disabled = false;

    });

}
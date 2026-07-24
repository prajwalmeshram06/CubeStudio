import "./style.css";
import "./inputMethods/manually/manualInput.css";
import "./inputMethods/manually/cubeNet.css";
import "./infoPage/info.css";
import "./pages/about.css"
import "./ui/popup.css"
import "./inputMethods/manually/palette.css";
import { initScene, camera, renderer } from "./core/scene.js";
import { createCubeGrid } from "./cube/cube.js";
import { setMovesQueue, prepareMove, startMove, getRotationState, setRotationMode, getRotationMode, setRotationSpeed } from "./cube/rotation.js";
import { SCRAMBLE_SPEED } from "./config.js";
import { animate } from "./core/animate.js";
import { initRaycaster } from "./input/raycast.js";
import { initKeyboard } from "./input/keyboard.js";
import { resetMoveCount, saveSolvedState } from "./cube/state.js";
import { resetCube } from "./cube/reset.js";
import { generateScramble } from "./cube/scramble.js";
import { resetTimer} from "./ui/timer.js";
import { undo, redo } from "./cube/history.js";
import { updateMoveDisplay } from "./ui/updateUI.js";
import { openPage } from "./pages/pageManager.js";
import { solveCubeHandler } from "./solver/solveController.js";
import { startSolver } from "./solver/startController.js";
import { togglePause, replaySolution } from "./solver/solverPlayer.js";
import { hideMoveBox, hideSolutionQueue, hideSolverUI } from "./solver/moveDisplay.js";
import { hintHandler } from "./solver/hintController.js";
import { restartHandler } from "./solver/restartController.js";
import { openManualInput, closeManualInput,} from "./inputMethods/manually/manualUI.js";
import { integrateManualCube } from "./inputMethods/manually/integrateCube.js";
import { verifyCube } from "./inputMethods/manually/verifyCube.js";
import { clearManualCube } from "./inputMethods/manually/manualInput.js";
import { createInfoPage } from "./infoPage/info.js";
import { createAboutPage } from "./pages/aboutPage.js";
import "./ui/onboarding.js";;
import "./ui/onboarding.css";


// ---------------- MANUAL INPUT ----------------

document
.getElementById("clear-manual-btn")
?.addEventListener(
    "click",
    clearManualCube
);

document
.getElementById("verify-cube-btn")
?.addEventListener(
    "click",
    verifyCube
);

document
.getElementById("integrate-cube-btn")
?.addEventListener(
    "click",
    ()=>{
        integrateManualCube();
        closeManualInput();
    }
);

document
.querySelectorAll(".manual-input-btn")
.forEach(button=>{
    button.addEventListener(
        "click",
        openManualInput
    );
});

document
.getElementById("manual-close-btn")
?.addEventListener(
    "click",
    closeManualInput
);


// ---------------- SOLVER EVENTS ----------------

document
.getElementById("solver-restart-btn")
?.addEventListener(
    "click",
    restartHandler
);

document
.getElementById("solver-hint-btn")
?.addEventListener(
    "click",
    hintHandler
);

document
.getElementById("solver-pause-btn")
?.addEventListener(
    "click",
    togglePause
);

document
.getElementById("solver-replay-btn")
?.addEventListener(
    "click",
    replaySolution
);

document
.getElementById("solver-solve-btn")
?.addEventListener(
    "click",
    solveCubeHandler
);

document
.getElementById("solver-start-btn")
?.addEventListener(
    "click",
    startSolver
);


// ---------------- PAGE NAVIGATION ----------------

document
.getElementById("simulator-page-btn")
?.addEventListener(
    "click",
    ()=>{
        hideSolverUI();
        openPage("simulator");
    }
);

document
.getElementById("solver-page-btn")
?.addEventListener(
    "click",
    ()=>{
        openPage("solver");
    }
);

document
.getElementById("info-page-btn")
?.addEventListener(
    "click",
    ()=>{

        hideSolverUI();

        openPage("info");

    }
);

document
.getElementById("about-page-btn")
?.addEventListener(
    "click",
    ()=>{
        hideSolverUI();
        openPage("about");
    }
);


// ---------------- INITIALIZATION ----------------

function init(){
    initScene();
    createCubeGrid();
    createInfoPage();
    createAboutPage();
    saveSolvedState();
    initRaycaster();
    initKeyboard();
    animate();
}


// ---------------- RESIZE ----------------

function onWindowResize(){
    const container =
        renderer.domElement.parentElement;
    camera.aspect =
        container.clientWidth /
        container.clientHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(
        container.clientWidth,
        container.clientHeight
    );
}

window.addEventListener(
    "resize",
    onWindowResize
);


// ---------------- SIDEBAR ----------------

const menuBtn =
document.querySelector("#menu-btn");

const sidebar =
document.querySelector("#sidebar");

menuBtn?.addEventListener(
    "click",
    ()=>{
        sidebar.classList.toggle("open");
    }
);

// ---------------- CUBE CONTROLS ----------------

const resetButton =
document.querySelector("#reset-btn");

resetButton?.addEventListener(
    "click",
    ()=>{
        if(
            getRotationState() ||
            getRotationMode() !== "normal"
        ){
            return;
        }
        resetTimer("timer");
        resetMoveCount();
        updateMoveDisplay("move-count");
        resetCube();
    }
);



const scrambleBtn =
document.querySelector("#scramble-btn");

scrambleBtn?.addEventListener(
    "click",
    ()=>{
        if(getRotationState() || getRotationMode() !== "normal") {
            return;
        }
        resetMoveCount();
        updateMoveDisplay("move-count");
        resetTimer("timer");
        setRotationMode("simulatorScramble");
        setRotationSpeed(SCRAMBLE_SPEED);
        const moves = generateScramble(20);
        setMovesQueue(moves);
        prepareMove();
        startMove();
    }
);

const undoButton =
document.querySelector("#undo-btn");

undoButton?.addEventListener(
    "click",
    ()=>{
        if(getRotationState()){
            return;
        }
        undo();
    }
);

const redoButton =
document.querySelector("#redo-btn");

redoButton?.addEventListener(
    "click",
    ()=>{
        if(getRotationState()){
            return;
        }
        redo();
    }
);


// ---------------- UI ----------------

document
.getElementById("close-move-box")
?.addEventListener(
    "click",
    hideMoveBox
);

document
.getElementById("close-solution-box")
?.addEventListener(
    "click",
    hideSolutionQueue
);


// ---------------- START APP ----------------

init();
openPage("simulator");

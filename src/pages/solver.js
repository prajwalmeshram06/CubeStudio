import { moveRenderer } from "../core/scene.js";
import { updateMoveDisplay } from "../ui/updateUI.js";

export function showSolver(){

    document
    .getElementById("simulator-page")
    .classList.add("hidden");

    document
    .getElementById("solver-page")
    .classList.remove("hidden");

    document
    .getElementById("info-page")
    .classList.add("hidden");

    document
    .getElementById("about-page")
    .classList.add("hidden");

    moveRenderer("#solver-game");

    updateMoveDisplay("solver-move-count");

}
import { moveRenderer } from "../core/scene.js";
import { updateMoveDisplay } from "../ui/updateUI.js";

export function showSimulator(){

    document
    .getElementById("simulator-page")
    .classList.remove("hidden");

    document
    .getElementById("solver-page")
    .classList.add("hidden");

    document
    .getElementById("info-page")
    .classList.add("hidden");

    document
    .getElementById("about-page")
    .classList.add("hidden");

    moveRenderer("#game");

    updateMoveDisplay("move-count");

}
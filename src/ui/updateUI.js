import { moveCount } from "../cube/state.js";

export function updateMoveDisplay(id){
    document.getElementById(id).innerText =
        `Moves: ${moveCount}`;
}
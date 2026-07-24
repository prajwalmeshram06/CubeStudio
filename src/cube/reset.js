import { cubies, solvedState, resetMoveCount} from "./state.js";
import { SPACING } from "../config.js";
import { updateMaterials } from "./color.js";
import { updateMoveDisplay } from "../ui/updateUI.js";

export function resetCube() {

    cubies.forEach((cubie, index) => {
        const solved = solvedState[index];

        // restore logical position
        cubie.grid.x = solved.grid.x;
        cubie.grid.y = solved.grid.y;
        cubie.grid.z = solved.grid.z;

        // restore stickers
        cubie.stickers = solved.stickers.map(sticker => ({
            axis: sticker.axis,
            value: sticker.value,
            color: sticker.color
        }));
        updateMaterials(cubie);

        // restore visual position
        cubie.mesh.position.set(
            solved.grid.x * SPACING,
            solved.grid.y * SPACING,
            solved.grid.z * SPACING
        );

        // restore cubie rotation
        cubie.mesh.rotation.set(0, 0, 0);
    });
    
    resetMoveCount();
    updateMoveDisplay("move-count");
}
import { cubies } from "../cube/state.js";
import { SPACING } from "../config.js";
import { updateMaterials } from "../cube/color.js";
import { getReplayState } from "./solverState.js";


export function restoreReplayState(){
    const saved = getReplayState();
    if(!saved) return;
    saved.forEach((old,index)=>{
        const cubie = cubies[index];

        cubie.grid.x = old.grid.x;
        cubie.grid.y = old.grid.y;
        cubie.grid.z = old.grid.z;

        cubie.stickers =
        old.stickers.map(s=>({
            axis:s.axis,
            value:s.value,
            color:s.color
        }));

        cubie.mesh.position.set(
            cubie.grid.x * SPACING,
            cubie.grid.y * SPACING,
            cubie.grid.z * SPACING
        );

        updateMaterials(cubie);
    });
}
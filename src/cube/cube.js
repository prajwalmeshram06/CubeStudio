// import * as THREE from "three";
// import { scene } from "../core/scene.js";
// import { cubies } from "./state.js";
// import { createMaterials } from "./color.js";
// import { COLORS, CUBE_SIZE, GRID_SIZE, SPACING } from "../config.js";
// import { solvedState } from "./state.js";

// export function createCubie(x, y, z, geometry) {
//   const materials = createMaterials(x, y, z);
//   const cube = new THREE.Mesh(geometry, materials);
//   cube.position.set(x * SPACING, y * SPACING, z * SPACING);
//   scene.add(cube);

//   const cubie = {
//     mesh: cube,
//     stickers: [
//       ...(x === 1 ?  [{ axis: "x", value: 1,  color: COLORS.right }] : []),
//       ...(x === -1 ? [{ axis: "x", value: -1, color: COLORS.left }] : []),
//       ...(y === 1 ?  [{ axis: "y", value: 1,  color: COLORS.top }] : []),
//       ...(y === -1 ? [{ axis: "y", value: -1, color: COLORS.bottom }] : []),
//       ...(z === 1 ?  [{ axis: "z", value: 1,  color: COLORS.front }] : []),
//       ...(z === -1 ? [{ axis: "z", value: -1, color: COLORS.back }] : [])
//     ],
//     grid: { x, y, z }
//   };
//   cubies.push(cubie);
  
// }

// export function createCubeGrid() {
//   const geometry = new THREE.BoxGeometry(CUBE_SIZE, CUBE_SIZE, CUBE_SIZE);
//   const offset = Math.floor(GRID_SIZE / 2);

//   for (let x = -offset; x <= offset; x++) {
//     for (let y = -offset; y <= offset; y++) {
//       for (let z = -offset; z <= offset; z++) {
//         createCubie(x, y, z, geometry);
//       }
//     }
//   }
// }

// export function checkSolved() {

//     for (let i = 0; i < cubies.length; i++) {

//         const cubie = cubies[i];
//         const solved = solvedState[i];

//         if (
//             cubie.grid.x !== solved.grid.x ||
//             cubie.grid.y !== solved.grid.y ||
//             cubie.grid.z !== solved.grid.z
//         ) {
//             return false;
//         }

//         if (cubie.stickers.length !== solved.stickers.length) {
//             return false;
//         }

//         for (let j = 0; j < cubie.stickers.length; j++) {

//             const currentSticker = cubie.stickers[j];
//             const solvedSticker = solved.stickers[j];
            
//             if (
//                 currentSticker.axis !== solvedSticker.axis ||
//                 currentSticker.value !== solvedSticker.value ||
//                 currentSticker.color !== solvedSticker.color
//             ) {
                
//                 console.log(
//                 "Current:",
//                 cubie.stickers,
//                 "Solved:",
//                 solved.stickers);
//                 return false;
//             }

//         }

//     }
    

//     return true;

// }
import * as THREE from "three";
import { RoundedBoxGeometry } from "three/examples/jsm/geometries/RoundedBoxGeometry.js";

import { scene } from "../core/scene.js";
import { cubies } from "./state.js";
import { createMaterials } from "./color.js";
import { COLORS, CUBE_SIZE, GRID_SIZE, SPACING } from "../config.js";
import { solvedState } from "./state.js";

export function createCubie(x, y, z, geometry) {
  const materials = createMaterials(x, y, z);
  const cube = new THREE.Mesh(geometry, materials);
  cube.position.set(x * SPACING, y * SPACING, z * SPACING);
  scene.add(cube);

  const cubie = {
    mesh: cube,
    stickers: [
      ...(x === 1 ?  [{ axis: "x", value: 1,  color: COLORS.right }] : []),
      ...(x === -1 ? [{ axis: "x", value: -1, color: COLORS.left }] : []),
      ...(y === 1 ?  [{ axis: "y", value: 1,  color: COLORS.top }] : []),
      ...(y === -1 ? [{ axis: "y", value: -1, color: COLORS.bottom }] : []),
      ...(z === 1 ?  [{ axis: "z", value: 1,  color: COLORS.front }] : []),
      ...(z === -1 ? [{ axis: "z", value: -1, color: COLORS.back }] : [])
    ],
    grid: { x, y, z }
  };

  cubies.push(cubie);
}

export function createCubeGrid() {

  const geometry = new RoundedBoxGeometry(
    CUBE_SIZE,
    CUBE_SIZE,
    CUBE_SIZE,
    2,      // smoothness segments
    0.08    // corner radius
  );

  const offset = Math.floor(GRID_SIZE / 2);

  for (let x = -offset; x <= offset; x++) {
    for (let y = -offset; y <= offset; y++) {
      for (let z = -offset; z <= offset; z++) {
        createCubie(x, y, z, geometry);
      }
    }
  }
}

export function checkSolved() {

    for (let i = 0; i < cubies.length; i++) {

        const cubie = cubies[i];
        const solved = solvedState[i];

        if (
            cubie.grid.x !== solved.grid.x ||
            cubie.grid.y !== solved.grid.y ||
            cubie.grid.z !== solved.grid.z
        ) {
            return false;
        }

        if (cubie.stickers.length !== solved.stickers.length) {
            return false;
        }

        for (let j = 0; j < cubie.stickers.length; j++) {

            const currentSticker = cubie.stickers[j];
            const solvedSticker = solved.stickers[j];
            
            if (
                currentSticker.axis !== solvedSticker.axis ||
                currentSticker.value !== solvedSticker.value ||
                currentSticker.color !== solvedSticker.color
            ) {
                
                console.log(
                    "Current:",
                    cubie.stickers,
                    "Solved:",
                    solved.stickers
                );

                return false;
            }
        }
    }

    return true;
}
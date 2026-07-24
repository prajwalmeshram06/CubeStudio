import { getManualCubeState } from "./manualInput.js";

const COLOR_TO_FACE = {

    white: "U",
    red: "R",
    green: "F",
    yellow: "D",
    orange: "L",
    blue: "B"

};

export function getManualCubeNotation(){

    const cubeState =
        getManualCubeState();

    let notation = "";

    const faceOrder = [
        "U",
        "R",
        "F",
        "D",
        "L",
        "B"
    ];

    faceOrder.forEach(face=>{

        cubeState[face].forEach(color=>{

            notation +=
                COLOR_TO_FACE[color];

        });

    });

    return notation;

}
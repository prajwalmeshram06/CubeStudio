import { cubies, saveSolvedState } from "../../cube/state.js";
import { COLORS } from "../../config.js";
import { updateMaterials } from "../../cube/color.js";
import { getManualCubeState } from "./manualInput.js";



const COLOR_MAP = {

    white: COLORS.top,
    yellow: COLORS.bottom,

    red: COLORS.right,
    orange: COLORS.left,

    green: COLORS.front,
    blue: COLORS.back

};



// Find sticker on a cubie

function updateSticker(cubie, axis, value, color){


    const sticker =
        cubie.stickers.find(
            s =>
            s.axis === axis &&
            s.value === value
        );


    if(sticker && color){

        sticker.color =
            COLOR_MAP[color];

    }

}




export function integrateManualCube(){


    const cubeState =
        getManualCubeState();



    cubies.forEach(cubie=>{


        const {
            x,
            y,
            z
        } = cubie.grid;



        if(y === 1){

            updateSticker(
                cubie,
                "y",
                1,
                cubeState.U[getUIndex(x,z)]
            );

        }



        if(y === -1){

            updateSticker(
                cubie,
                "y",
                -1,
                cubeState.D[getDIndex(x,z)]
            );

        }



        if(x === 1){

            updateSticker(
                cubie,
                "x",
                1,
                cubeState.R[getRIndex(z,y)]
            );

        }



        if(x === -1){

            updateSticker(
                cubie,
                "x",
                -1,
                cubeState.L[getLIndex(z,y)]
            );

        }



        if(z === 1){

            updateSticker(
                cubie,
                "z",
                1,
                cubeState.F[getFIndex(x,y)]
            );

        }



        if(z === -1){

            updateSticker(
                cubie,
                "z",
                -1,
                cubeState.B[getBIndex(x,y)]
            );

        }



        updateMaterials(cubie);


    });



    


    console.log(
        "Manual cube integrated"
    );

}






function getUIndex(x,z){

    return (z+1)*3 + (x+1);

}


function getDIndex(x,z){

    return (1-z)*3 + (x+1);

}


function getFIndex(x,y){

    return (1-y)*3 + (x+1);

}


function getBIndex(x,y){

    return (1-y)*3 + (1-x);

}


function getRIndex(z,y){

    return (1-y)*3 + (1-z);

}


function getLIndex(z,y){

    return (1-y)*3 + (z+1);

}
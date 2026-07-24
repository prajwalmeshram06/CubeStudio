import { validateCube } from "./notationValidator.js";

let selectedColor = null;
let cubeVerified = false;
let verificationFailed = false;


// Stores current manual cube colors

const cubeState = {

    U: Array(9).fill(null),
    R: Array(9).fill(null),
    F: Array(9).fill(null),
    D: Array(9).fill(null),
    L: Array(9).fill(null),
    B: Array(9).fill(null)

};


// Fixed center colors

cubeState.U[4] = "white";
cubeState.R[4] = "red";
cubeState.F[4] = "green";
cubeState.D[4] = "yellow";
cubeState.L[4] = "orange";
cubeState.B[4] = "blue";



function getColorCode(color){

    const colors = {

        white:"#ffffff",
        red:"#ff0000",
        green:"#00aa00",
        yellow:"#ffff00",
        orange:"#ff8800",
        blue:"#0066ff",
        erase:"#222222"

    };

    return colors[color];

}




export function initPaletteEvents(){

    const palette =
        document.getElementById(
            "color-palette"
        );


    palette.addEventListener(
        "click",
        (e)=>{

            if(
                !e.target.classList.contains(
                    "color-btn"
                )
            ){
                return;
            }


            selectedColor =
                e.target.dataset.color;


            document
            .querySelectorAll(".color-btn")
            .forEach(btn =>
                btn.classList.remove("selected")
            );


            e.target.classList.add("selected");

        }
    );

}




export function initStickerEvents(){

    const cube =
        document.getElementById(
            "cube-net-container"
        );


    cube.addEventListener(
        "click",
        (e)=>{

            if(
                !e.target.classList.contains(
                    "sticker"
                )
            ){
                return;
            }


            const sticker = e.target;


            // Center stickers are fixed
            if(
                sticker.classList.contains(
                    "center"
                )
            ){
                return;
            }


            if(!selectedColor){
                return;
            }


            paintSticker(sticker);

        }
    );

}




// Updates both UI and cube memory

function paintSticker(sticker){

    const face =
        sticker.dataset.face;

    const index =
        Number(sticker.dataset.index);


    if(selectedColor === "erase"){

        // Remove color from UI
        sticker.style.backgroundColor =
            "#222";

        // Remove color from memory
        cubeState[face][index] =
            null;

    }

    else{

        // Update UI
        sticker.style.backgroundColor =
            getColorCode(selectedColor);

        // Update memory
        cubeState[face][index] =
            selectedColor;

    }


    // Cube changed → previous verification becomes invalid
    cubeVerified = false;
    verificationFailed = false;

    updateValidationStatus();

}




// Used later for notation & integration

export function getManualCubeState(){

    return cubeState;

}




function updateValidationStatus(){

    const result =
        validateCube(cubeState);


    const status =
        document.getElementById(
            "notation-validity"
        );


    const integrateBtn =
        document.getElementById(
            "integrate-cube-btn"
        );


    if(result.status === "incomplete"){

        status.textContent =
            "Incomplete";

        integrateBtn.disabled = true;

    }


    else if(result.status === "invalid"){

        status.textContent =
            "Invalid";

        integrateBtn.disabled = true;

    }


    else{

        if(verificationFailed){

            status.textContent =
                "Impossible Cube";

            integrateBtn.disabled = true;

        }

        else if(cubeVerified){

            status.textContent =
                "Valid";

            integrateBtn.disabled = false;

        }

        else{

            status.textContent =
                "Ready for Check";

            integrateBtn.disabled = true;

        }

    }


    console.log(result.message);

}




export function setCubeVerified(value){

    cubeVerified = value;

    updateValidationStatus();

}




export function isCubeVerified(){

    return cubeVerified;

}




export function setVerificationFailed(value){

    verificationFailed = value;

    updateValidationStatus();

}




export function hasVerificationFailed(){

    return verificationFailed;

}

export function clearManualCube(){

    const faces = [
        "U",
        "R",
        "F",
        "D",
        "L",
        "B"
    ];


    faces.forEach(face=>{

        for(let i=0;i<9;i++){

            if(i !== 4){

                cubeState[face][i] =
                    null;

                const sticker =
                    document.getElementById(
                        face + i
                    );


                if(sticker){

                    sticker.style.backgroundColor =
                        "#222";

                }

            }

        }

    });


    cubeVerified = false;
    verificationFailed = false;


    updateValidationStatus();

}
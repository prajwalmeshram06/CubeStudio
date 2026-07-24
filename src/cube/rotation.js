import { scene, rotationGroup } from "../core/scene.js";
import { updateMaterials } from "./color.js";
import { checkSolved } from "./cube.js";
import { ROTATION_SPEED, SCRAMBLE_SPEED, TARGET_ROTATION, SPACING } from "../config.js";
import { cubies, increaseMoveCount } from "./state.js";
import { updateMoveDisplay } from "../ui/updateUI.js";
import { playNextMove } from "../solver/solverPlayer.js";
import { incrementMoveIndex, isSolverStarted } from "../solver/solverState.js";
import { onUserMove } from "../solver/hintController.js";
import { stopTimer } from "../ui/timer.js";


export let rotationMode = "normal";
export let isRotating = false;

let rotationAmount = 0;
let currentMove = null;
let testMoves = [];
let moveIndex = 0;
let currentLayer = [];
let currentSpeed = ROTATION_SPEED;


export function setRotationSpeed(speed){

    currentSpeed = speed;

}


export function setMovesQueue(moves){

    testMoves = moves;
    moveIndex = 0;
    currentMove = testMoves[0];

}


export function getLayer(axis,value){

    return cubies.filter(
        cubie => cubie.grid[axis] === value
    );

}


export function prepareMove(){

    if(!currentMove)
        return;


    currentLayer =
        getLayer(
            currentMove.axis,
            currentMove.value
        );


    for(const cubie of currentLayer){

        rotationGroup.attach(
            cubie.mesh
        );

    }

}


export function startMove(){

    isRotating = true;
    rotationAmount = 0;

}


export function rotateCubes(){

    if(!isRotating || !currentMove)
        return;


    rotationGroup.rotation[currentMove.axis] +=
        currentSpeed * currentMove.direction;


    rotationAmount +=
        Math.abs(
            currentSpeed * currentMove.direction
        );


    if(rotationAmount >= TARGET_ROTATION){

        rotationGroup.rotation[currentMove.axis] =
            TARGET_ROTATION * currentMove.direction;


        isRotating = false;

        finishRotation();

    }

}


export async function finishRotation(){

    rotationGroup.updateMatrixWorld(true);


    for(const cubie of currentLayer){

        scene.attach(cubie.mesh);

        cubie.mesh.rotation.set(
            0,
            0,
            0
        );

    }


    rotationGroup.clear();

    updateGridPositions(currentLayer);

    rotationGroup.rotation.set(
        0,
        0,
        0
    );


    for(const cubie of currentLayer){

        rotateSticker(cubie);

        updateMaterials(cubie);

    }


    if(rotationMode === "normal"){

        increaseMoveCount();

        updateMoveDisplay(
            "move-count"
        );

    }
    else if(rotationMode === "solver"){

        increaseMoveCount();

        updateMoveDisplay(
            "solver-move-count"
        );

    }


    if(!isSolverStarted()){

        onUserMove(
            currentMove.name
        );

    }


    moveIndex++;


    if(moveIndex < testMoves.length){

        currentMove =
            testMoves[moveIndex];

        prepareMove();

        startMove();

    }
    else{

        currentMove = null;
        testMoves = [];
        moveIndex = 0;


        if(rotationMode === "solver" && isSolverStarted()){

            incrementMoveIndex();

            playNextMove();

            return;

        }


        if(rotationMode === "simulatorScramble"){

            rotationMode = "normal";

            setRotationSpeed(
                ROTATION_SPEED
            );

        }
        else if(rotationMode === "solverScramble"){

            rotationMode = "solver";

            setRotationSpeed(
                ROTATION_SPEED
            );

        }


        const solved = checkSolved();


        if(solved){

            stopTimer();

        }

    }

}



function rotateSticker(cubie){

    for(const sticker of cubie.stickers){

        const {axis,value} = sticker;

        let newAxis = axis;
        let newValue = value;


        if(currentMove.axis === "x"){

            if(currentMove.direction === 1){

                if(axis === "y"){
                    newAxis = "z";
                    newValue = value;
                }
                else if(axis === "z"){
                    newAxis = "y";
                    newValue = -value;
                }

            }
            else{

                if(axis === "y"){
                    newAxis = "z";
                    newValue = -value;
                }
                else if(axis === "z"){
                    newAxis = "y";
                    newValue = value;
                }

            }

        }
        else if(currentMove.axis === "y"){

            if(currentMove.direction === 1){

                if(axis === "x"){
                    newAxis = "z";
                    newValue = -value;
                }
                else if(axis === "z"){
                    newAxis = "x";
                    newValue = value;
                }

            }
            else{

                if(axis === "x"){
                    newAxis = "z";
                    newValue = value;
                }
                else if(axis === "z"){
                    newAxis = "x";
                    newValue = -value;
                }

            }

        }
        else if(currentMove.axis === "z"){

            if(currentMove.direction === 1){

                if(axis === "x"){
                    newAxis = "y";
                    newValue = value;
                }
                else if(axis === "y"){
                    newAxis = "x";
                    newValue = -value;
                }

            }
            else{

                if(axis === "x"){
                    newAxis = "y";
                    newValue = -value;
                }
                else if(axis === "y"){
                    newAxis = "x";
                    newValue = value;
                }

            }

        }


        sticker.axis = newAxis;
        sticker.value = newValue;

    }

}


function updateGridPositions(layer){

    for(const cubie of layer){

        const {x,y,z} = cubie.grid;

        let newX = x;
        let newY = y;
        let newZ = z;


        if(currentMove.axis === "x"){

            if(currentMove.direction === 1){

                newX = x;
                newY = -z;
                newZ = y;

            }
            else{

                newX = x;
                newY = z;
                newZ = -y;

            }

        }
        else if(currentMove.axis === "y"){

            if(currentMove.direction === 1){

                newX = z;
                newY = y;
                newZ = -x;

            }
            else{

                newX = -z;
                newY = y;
                newZ = x;

            }

        }
        else if(currentMove.axis === "z"){

            if(currentMove.direction === 1){

                newX = -y;
                newY = x;
                newZ = z;

            }
            else{

                newX = y;
                newY = -x;
                newZ = z;

            }

        }


        cubie.grid.x = newX;
        cubie.grid.y = newY;
        cubie.grid.z = newZ;


        cubie.mesh.position.set(
            newX * SPACING,
            newY * SPACING,
            newZ * SPACING
        );

    }

}


export function getRotationState(){

    return isRotating;

}


export function setRotationMode(mode){

    rotationMode = mode;

}


export function getRotationMode(){

    return rotationMode;

}


export function stopRotation(){

    isRotating = false;

    currentMove = null;

    testMoves = [];

    moveIndex = 0;

    currentLayer = [];

    rotationGroup.clear();

    rotationGroup.rotation.set(
        0,
        0,
        0
    );

}


export function finishDragRotation(name,axis,value,direction){

    currentMove = {
        name,
        axis,
        value,
        direction
    };


    currentLayer =
        getLayer(
            axis,
            value
        );


    rotationGroup.updateMatrixWorld(true);

    finishRotation();

}
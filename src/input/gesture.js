import { MOVES } from "../cube/moves.js";


export function getMoveFromGesture(face, direction){

    // FRONT FACE
    if(face === "front"){

        if(direction === "RIGHT")
            return MOVES["F'"];

        if(direction === "LEFT")
            return MOVES.F;

    }

    // RIGHT FACE
    if(face === "right"){

        if(direction === "UP")
            return MOVES["R'"];
        if(direction === "DOWN")
            return MOVES.R;

    }


    // LEFT FACE
    if(face === "left"){

        if(direction === "DOWN")
            return MOVES["L'"];

        if(direction === "UP")
            return MOVES.L;

    }


    // TOP FACE
    if(face === "top"){

        if(direction === "RIGHT")
            return MOVES.U;

        if(direction === "LEFT")
            return MOVES["U'"];

    }


    // BOTTOM FACE
    if(face === "bottom"){

        if(direction === "LEFT")
            return MOVES.D;

        if(direction === "RIGHT")
            return MOVES["D'"];

    }


    // BACK FACE
    if(face === "back"){

        if(direction === "LEFT")
            return MOVES.B;

        if(direction === "RIGHT")
            return MOVES["B'"];

    }


    return null;

}
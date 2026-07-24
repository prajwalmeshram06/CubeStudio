import { cubies } from "../cube/state.js";
import { COLORS } from "../config.js";

const COLOR_TO_FACE = {
    [COLORS.top]: "U",
    [COLORS.right]: "R",
    [COLORS.front]: "F",
    [COLORS.bottom]: "D",
    [COLORS.left]: "L",
    [COLORS.back]: "B"
};

function getStickerColor(cubie,axis,value){

    const sticker =
        cubie.stickers.find(
            s =>
            s.axis===axis &&
            s.value===value
        );
    if(!sticker)
        return null;

    return COLOR_TO_FACE[sticker.color];

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



export function getCubeNotation(){

    const U=new Array(9);
    const R=new Array(9);
    const F=new Array(9);
    const D=new Array(9);
    const L=new Array(9);
    const B=new Array(9);

    for(const cubie of cubies){

        const {x,y,z}=cubie.grid;

        if(y===1)
            U[getUIndex(x,z)] = getStickerColor(cubie,"y",1);

        if(y===-1)
            D[getDIndex(x,z)] = getStickerColor(cubie,"y",-1);

        if(x===1)
            R[getRIndex(z,y)] = getStickerColor(cubie,"x",1);

        if(x===-1)
            L[getLIndex(z,y)] = getStickerColor(cubie,"x",-1);

        if(z===1)
            F[getFIndex(x,y)] = getStickerColor(cubie,"z",1);

        if(z===-1)
            B[getBIndex(x,y)] = getStickerColor(cubie,"z",-1);
    }

    return (
        U.join("")+
        R.join("")+
        F.join("")+
        D.join("")+
        L.join("")+
        B.join("")
    );
}
export function getDragAngle(axis, startX, startY, currentX, currentY) {

    let movement;

    if(axis==="x"){
        movement =
        currentY-startY;
    } else if(axis==="y"){
        movement =
        currentX-startX;
    } else{
        movement =
        currentX-startX;
    }

    return movement*0.01;
}

export function snapAngle(angle){
    return Math.round(angle/(Math.PI/2));
}
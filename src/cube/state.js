export const cubies = [];
export const solvedState = [];
export let moveCount = 0;

export function increaseMoveCount(){
    moveCount++;
}

export function resetMoveCount() {
    moveCount = 0;
}

export function saveSolvedState() {
    solvedState.length = 0;
    for (const cubie of cubies) {
        solvedState.push({
            grid: {
                x: cubie.grid.x,
                y: cubie.grid.y,
                z: cubie.grid.z
            },
            stickers: cubie.stickers.map(sticker => ({
                axis: sticker.axis,
                value: sticker.value,
                color: sticker.color
            }))
        });
    }
}

export function getMoveCount(){

    return moveCount;

}


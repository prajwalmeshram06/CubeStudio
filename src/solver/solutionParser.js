import { MOVES } from "../cube/moves.js";


export function parseSolution(solution){

    const parsedMoves = [];
    const tokens = solution.trim().split(" ");

    for(const token of tokens){

        const move = MOVES[token];
        if(!move){
            console.warn("Unknown move:", token);
            continue;
        }
        for(let i = 0; i < move.turns; i++){
            parsedMoves.push({
                name: token,
                axis: move.axis,
                value: move.value,
                direction: move.direction
            });
        }
    }

    return parsedMoves;
}
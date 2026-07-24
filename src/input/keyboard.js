import { MOVES } from "../cube/moves.js";
import { performMove } from "../cube/controller.js";

export function initKeyboard() {

    window.addEventListener("keydown", function(event){

        let move = null;

        switch(event.code){

            case "KeyR":

                if(event.altKey){
                    move = MOVES.R2;
                }
                else if(event.shiftKey){
                    move = MOVES["R'"];
                }
                else{
                    move = MOVES.R;
                }

                break;


            case "KeyL":

                if(event.altKey){
                    move = MOVES.L2;
                }
                else if(event.shiftKey){
                    move = MOVES["L'"];
                }
                else{
                    move = MOVES.L;
                }

                break;


            case "KeyU":

                if(event.altKey){
                    move = MOVES.U2;
                }
                else if(event.shiftKey){
                    move = MOVES["U'"];
                }
                else{
                    move = MOVES.U;
                }

                break;


            case "KeyD":

                if(event.altKey){
                    move = MOVES.D2;
                }
                else if(event.shiftKey){
                    move = MOVES["D'"];
                }
                else{
                    move = MOVES.D;
                }

                break;


            case "KeyF":

                if(event.altKey){
                    move = MOVES.F2;
                }
                else if(event.shiftKey){
                    move = MOVES["F'"];
                }
                else{
                    move = MOVES.F;
                }

                break;


            case "KeyB":

                if(event.altKey){
                    move = MOVES.B2;
                }
                else if(event.shiftKey){
                    move = MOVES["B'"];
                }
                else{
                    move = MOVES.B;
                }

                break;

        }

        if(move){

            event.preventDefault();
            performMove(move);

        }

    });

}
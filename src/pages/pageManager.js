import { showSimulator } from "./simulator.js";
import { showSolver } from "./solver.js";
import { showInfo } from "./infoPage.js";
import { showAbout } from "./about.js";


export function openPage(page){

    switch(page){

        case "simulator":
            showSimulator();
            break;

        case "solver":
            showSolver();
            break;

        case "info":
            showInfo();
            break;

        case "about":
            showAbout();
            break;

    }

}
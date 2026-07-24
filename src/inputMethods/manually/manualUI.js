import { createCubeNet } from "./cubeNet.js";
import { initPaletteEvents, initStickerEvents } from "./manualInput.js";
import { getManualCubeState } from "./manualInput.js";
import {
    getManualCubeNotation
}
from "./manualCubeNotation.js";


let initialized = false;


export function openManualInput(){

    if(!initialized){

        createCubeNet();

        createPalette();

        initPaletteEvents();

        initStickerEvents();
        console.log(getManualCubeState());
        initialized = true;

        

    }


    document
    .getElementById("manual-input-modal")
    .classList.remove("hidden");

}

export function closeManualInput(){

    document
    .getElementById("manual-input-modal")
    .classList.add("hidden");

}

const COLORS = {
    white: "#ffffff",
    red: "#ff0000",
    green: "#00aa00",
    yellow: "#ffff00",
    orange: "#ff8800",
    blue: "#0066ff",
    erase: "#333333"
};


export function createPalette(){

    const palette =
        document.getElementById(
            "color-palette"
        );


    palette.innerHTML = "";


    Object.entries(COLORS).forEach(
        ([name, color]) => {

            const colorBtn = document.createElement("button");

            colorBtn.className = "color-btn";

            colorBtn.dataset.color = name;

            if(name === "erase"){
                colorBtn.textContent = "✕";
                colorBtn.classList.add("eraser");
            }

            colorBtn.style.backgroundColor = color;

            palette.appendChild(colorBtn);

        }
    );

}
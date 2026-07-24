import { showPage } from "./pageManager.js";

export function initNavigation() {

    document.getElementById("simulator-page-btn")
        .addEventListener("click", () => {
            showPage("simulator");
        });

    document.getElementById("solver-page-btn")
        .addEventListener("click", () => {
            showPage("solver");
        });

    document.getElementById("settings-page-btn")
        .addEventListener("click", () => {
            showPage("settings");
        });

    document.getElementById("about-page-btn")
        .addEventListener("click", () => {
            showPage("about");
        });

}
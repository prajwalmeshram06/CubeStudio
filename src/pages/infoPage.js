export function showInfo(){

    document
    .getElementById("simulator-page")
    .classList.add("hidden");

    document
    .getElementById("solver-page")
    .classList.add("hidden");

    document
    .getElementById("info-page")
    .classList.remove("hidden");

    document
    .getElementById("about-page")
    .classList.add("hidden");

}
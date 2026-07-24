export function showCongratulations(time, moves){

    const popup =
        document.getElementById("success-popup");


    if(!popup)
        return;


    const totalSeconds =
        Math.floor(time / 1000);


    const minutes =
        Math.floor(totalSeconds / 60);


    const seconds =
        totalSeconds % 60;


    popup.innerHTML = `

        <div class="popup-content">

            <h1>
                🎉 Congratulations!
            </h1>

            <p>
                Cube solved successfully.
            </p>


            <div class="popup-stats">

                <span>
                    ⏱ Time:
                    ${String(minutes).padStart(2,"0")}:
                    ${String(seconds).padStart(2,"0")}
                </span>


                <span>
                    🔄 Moves:
                    ${moves}
                </span>

            </div>


            <button id="close-success-popup">
                Continue
            </button>

        </div>

    `;


    popup.classList.remove("hidden");


    document
    .getElementById("close-success-popup")
    .onclick = ()=>{

        popup.classList.add("hidden");

    };

}
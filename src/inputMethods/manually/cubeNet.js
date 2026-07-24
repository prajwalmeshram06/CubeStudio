const FACE_ORDER = [
    "U",
    "L",
    "F",
    "R",
    "B",
    "D"
];

const FACE_POSITION = {
    U: { row: 1, col: 2 },
    L: { row: 2, col: 1 },
    F: { row: 2, col: 2 },
    R: { row: 2, col: 3 },
    B: { row: 2, col: 4 },
    D: { row: 3, col: 2 }
};

const FACE_COLORS = {

    U:"#ffffff",
    R:"#ff0000",
    F:"#00aa00",
    D:"#ffff00",
    L:"#ff8800",
    B:"#0066ff"

};


export function createCubeNet() {

    const container =
        document.getElementById(
            "cube-net-container"
        );

    container.innerHTML = "";


    FACE_ORDER.forEach(face => {

        const faceDiv =
            document.createElement("div");


        faceDiv.className = "cube-face";

        faceDiv.dataset.face = face;


        // Position face inside cube net
        faceDiv.style.gridRow =
            FACE_POSITION[face].row;

        faceDiv.style.gridColumn =
            FACE_POSITION[face].col;



        for(let i = 0; i < 9; i++){

            const sticker =
                document.createElement("div");


            sticker.className = "sticker";


            // Give unique id
            sticker.id = face + i;


            sticker.dataset.face = face;
            sticker.dataset.index = i;



            if(i === 4){

                sticker.classList.add("center");

                sticker.dataset.color = face;

                sticker.style.backgroundColor = FACE_COLORS[face];

                sticker.textContent = face;

            }


            faceDiv.appendChild(sticker);

        }


        container.appendChild(faceDiv);

    });

}
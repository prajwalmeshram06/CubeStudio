export function validateCube(cubeState){

    const colors = [
        "white",
        "yellow",
        "green",
        "blue",
        "red",
        "orange"
    ];

    const count = {
        white:0,
        yellow:0,
        green:0,
        blue:0,
        red:0,
        orange:0
    };

    let filled = 0;

    // Count colors

    for(const face in cubeState){

        cubeState[face].forEach(
            sticker=>{

                if(sticker){

                    filled++;
                    count[sticker]++;
                }

            }
        );
    }

    // Case 1:
    // Cube is not completely entered
    if(filled < 54){

        return {
            status:"incomplete",

            message:
            `${54-filled} stickers remaining`
        };
    }

    // Case 2:
    // Wrong color count

    for(const color of colors){

        if(count[color] !== 9){

            return {
                status:"invalid",

                message:
                `${color} has ${count[color]} stickers`
            };
        }
    }

    // Case 3:
    // Cube colors are correct

    return {
        status:"valid",
        message:"Color validation passed"
    };

}
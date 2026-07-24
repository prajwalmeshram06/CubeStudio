export async function solveCube(cubeNotation){

    const response = await fetch(
        "http://127.0.0.1:8000/solve",
        {
            method: "POST",

            headers: {
                "Content-Type": "application/json"
            },

            body: JSON.stringify({
                cube: cubeNotation
            })
        }
    );

    const data = await response.json();

    return data;
}
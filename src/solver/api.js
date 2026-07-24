const API_URL = "https://cubestudio-jz1j.onrender.com";


export async function solveCube(cubeNotation){

    const response = await fetch(
        `${API_URL}/solve`,
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
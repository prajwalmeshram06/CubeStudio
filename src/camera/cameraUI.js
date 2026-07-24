import { 
    startCamera,
    stopCamera
} from "./cameraController.js";


export async function openCamera(){


    document
    .getElementById("camera-modal")
    .classList
    .remove("hidden");


    await startCamera();

}



export function closeCamera(){


    stopCamera();


    document
    .getElementById("camera-modal")
    .classList
    .add("hidden");


}
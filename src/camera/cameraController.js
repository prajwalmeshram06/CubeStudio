import { FrameProcessor } from "./frameProcessor.js";
import { faceScanner } from "./faceScanner.js";


export function waitForOpenCV() {

    return new Promise(resolve => {

        function check() {

            if(window.cv && window.cv.Mat){

                console.log("✅ OpenCV Ready");
                resolve();

            }else{

                setTimeout(check,100);

            }

        }

        check();

    });

}



let video = null;
let processor = null;


export async function startCamera(){

    video =
    document.getElementById("camera-feed");


    video.autoplay = true;
    video.playsInline = true;
    video.muted = true;


    const stream =
    await navigator.mediaDevices.getUserMedia({

        video:{
            facingMode:"environment"
        },

        audio:false

    });


    video.srcObject = stream;


    await video.play();


    console.log("📷 Camera Ready");


    const overlay =
    document.getElementById("camera-output");


    processor =
    new FrameProcessor(

        video,

        overlay,

        (result)=>{

            faceScanner.handleFrameResult(result);


            const instruction =
            document.getElementById(
                "camera-instruction"
            );


            if(instruction){

                instruction.innerText =
                faceScanner.getStatusText();

            }


            const captureBtn =
            document.getElementById(
                "capture-btn"
            );


            if(captureBtn){

                captureBtn.disabled =
                !faceScanner.isCaptureEnabled();

            }


        }

    );


    processor.start();


    return video;

}



export function captureFace(){

    const result =
    faceScanner.captureFace();


    console.log(result);


    if(result.ok){

        console.log(
            "✅ Face captured"
        );


        const instruction =
        document.getElementById(
            "camera-instruction"
        );


        instruction.innerText =
        faceScanner.getCurrentFaceInstruction();


    }else{

        console.log(
            result.error
        );

    }

}



export function stopCamera(){

    if(processor){

        processor.stop();

        processor=null;

    }


    if(video && video.srcObject){

        video.srcObject
        .getTracks()
        .forEach(track=>track.stop());

    }

}
// /**
//  * frameProcessor.js
//  * -----------------
//  * Drives the real-time processing loop on top of the existing live <video>
//  * element. Never touches the video element itself (no pause/replace).
//  *
//  * Pipeline per frame:
//  *  1. Draw current video frame into an offscreen (hidden) canvas.
//  *  2. cv.imread() the offscreen canvas into a cv.Mat.
//  *  3. Preprocess (gray -> blur -> canny) via cubeDetector.
//  *  4. Locate the cube face quadrilateral via cubeDetector.
//  *  5. If found: perspective-warp via perspectiveTransform.
//  *  6. Classify the 9 sticker colors via colorDetector.
//  *  7. Feed the result into scannerState / faceScanner for
//  *     stability tracking + UI status.
//  *  8. Draw all overlay graphics (green outline, grid, status text) onto the
//  *     transparent overlay canvas — never onto the video.
//  *
//  * All cv.Mat instances created within a frame are explicitly .delete()'d in
//  * a finally block to avoid the classic OpenCV.js memory leak.
//  *
//  * Requires global `cv` (OpenCV.js) to already be loaded, per the existing
//  * project setup.
//  */

// import { detectCubeFace, drawDetectionOverlay, REJECT_REASON } from './cubeDetector.js';
// import { warpToSquare } from './perspectiveTransform.js';
// import { classifyFaceColors, MIN_BRIGHTNESS } from './colorDetector.js';
// import { faceScanner } from "./faceScanner.js";



// const TARGET_FPS = 30;
// const FRAME_INTERVAL_MS = 1000 / TARGET_FPS;
// const WARP_SIZE = 300; // px, size of the perspective-corrected square face






// export class FrameProcessor {
//   /**
//    * @param {HTMLVideoElement} videoEl - the existing live camera video element.
//    * @param {HTMLCanvasElement} overlayCanvas - existing transparent overlay canvas
//    *        sized/positioned to sit exactly on top of videoEl by the caller.
//    * @param {(detection: {quadFound:boolean, reason?:string, colors?:string[]|null, warpedColorsRaw?:string[]}) => void} onFrameResult
//    *        Callback invoked once per processed frame with the detection result.
//    *        Typically wired to faceScanner.js / scannerState.js.
//    */
//   constructor(videoEl, overlayCanvas, onFrameResult) {
//     this.video = videoEl;
//     this.overlayCanvas = overlayCanvas;
//     this.overlayCtx = overlayCanvas.getContext('2d');
//     this.onFrameResult = onFrameResult || (() =>{});

//     // Offscreen canvas used purely to get pixel data from the <video> into
//     // a format cv.imread() can consume. Never appended to the DOM.
//     this.hiddenCanvas = document.createElement('canvas');
//     this.hiddenCtx = this.hiddenCanvas.getContext('2d', { willReadFrequently: true });

//     this._running = false;
//     this._rafId = null;
//     this._lastFrameTime = 0;
//     this._paused = false;
//   }

//   /** Start the continuous processing loop. Safe to call multiple times. */
//   start() {
//     if (this._running) return;
//     this._running = true;
//     this._lastFrameTime = performance.now();
//     this._rafId = requestAnimationFrame(this._tick);
//   }

//   /** Stop the processing loop. Does NOT stop the camera / video element. */
//   stop() {
//     this._running = false;
//     if (this._rafId !== null) {
//       cancelAnimationFrame(this._rafId);
//       this._rafId = null;
//     }
//     this._clearOverlay();
//   }

//   /** Temporarily suspend processing (e.g. while a "face saved" toast shows)
//    *  without tearing down the loop. */
//   pause() {
//     this._paused = true;
//   }

//   resume() {
//     this._paused = false;
//   }

//   _clearOverlay() {
//     this.overlayCtx.clearRect(0, 0, this.overlayCanvas.width, this.overlayCanvas.height);
//   }

//   _tick = (now) => {
//     if (!this._running) return;

//     const elapsed = now - this._lastFrameTime;
//     if (elapsed >= FRAME_INTERVAL_MS) {
//       this._lastFrameTime = now - (elapsed % FRAME_INTERVAL_MS);
//       if (!this._paused && this.video.readyState >= this.video.HAVE_CURRENT_DATA) {
//         this._processFrame();
//       }
//     }

//     this._rafId = requestAnimationFrame(this._tick);
//   };

//   _processFrame() {
//     const vw = this.video.videoWidth;
//     const vh = this.video.videoHeight;
//     if (!vw || !vh) return;

//     // Keep offscreen + overlay canvases in sync with the actual video
//     // intrinsic resolution so pixel-space coordinates line up.
//     if (this.hiddenCanvas.width !== vw || this.hiddenCanvas.height !== vh) {
//       this.hiddenCanvas.width = vw;
//       this.hiddenCanvas.height = vh;
//     }
//     if (this.overlayCanvas.width !== vw || this.overlayCanvas.height !== vh) {
//       this.overlayCanvas.width = vw;
//       this.overlayCanvas.height = vh;
//     }

//     this.hiddenCtx.drawImage(this.video, 0, 0, vw, vh);

//     let src = null;
//     let warped = null;

//     try {
//       src = cv.imread(this.hiddenCanvas);

//       const detection = detectCubeFace(src);
//       console.log("Detection:", detection);
//       this._clearOverlay();

//       if (!detection.quad) {
//         drawDetectionOverlay(this.overlayCtx, null, detection.reason);
//         this.onFrameResult({ quadFound: false, reason: detection.reason });
//         return;
//       }

//       // Quad found — draw it regardless of downstream color result so the
//       // user gets immediate "I see something" feedback (Google-Lens feel).
//       drawDetectionOverlay(this.overlayCtx, detection.quad, null);

//       warped = warpToSquare(src, detection.quad, WARP_SIZE);
//       const { colors, avgBrightness } = classifyFaceColors(warped);

//       if (avgBrightness < classifyFaceColors.MIN_BRIGHTNESS) {
//         this.onFrameResult({ quadFound: true, reason: REJECT_REASON.TOO_DARK, colors: null });
//         return;
//       }

//       this.onFrameResult({ quadFound: true, colors });
//     } catch (err) {
//       // Defensive: never let a single bad frame crash the rAF loop.
//       // eslint-disable-next-line no-console
//       console.error('[frameProcessor] frame processing error:', err);
//       this.onFrameResult({ quadFound: false, reason: REJECT_REASON.NO_CUBE });
//     } finally {
//       if (warped) warped.delete();
//       if (src) src.delete();
//     }
//   }
// }






/**
 * frameProcessor.js
 * -----------------
 * Camera processing pipeline:
 *
 * video
 *  ↓
 * OpenCV Mat
 *  ↓
 * cube detection
 *  ↓
 * perspective transform
 *  ↓
 * HSV color detection
 *  ↓
 * FaceScanner
 */


import {
    detectCubeFace,
    drawDetectionOverlay,
    REJECT_REASON
} from "./cubeDetector.js";

import {
    warpToSquare
} from "./perspectiveTransform.js";

import {
    classifyFaceColors
} from "./colorDetector.js";



const TARGET_FPS = 30;
const FRAME_INTERVAL_MS = 1000 / TARGET_FPS;

const WARP_SIZE = 300;



export class FrameProcessor {


    constructor(videoEl, overlayCanvas, onFrameResult){


        this.video = videoEl;

        this.overlayCanvas = overlayCanvas;

        this.overlayCtx =
        overlayCanvas.getContext("2d");


        this.onFrameResult =
        onFrameResult || (()=>{});


        this.hiddenCanvas =
        document.createElement("canvas");


        this.hiddenCtx =
        this.hiddenCanvas.getContext(
            "2d",
            {
                willReadFrequently:true
            }
        );


        this._running = false;

        this._rafId = null;

        this._lastFrameTime = 0;

        this._paused = false;



        // detection stability

        this.stableFrames = 0;

        this.requiredStableFrames = 5;


    }




    start(){


        if(this._running)
            return;


        this._running = true;


        this._lastFrameTime =
        performance.now();


        this._rafId =
        requestAnimationFrame(
            this._tick
        );

    }





    stop(){


        this._running = false;


        if(this._rafId){

            cancelAnimationFrame(
                this._rafId
            );

            this._rafId=null;

        }


        this.clearOverlay();

    }





    pause(){

        this._paused=true;

    }



    resume(){

        this._paused=false;

    }





    clearOverlay(){

        this.overlayCtx.clearRect(
            0,
            0,
            this.overlayCanvas.width,
            this.overlayCanvas.height
        );

    }






    _tick=(now)=>{


        if(!this._running)
            return;



        const elapsed =
        now-this._lastFrameTime;



        if(elapsed >= FRAME_INTERVAL_MS){


            this._lastFrameTime =
            now-(elapsed%FRAME_INTERVAL_MS);



            if(
                !this._paused &&
                this.video.readyState >=
                this.video.HAVE_CURRENT_DATA
            ){

                this.processFrame();

            }

        }



        this._rafId =
        requestAnimationFrame(
            this._tick
        );


    }






    processFrame(){


        const width =
        this.video.videoWidth;


        const height =
        this.video.videoHeight;



        if(!width || !height)
            return;




        if(
            this.hiddenCanvas.width !== width ||
            this.hiddenCanvas.height !== height
        ){

            this.hiddenCanvas.width = width;

            this.hiddenCanvas.height = height;

        }




        if(
            this.overlayCanvas.width !== width ||
            this.overlayCanvas.height !== height
        ){

            this.overlayCanvas.width = width;

            this.overlayCanvas.height = height;

        }




        this.hiddenCtx.drawImage(
            this.video,
            0,
            0,
            width,
            height
        );



        let src=null;

        let warped=null;



        try{


            src=cv.imread(
                this.hiddenCanvas
            );



            const detection =
            detectCubeFace(src);



            console.log(
                "Detection:",
                detection
            );



            this.clearOverlay();




            /*
             * No cube detected
             */

            if(!detection.quad){


                this.stableFrames=0;


                drawDetectionOverlay(
                    this.overlayCtx,
                    null,
                    detection.reason
                );



                this.onFrameResult({

                    quadFound:false,

                    reason:detection.reason

                });



                return;

            }






            /*
             * Cube detected
             */

            this.stableFrames++;




            drawDetectionOverlay(
                this.overlayCtx,
                detection.quad,
                null
            );






            /*
             * Wait until cube position is stable
             */

            if(
                this.stableFrames <
                this.requiredStableFrames
            ){


                this.onFrameResult({

                    quadFound:false,

                    reason:"STABILIZING"

                });


                return;

            }






            /*
             * Perspective correction
             */


            warped =
            warpToSquare(
                src,
                detection.quad,
                WARP_SIZE
            );







            const {

                colors,

                avgBrightness

            } =
            classifyFaceColors(
                warped
            );







            if(
                avgBrightness <
                classifyFaceColors.MIN_BRIGHTNESS
            ){


                this.onFrameResult({

                    quadFound:true,

                    reason:
                    REJECT_REASON.TOO_DARK,

                    colors:null

                });



                return;

            }







            this.onFrameResult({

                quadFound:true,

                colors

            });



        }

        catch(err){


            console.error(
                "[FrameProcessor]",
                err
            );


            this.onFrameResult({

                quadFound:false,

                reason:
                REJECT_REASON.NO_CUBE

            });


        }



        finally{


            if(warped)
                warped.delete();



            if(src)
                src.delete();


        }


    }


}
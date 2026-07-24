export const REJECT_REASON = Object.freeze({
    NO_CUBE:"NO_CUBE",
    TOO_SMALL:"TOO_SMALL",
    TOO_LARGE:"TOO_LARGE",
    TOO_DARK:"TOO_DARK",
    NOT_CONVEX:"NOT_CONVEX",
    BAD_ASPECT:"BAD_ASPECT"
});


const MIN_AREA_FRACTION = 0.04;
const MAX_AREA_FRACTION = 0.85;
const MAX_ASPECT_DEVIATION = 0.45;


export function detectCubeFace(src){

    const frameArea = src.rows * src.cols;

    let gray = new cv.Mat();
    let blurred = new cv.Mat();
    let edges = new cv.Mat();
    let morphed = new cv.Mat();

    let contours = new cv.MatVector();
    let hierarchy = new cv.Mat();

    let kernel = null;

    let bestQuad = null;
    let bestArea = 0;

    let rejectReason = REJECT_REASON.NO_CUBE;

    try{

        cv.cvtColor(
            src,
            gray,
            cv.COLOR_RGBA2GRAY
        );

        cv.GaussianBlur(
            gray,
            blurred,
            new cv.Size(5,5),
            0
        );


        const brightness = cv.mean(blurred)[0];

        if(brightness < 35){
            return {
                quad:null,
                reason:REJECT_REASON.TOO_DARK
            };
        }


        cv.Canny(
            blurred,
            edges,
            40,
            120
        );


        kernel = cv.getStructuringElement(
            cv.MORPH_RECT,
            new cv.Size(3,3)
        );


        cv.dilate(
            edges,
            morphed,
            kernel,
            new cv.Point(-1,-1),
            1
        );


        cv.findContours(
            morphed,
            contours,
            hierarchy,
            cv.RETR_EXTERNAL,
            cv.CHAIN_APPROX_SIMPLE
        );


        for(let i=0;i<contours.size();i++){

            const contour = contours.get(i);

            const area = cv.contourArea(contour);


            if(area < frameArea * 0.01){
                contour.delete();
                continue;
            }


            const perimeter = cv.arcLength(
                contour,
                true
            );


            const approx = new cv.Mat();


            cv.approxPolyDP(
                contour,
                approx,
                0.02 * perimeter,
                true
            );


            if(approx.rows !== 4){
                approx.delete();
                contour.delete();
                continue;
            }


            if(!cv.isContourConvex(approx)){

                rejectReason = REJECT_REASON.NOT_CONVEX;

                approx.delete();
                contour.delete();

                continue;
            }


            const areaFraction = area/frameArea;


            if(areaFraction < MIN_AREA_FRACTION){

                rejectReason = REJECT_REASON.TOO_SMALL;

                approx.delete();
                contour.delete();

                continue;
            }


            if(areaFraction > MAX_AREA_FRACTION){

                rejectReason = REJECT_REASON.TOO_LARGE;

                approx.delete();
                contour.delete();

                continue;
            }


            const rect = cv.boundingRect(approx);

            const aspect = rect.width / rect.height;


            if(Math.abs(aspect-1) > MAX_ASPECT_DEVIATION){

                rejectReason = REJECT_REASON.BAD_ASPECT;

                approx.delete();
                contour.delete();

                continue;
            }


            if(area > bestArea){

                if(bestQuad){
                    bestQuad.delete();
                }

                bestQuad = approx.clone();
                bestArea = area;
                rejectReason = null;
            }


            approx.delete();
            contour.delete();
        }


        if(bestQuad){

            return {
                quad:bestQuad,
                reason:null
            };

        }


        return {
            quad:null,
            reason:rejectReason
        };


    }finally{

        gray.delete();
        blurred.delete();
        edges.delete();
        morphed.delete();

        contours.delete();
        hierarchy.delete();

        if(kernel)
            kernel.delete();

    }

}



export function drawDetectionOverlay(ctx,quad,reason){

    if(!quad)
        return;


    const pts=[];


    for(let i=0;i<4;i++){

        const p = quad.intPtr(i,0);

        pts.push({
            x:p[0],
            y:p[1]
        });

    }


    ctx.save();

    ctx.lineWidth = 4;

    ctx.strokeStyle = reason
        ? "#ffc107"
        : "#3ddc84";


    ctx.beginPath();

    ctx.moveTo(
        pts[0].x,
        pts[0].y
    );


    for(let i=1;i<pts.length;i++){

        ctx.lineTo(
            pts[i].x,
            pts[i].y
        );

    }


    ctx.closePath();

    ctx.stroke();


    ctx.fillStyle = ctx.strokeStyle;


    for(const p of pts){

        ctx.beginPath();

        ctx.arc(
            p.x,
            p.y,
            5,
            0,
            Math.PI*2
        );

        ctx.fill();

    }


    ctx.restore();

}
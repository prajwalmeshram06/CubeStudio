/**
 * perspectiveTransform.js
 * -----------------------
 * Converts the detected cube face quadrilateral into a straight square image.
 *
 * Input:
 *  - Original camera frame
 *  - 4 corner points detected by cubeDetector
 *
 * Output:
 *  - Perspective corrected square face
 *    (used later for 3x3 sticker color detection)
 */


/**
 * Arrange 4 points into:
 * top-left,
 * top-right,
 * bottom-right,
 * bottom-left
 *
 * @param {{x:number,y:number}[]} pts
 */
function orderCorners(pts) {

    const sums = pts.map(
        p => p.x + p.y
    );

    const diffs = pts.map(
        p => p.y - p.x
    );


    const tl =
        pts[sums.indexOf(Math.min(...sums))];

    const br =
        pts[sums.indexOf(Math.max(...sums))];

    const tr =
        pts[diffs.indexOf(Math.min(...diffs))];

    const bl =
        pts[diffs.indexOf(Math.max(...diffs))];


    return [
        tl,
        tr,
        br,
        bl
    ];
}



/**
 * Warp cube face into square image.
 *
 * @param {cv.Mat} src
 * Original camera frame
 *
 * @param {cv.Mat} quad
 * Four detected cube corners
 *
 * @param {number} size
 * Output image size
 *
 * @returns {cv.Mat}
 */
export function warpToSquare(
    src,
    quad,
    size
){

    const points = [];


    for(let i = 0; i < 4; i++){

        const p =
            quad.intPtr(i,0);

        points.push({

            x:p[0],
            y:p[1]

        });

    }


    const [
        tl,
        tr,
        br,
        bl

    ] = orderCorners(points);



    let srcTri = null;
    let dstTri = null;
    let matrix = null;


    const output =
        new cv.Mat();



    try{


        /*
            Source rectangle
            detected cube corners
        */

        srcTri =
            cv.matFromArray(
                4,
                1,
                cv.CV_32FC2,
                [

                    tl.x,
                    tl.y,

                    tr.x,
                    tr.y,

                    br.x,
                    br.y,

                    bl.x,
                    bl.y

                ]
            );



        /*
            Destination square
        */

        dstTri =
            cv.matFromArray(
                4,
                1,
                cv.CV_32FC2,
                [

                    0,
                    0,

                    size-1,
                    0,

                    size-1,
                    size-1,

                    0,
                    size-1

                ]
            );



        matrix =
            cv.getPerspectiveTransform(
                srcTri,
                dstTri
            );



        cv.warpPerspective(

            src,

            output,

            matrix,

            new cv.Size(
                size,
                size
            ),

            cv.INTER_LINEAR,

            cv.BORDER_CONSTANT,

            new cv.Scalar()

        );


        return output;


    }
    finally{


        if(srcTri)
            srcTri.delete();


        if(dstTri)
            dstTri.delete();


        if(matrix)
            matrix.delete();


        // output is returned
        // caller will delete it

    }

}
/**
 * colorDetector.js
 * ----------------
 * Classifies the 9 stickers of a perspective-corrected, square cube face
 * image into one of the 6 physical cube colors, using HSV thresholds
 * (never raw RGB comparison) so that classification is robust to
 * varying lighting.
 */

/** Raw sticker color codes (not yet mapped to solver face letters). */
export const RAW_COLORS = Object.freeze({
  WHITE: 'W',
  YELLOW: 'Y',
  RED: 'R',
  ORANGE: 'O',
  BLUE: 'B',
  GREEN: 'G',
  UNKNOWN: '?',
});

// HSV thresholds tuned for OpenCV's H in [0,180], S,V in [0,255].
// Hue ranges below are intentionally generous; saturation/value gates
// disambiguate white/gray from saturated colors, and red wraps at 0/180.
const HSV_RANGES = [
  { name: RAW_COLORS.RED, hue: [[0, 8], [170, 180]], sat: [90, 255], val: [60, 255] },
  { name: RAW_COLORS.ORANGE, hue: [[9, 20]], sat: [90, 255], val: [60, 255] },
  { name: RAW_COLORS.YELLOW, hue: [[21, 38]], sat: [70, 255], val: [80, 255] },
  { name: RAW_COLORS.GREEN, hue: [[39, 85]], sat: [60, 255], val: [40, 255] },
  { name: RAW_COLORS.BLUE, hue: [[86, 135]], sat: [60, 255], val: [40, 255] },
];

const WHITE_SAT_MAX = 60; // low saturation + high value => white/gray sticker
const WHITE_VAL_MIN = 140;

function hueInRanges(h, ranges) {
  return ranges.some(([lo, hi]) => h >= lo && h <= hi);
}

/**
 * Classifies a single averaged HSV triplet into a raw color code.
 * @param {number} h - 0..180
 * @param {number} s - 0..255
 * @param {number} v - 0..255
 */
function classifyHSV(h, s, v) {
  if (s <= WHITE_SAT_MAX && v >= WHITE_VAL_MIN) {
    return RAW_COLORS.WHITE;
  }
  for (const range of HSV_RANGES) {
    if (hueInRanges(h, range.hue) && s >= range.sat[0] && s <= range.sat[1] && v >= range.val[0] && v <= range.val[1]) {
      return range.name;
    }
  }
  return RAW_COLORS.UNKNOWN;
}

/**
 * Samples the center region of each of the 9 grid cells of a warped face
 * and returns their mean HSV, with per-frame brightness normalization
 * (scales V so the frame's own average brightness is pulled toward a
 * fixed target) to reduce sensitivity to ambient lighting changes.
 *
 * @param {any} warped - cv.Mat, square RGBA image (output of perspectiveTransform.warpToSquare).
 * @returns {{colors: string[], avgBrightness: number}} colors: 9 raw color codes, row-major (top-left -> bottom-right).
 */
export function classifyFaceColors(warped) {
  const size = warped.rows; // square, rows === cols
  const cell = size / 3;
  // Sample only the inner 40% of each cell to avoid sticker borders / gaps.
  const sampleFraction = 0.4;

  let hsv = new cv.Mat();
  let rgb = new cv.Mat();

  const colors = [];
  let brightnessSum = 0;

  try {
    // warped is RGBA (from cv.imread pipeline); drop alpha before HSV convert.
    cv.cvtColor(warped, rgb, cv.COLOR_RGBA2RGB);
    cv.cvtColor(rgb, hsv, cv.COLOR_RGB2HSV);

    // Global brightness normalization: compute the mean V of the whole
    // face, and a correction factor to pull it toward a target brightness.
    // This runs before per-cell sampling so all 9 stickers get the same
    // correction (keeps colors relatively consistent to each other).
    const channels = new cv.MatVector();
    cv.split(hsv, channels);
    const vChannel = channels.get(2);
    const meanV = cv.mean(vChannel)[0];
    const targetV = 150;
    const gain = meanV > 0 ? Math.min(2.5, Math.max(0.4, targetV / meanV)) : 1;
    channels.delete(); // MatVector.delete() also releases the retrieved Mats' refs it owns
    vChannel.delete();

    for (let row = 0; row < 3; row++) {
      for (let col = 0; col < 3; col++) {
        const cx = col * cell + cell / 2;
        const cy = row * cell + cell / 2;
        const half = (cell * sampleFraction) / 2;

        const x0 = Math.max(0, Math.round(cx - half));
        const y0 = Math.max(0, Math.round(cy - half));
        const w = Math.min(size - x0, Math.round(half * 2));
        const h = Math.min(size - y0, Math.round(half * 2));

        const roiRect = new cv.Rect(x0, y0, Math.max(1, w), Math.max(1, h));
        const roi = hsv.roi(roiRect);
        const meanHSV = cv.mean(roi); // [H, S, V, alpha]
        roi.delete();

        const hVal = meanHSV[0];
        const sVal = meanHSV[1];
        const vValNormalized = Math.min(255, meanHSV[2] * gain);

        brightnessSum += meanHSV[2]; // use un-normalized V for the overall dark-scene check

        colors.push(classifyHSV(hVal, sVal, vValNormalized));
      }
    }

    return { colors, avgBrightness: brightnessSum / 9 };
  } finally {
    hsv.delete();
    rgb.delete();
  }
}

/** Below this raw (un-normalized) average V, we consider the scene too
 *  dark to trust color classification and ask the user for more light. */
classifyFaceColors.MIN_BRIGHTNESS = 45;


export const MIN_BRIGHTNESS = 45;
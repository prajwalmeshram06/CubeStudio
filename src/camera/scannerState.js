/**
 * scannerState.js
 * ----------------
 * Central state machine for the Rubik's Cube scanning workflow.
 *
 * This module owns NO OpenCV / DOM logic. It is a pure state container so
 * that frameProcessor.js, cubeDetector.js, colorDetector.js and faceScanner.js
 * can all read/write a single source of truth without circular imports.
 *
 * Responsibilities:
 *  - Track which of the 6 faces we are currently scanning.
 *  - Track "stable frame" streak required before a face can be captured.
 *  - Store the 9 raw sticker colors captured per face.
 *  - Expose status codes the UI layer can translate into user-facing text.
 *  - Reset cleanly between scans.
 */

/** Number of consecutive stable frames required before a face is capturable. */
export const REQUIRED_STABLE_FRAMES = 20;

/** The order faces are scanned in. This order matches the order the
 *  Kociemba notation string is emitted in (see kociembaNotation.js):
 *  U (up), R (right), F (front), D (down), L (left), B (back).
 *
 *  The user is guided (via UI instruction strings, see faceScanner.js)
 *  to hold the cube in a fixed reference orientation and rotate it
 *  predictably between captures so that the 3x3 grid read left-to-right,
 *  top-to-bottom on screen always corresponds to the same net orientation
 *  for that face. This is what makes the raw scan geometrically consistent
 *  with the notation string the solver expects.
 */
export const FACE_ORDER = ['U', 'R', 'F', 'D', 'L', 'B'];

/** Discrete status codes. The UI (cameraUI.js) maps these to copy. */
export const ScanStatus = Object.freeze({
  IDLE: 'IDLE',
  NO_CUBE: 'NO_CUBE', // no quadrilateral detected at all
  ALIGN: 'ALIGN', // quad found but not yet stable/valid
  TOO_SMALL: 'TOO_SMALL', // move closer
  TOO_LARGE: 'TOO_LARGE', // move farther
  TOO_DARK: 'TOO_DARK', // lighting too dark
  STABLE_PENDING: 'STABLE_PENDING', // stabilizing, counting frames
  FACE_READY: 'FACE_READY', // stable, capture button should enable
  FACE_SAVED: 'FACE_SAVED', // just captured a face
  COMPLETED: 'COMPLETED', // all 6 faces captured
});

export class ScannerState {
  constructor() {
    this.reset();
  }

  /** Reset the entire scan (e.g. user restarts or closes/reopens modal). */
  reset() {
    /** @type {Record<string, string[]|null>} letter -> array of 9 sticker color codes */
    this.faces = Object.fromEntries(FACE_ORDER.map((f) => [f, null]));

    this.currentFaceIndex = 0;
    this.stableFrameCount = 0;
    this.lastStableColors = null; // colors seen on the previous frame, for stability comparison
    this.status = ScanStatus.IDLE;
    this.captureEnabled = false;
    this.done = false;
  }

  get currentFaceLetter() {
    return FACE_ORDER[this.currentFaceIndex];
  }

  get facesScannedCount() {
    return FACE_ORDER.filter((f) => this.faces[f] !== null).length;
  }

  /**
   * Called every processed frame with the latest detection result.
   * @param {{quadFound:boolean, reason?:string, colors?:string[]|null}} detection
   */
  updateFromDetection(detection) {
    if (this.done) return;

    if (!detection.quadFound) {
      this._setStatus(detection.reason || ScanStatus.NO_CUBE);
      this._resetStability();
      return;
    }

    if (detection.reason) {
      // quad found but rejected for a specific reason (too small/large/dark)
      this._setStatus(detection.reason);
      this._resetStability();
      return;
    }

    const colors = detection.colors;
    if (!colors || colors.length !== 9) {
      this._setStatus(ScanStatus.ALIGN);
      this._resetStability();
      return;
    }

    if (this._colorsMatch(colors, this.lastStableColors)) {
      this.stableFrameCount += 1;
    } else {
      this.stableFrameCount = 1; // this frame itself counts as the first
    }
    this.lastStableColors = colors;

    if (this.stableFrameCount >= REQUIRED_STABLE_FRAMES) {
      this._setStatus(ScanStatus.FACE_READY);
      this.captureEnabled = true;
    } else {
      this._setStatus(ScanStatus.STABLE_PENDING);
      this.captureEnabled = false;
    }
  }

  /**
   * Capture the currently-stable face. Caller (faceScanner.js) is
   * responsible for validating colors before calling this.
   * @param {string[]} colors - 9 sticker color codes, row-major.
   */
  captureCurrentFace(colors) {
    const letter = this.currentFaceLetter;
    this.faces[letter] = colors.slice();
    this._setStatus(ScanStatus.FACE_SAVED);
    this._resetStability();
    this.captureEnabled = false;

    if (this.currentFaceIndex < FACE_ORDER.length - 1) {
      this.currentFaceIndex += 1;
    } else {
      this.done = true;
      this._setStatus(ScanStatus.COMPLETED);
    }
  }

  isComplete() {
    return this.done && FACE_ORDER.every((f) => this.faces[f] !== null);
  }

  _resetStability() {
    this.stableFrameCount = 0;
    this.lastStableColors = null;
    this.captureEnabled = false;
  }

  _setStatus(status) {
    this.status = status;
  }

  _colorsMatch(a, b) {
    if (!a || !b || a.length !== b.length) return false;
    for (let i = 0; i < a.length; i++) {
      if (a[i] !== b[i]) return false;
    }
    return true;
  }
}

export const scannerState =
    new ScannerState();
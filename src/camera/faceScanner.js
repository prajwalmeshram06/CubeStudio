/**
 * faceScanner.js
 * --------------
 * Orchestrates the end-to-end 6-face scanning workflow on top of
 * scannerState.js. This is the module cameraController.js/cameraUI.js
 * should talk to directly — it hides scannerState's internals and exposes
 * a small, UI-friendly API:
 *
 *   - handleFrameResult(detection): feed each frameProcessor result in
 *   - getStatusText(): current user-facing status string
 *   - isCaptureEnabled(): whether the capture button should be enabled
 *   - captureFace(): call when the user presses the capture button
 *   - getCurrentFaceInstruction(): "hold the cube like this" guidance
 *   - isComplete(): whether all 6 faces are captured
 *   - getRawFaces(): the captured raw color data (for kociembaNotation.js)
 */

import { ScannerState, ScanStatus, FACE_ORDER } from './scannerState.js';
import { RAW_COLORS } from './colorDetector.js';

/** Per-face physical holding instructions.
 *  Reference orientation: cube held with WHITE center facing up and
 *  GREEN center facing the camera at the start of the scan (step "U").
 *  Each subsequent instruction describes the rotation from that same
 *  fixed reference frame, so the 3x3 grid read left-to-right/top-to-bottom
 *  on screen always lines up with the standard net layout for that face.
 */
const FACE_INSTRUCTIONS = {
  U: 'Hold the cube with the WHITE center facing up, GREEN facing you. Tilt it back and show the TOP face to the camera.',
  R: 'Rotate the cube so the RIGHT side (to the right of green, from the same hold) faces the camera.',
  F: 'Rotate the cube so the GREEN center faces the camera directly.',
  D: 'Tilt the cube forward and show the BOTTOM face (opposite white) to the camera.',
  L: 'Rotate the cube so the LEFT side (opposite of the previous right face) faces the camera.',
  B: 'Rotate the cube so the BACK face (opposite green) faces the camera.',
};

const STATUS_TEXT = {
  [ScanStatus.IDLE]: 'Point the camera at a cube face',
  [ScanStatus.NO_CUBE]: 'Scanning…',
  [ScanStatus.TOO_SMALL]: 'Move closer',
  [ScanStatus.TOO_LARGE]: 'Move farther',
  [ScanStatus.TOO_DARK]: 'Lighting too dark',
  [ScanStatus.ALIGN]: 'Align cube',
  [ScanStatus.STABLE_PENDING]: 'Align cube',
  [ScanStatus.FACE_READY]: 'Face detected',
  [ScanStatus.FACE_SAVED]: 'Face saved',
  [ScanStatus.COMPLETED]: 'Completed',
};

export class FaceScanner {
  constructor() {
    this.state = new ScannerState();
    /** Colors most recently reported as stable/ready — the ones captureFace() will save. */
    this._pendingColors = null;
  }

  reset() {
    this.state.reset();
    this._pendingColors = null;
  }

  /**
   * Feed one frame's detection result in. Call this from the
   * frameProcessor.js callback on every processed frame.
   * @param {{quadFound:boolean, reason?:string, colors?:string[]|null}} detection
   */
  handleFrameResult(detection) {
    if (this.state.done) return;

    if (detection.quadFound && detection.colors) {
      this._pendingColors = detection.colors;
    } else {
      this._pendingColors = null;
    }

    this.state.updateFromDetection(detection);
  }

  getStatusText() {
    const scanned = this.state.facesScannedCount;
    if (this.state.status === ScanStatus.FACE_SAVED || this.state.status === ScanStatus.STABLE_PENDING || this.state.status === ScanStatus.FACE_READY) {
      const base = STATUS_TEXT[this.state.status];
      if (!this.state.done) {
        return `${base} — Scanning face ${Math.min(scanned + 1, 6)}/6`;
      }
      return base;
    }
    return STATUS_TEXT[this.state.status] || 'Scanning…';
  }

  isCaptureEnabled() {
    return this.state.captureEnabled && !this.state.done;
  }

  getCurrentFaceInstruction() {
    if (this.state.done) return 'All faces scanned!';
    return `Scanning face ${this.state.currentFaceIndex + 1}/6 (${this.state.currentFaceLetter}): ${FACE_INSTRUCTIONS[this.state.currentFaceLetter]}`;
  }

  isComplete() {
    return this.state.isComplete();
  }

  /**
   * Called when the user presses the Capture button. Validates the
   * currently-stable 9 colors and, if valid, commits them to the current
   * face slot and advances the workflow.
   * @returns {{ok: boolean, error?: string}}
   */
  captureFace() {
    if (!this.isCaptureEnabled()) {
      return { ok: false, error: 'Face is not stable yet.' };
    }
    const colors = this._pendingColors;
    const validation = this._validateFace(colors);
    if (!validation.ok) {
      return validation;
    }
    this.state.captureCurrentFace(colors);
    this._pendingColors = null;
    return { ok: true };
  }

  /**
   * Validates a captured face's 9 raw colors:
   *  - exactly 9 stickers present (structural, always true from the 3x3 grid,
   *    but checked defensively)
   *  - no UNKNOWN classifications
   *  - has a valid center sticker (index 4)
   *  - the center color hasn't already been used by a previously-scanned
   *    face (no duplicate centers -> catches re-scanning the same face twice
   *    or a wrong-face capture)
   */
  _validateFace(colors) {
    if (!colors || colors.length !== 9) {
      return { ok: false, error: 'Could not read exactly 9 stickers. Try again.' };
    }
    if (colors.some((c) => c === RAW_COLORS.UNKNOWN)) {
      return { ok: false, error: 'Some stickers could not be classified. Adjust lighting/angle.' };
    }
    const center = colors[4];
    if (!center || center === RAW_COLORS.UNKNOWN) {
      return { ok: false, error: 'Could not detect a valid center sticker.' };
    }

    const usedCenters = FACE_ORDER.filter((f) => this.state.faces[f] !== null).map((f) => this.state.faces[f][4]);
    if (usedCenters.includes(center)) {
      return { ok: false, error: 'This face looks like one you already scanned. Rotate to a new face.' };
    }

    return { ok: true };
  }

  /** Raw captured face data: { U: string[9], R: string[9], ... } — consumed by kociembaNotation.js */
  getRawFaces() {
    return this.state.faces;
  }
}



export const faceScanner =
    new FaceScanner();
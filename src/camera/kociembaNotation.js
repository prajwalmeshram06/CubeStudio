/**
 * kociembaNotation.js
 * -------------------
 * Converts the 6 captured faces (each 9 raw HSV-classified sticker colors,
 * row-major) into the 54-character facelet string expected by the
 * Kociemba solver backend, in face order U R F D L B, 9 stickers per face.
 *
 * Mapping raw physical colors (White/Yellow/Red/Orange/Blue/Green) to
 * solver face letters (U/R/F/D/L/B) is done via each face's own CENTER
 * sticker: whatever color is at the center of a face defines that face's
 * letter for every sticker of that same color, cube-wide. This is the
 * standard approach used by all Kociemba-compatible scanners, since a
 * physical cube's center stickers never move relative to each other.
 */

import { FACE_ORDER } from './scannerState.js';
import { RAW_COLORS } from './colorDetector.js';

export class NotationError extends Error {}

/**
 * @param {Record<string, string[]>} faces - e.g. { U: [...9 raw colors], R: [...], ... }
 * @returns {string} 54-char facelet string, order U R F D L B, 9 stickers each, row-major.
 * @throws {NotationError} if faces are incomplete or invalid.
 */
export function buildKociembaNotation(faces) {
  // 1. Structural validation.
  for (const letter of FACE_ORDER) {
    const face = faces[letter];
    if (!face || face.length !== 9) {
      throw new NotationError(`Face ${letter} is missing or incomplete.`);
    }
    if (face.some((c) => !c || c === RAW_COLORS.UNKNOWN)) {
      throw new NotationError(`Face ${letter} contains an unrecognized sticker color.`);
    }
  }

  // 2. Build raw-color -> face-letter map from each face's center sticker (index 4).
  /** @type {Record<string, string>} */
  const colorToLetter = {};
  for (const letter of FACE_ORDER) {
    const centerColor = faces[letter][4];
    if (colorToLetter[centerColor] !== undefined) {
      throw new NotationError(
        `Duplicate center color detected: both face ${colorToLetter[centerColor]} and ${letter} have a ${centerColor} center. Re-scan.`
      );
    }
    colorToLetter[centerColor] = letter;
  }
  if (Object.keys(colorToLetter).length !== 6) {
    throw new NotationError('Could not resolve 6 distinct center colors. Re-scan the cube.');
  }

  // 3. Translate every sticker of every face into its solver letter.
  let notation = '';
  for (const letter of FACE_ORDER) {
    for (const rawColor of faces[letter]) {
      const mapped = colorToLetter[rawColor];
      if (!mapped) {
        throw new NotationError(`Sticker color "${rawColor}" on face ${letter} does not match any known center color.`);
      }
      notation += mapped;
    }
  }

  // 4. Final sanity check: every letter must appear exactly 9 times.
  const counts = {};
  for (const ch of notation) counts[ch] = (counts[ch] || 0) + 1;
  for (const letter of FACE_ORDER) {
    if (counts[letter] !== 9) {
      throw new NotationError(
        `Invalid scan: face ${letter} appears ${counts[letter] || 0} times in the notation (expected 9). Re-scan the cube.`
      );
    }
  }

  return notation;
}
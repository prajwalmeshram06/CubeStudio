import * as THREE from "three";
import { COLORS } from "../config.js";

export function createMaterials(x, y, z) {
  const materials = Array.from({ length: 6 }, () => new THREE.MeshStandardMaterial({ 
    color: 0x333333,
    roughness: 0.35,
    metalness: 0
}));
  
  if (x === 1)  materials[0].color.set(COLORS.right);
  if (x === -1) materials[1].color.set(COLORS.left);
  if (y === 1)  materials[2].color.set(COLORS.top);
  if (y === -1) materials[3].color.set(COLORS.bottom);
  if (z === 1)  materials[4].color.set(COLORS.front);
  if (z === -1) materials[5].color.set(COLORS.back);

  return materials;
}

export function updateMaterials(cubie) {
  const colors = Array(6).fill(0x333333);

  for (const sticker of cubie.stickers) {
    if (sticker.axis === "x" && sticker.value === 1)  colors[0] = sticker.color;
    if (sticker.axis === "x" && sticker.value === -1) colors[1] = sticker.color;
    if (sticker.axis === "y" && sticker.value === 1)  colors[2] = sticker.color;
    if (sticker.axis === "y" && sticker.value === -1) colors[3] = sticker.color;
    if (sticker.axis === "z" && sticker.value === 1)  colors[4] = sticker.color;
    if (sticker.axis === "z" && sticker.value === -1) colors[5] = sticker.color;
  }

  for (let i = 0; i < 6; i++) {
    cubie.mesh.material[i].color.set(colors[i]);
  }
}

export function highlightCubie(cubie) {
    for (const material of cubie.mesh.material) {
        material.emissive.set(0x444444);
    }
}

export function removeHighlight(cubie) {

    for (const material of cubie.mesh.material) {
        material.emissive.set(0x000000);
    }

}
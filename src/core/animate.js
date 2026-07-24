import { updateRaycast } from "../input/raycast.js";
import { rotateCubes } from "../cube/rotation.js";
import { render, controls } from "./scene.js";


export function animate() {
  requestAnimationFrame(animate);

  controls.update();
  updateRaycast();
  rotateCubes();
  render();
}
import * as THREE from "three";
import { raycaster, mouse } from "./raycast.js";
import { camera, controls, rotationGroup, scene } from "../core/scene.js";
import { cubies } from "../cube/state.js";
import { getLayer, finishDragRotation, getRotationState } from "../cube/rotation.js";
import { setDragging, setSelectedLayer, setRotationAxis, setCurrentAngle } from "./dragState.js";


let axis = null;
let value = null;
let layer = [];
let startMouse = new THREE.Vector2();
let dragging = false;


function getHit(){

    raycaster.setFromCamera(
        mouse,
        camera
    );

    const meshes =
        cubies.map(c => c.mesh);

    const hits =
        raycaster.intersectObjects(meshes);

    if(hits.length === 0)
        return null;

    return hits[0];

}


export function initDragRotation(){

    window.addEventListener(
        "mousedown",
        (event)=>{

            if(getRotationState())
                return;


            const hit = getHit();

            if(!hit)
                return;


            const cubie =
                cubies.find(
                    c => c.mesh === hit.object
                );


            const normal =
                hit.face.normal;


            if(Math.abs(normal.x) > 0.5){

                axis = "x";

            }
            else if(Math.abs(normal.y) > 0.5){

                axis = "y";

            }
            else{

                axis = "z";

            }


            value =
                cubie.grid[axis];


            layer =
                getLayer(
                    axis,
                    value
                );


            if(layer.length !== 9)
                return;


            rotationGroup.rotation.set(
                0,
                0,
                0
            );


            for(const c of layer){

                rotationGroup.attach(
                    c.mesh
                );

            }


            setSelectedLayer(layer);
            setRotationAxis(axis);


            startMouse.set(
                event.clientX,
                event.clientY
            );


            setDragging(true);

            dragging = true;

            controls.enabled = false;

        }
    );


    window.addEventListener(
        "mousemove",
        (event)=>{

            if(!dragging)
                return;


            let delta;


            if(axis === "x"){

                delta =
                    event.clientY - startMouse.y;

            }
            else{

                delta =
                    event.clientX - startMouse.x;

            }


            const angle =
                delta * 0.0012;


            rotationGroup.rotation[axis] =
                angle;


            setCurrentAngle(angle);

        }
    );


    window.addEventListener(
        "mouseup",
        ()=>{

            if(!dragging)
                return;


            dragging = false;

            controls.enabled = true;


            const angle =
                rotationGroup.rotation[axis];


            const turns =
                Math.round(
                    angle / (Math.PI / 2)
                );


            const finalAngle =
                turns * (Math.PI / 2);


            if(turns !== 0){

                rotationGroup.rotation[axis] =
                    finalAngle;


                rotationGroup.updateMatrixWorld(true);


                requestAnimationFrame(()=>{

                    finishDragRotation(
                        axis,
                        value,
                        turns > 0 ? 1 : -1
                    );

                });

            }
            else{

                for(const c of layer){

                    scene.attach(
                        c.mesh
                    );

                }


                rotationGroup.clear();


                rotationGroup.rotation.set(
                    0,
                    0,
                    0
                );

            }


            setCurrentAngle(0);
            setDragging(false);

        }
    );

}
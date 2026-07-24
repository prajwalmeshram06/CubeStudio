import * as THREE from "three";
import { camera, controls } from "../core/scene.js";
import { cubies } from "../cube/state.js";
import { highlightCubie, removeHighlight } from "../cube/color.js";
import { getMoveFromGesture } from "./gesture.js";
import { performMove } from "../cube/controller.js";

export const raycaster = new THREE.Raycaster();
export const mouse = new THREE.Vector2();

let hoveredMesh = null;
let isDragging = false;
let startX = 0;
let startY = 0;
let selectedFace = null;
let dragDirection = null;
let hasDragged = false;


function getFaceFromNormal(normal){

    if(normal.x > 0.5) return "right";
    if(normal.x < -0.5) return "left";

    if(normal.y > 0.5) return "top";
    if(normal.y < -0.5) return "bottom";

    if(normal.z > 0.5) return "front";
    if(normal.z < -0.5) return "back";

    return null;

}


function getIntersection(){

    raycaster.setFromCamera(
        mouse,
        camera
    );

    const meshes = cubies.map(c => c.mesh);

    const intersections =
        raycaster.intersectObjects(meshes);

    return intersections.length > 0
        ? intersections[0]
        : null;

}


export function initRaycaster(){

    window.addEventListener(
        "mousemove",
        (event)=>{

            mouse.x =
                (event.clientX / window.innerWidth) * 2 - 1;

            mouse.y =
                -(event.clientY / window.innerHeight) * 2 + 1;

        }
    );


    window.addEventListener(
        "mousedown",
        (event)=>{

            const hit = getIntersection();

            if(!hit)
                return;

            startX = event.clientX;
            startY = event.clientY;

            isDragging = true;

            selectedFace =
                getFaceFromNormal(hit.face.normal);

            dragDirection = null;

            controls.enabled = false;

        }
    );


    window.addEventListener(
        "mouseup",
        (event)=>{

            if(!isDragging)
                return;


            const deltaX =
                event.clientX - startX;

            const deltaY =
                event.clientY - startY;


            const distance =
                Math.sqrt(
                    deltaX * deltaX +
                    deltaY * deltaY
                );


            if(distance <= 20){

                isDragging = false;
                controls.enabled = true;

                return;

            }


            hasDragged = true;


            if(Math.abs(deltaX) > Math.abs(deltaY)){

                dragDirection =
                    deltaX > 0
                    ? "RIGHT"
                    : "LEFT";

            }
            else{

                dragDirection =
                    deltaY > 0
                    ? "DOWN"
                    : "UP";

            }


            const move =
                getMoveFromGesture(
                    selectedFace,
                    dragDirection
                );


            if(move){

                performMove(move);

            }


            isDragging = false;
            selectedFace = null;
            dragDirection = null;

            controls.enabled = true;

        }
    );


    window.addEventListener(
        "click",
        ()=>{

            if(hasDragged){

                hasDragged = false;
                return;

            }


            const clicked = getIntersection();

            if(clicked){

                getFaceFromNormal(
                    clicked.face.normal
                );

            }

        }
    );

}


export function updateRaycast(){

    raycaster.setFromCamera(
        mouse,
        camera
    );


    const meshes =
        cubies.map(c => c.mesh);


    const intersections =
        raycaster.intersectObjects(meshes);


    if(intersections.length > 0){

        const hitMesh =
            intersections[0].object;


        if(hoveredMesh !== hitMesh){

            if(hoveredMesh){

                removeHighlight(
                    cubies.find(
                        c => c.mesh === hoveredMesh
                    )
                );

            }


            hoveredMesh = hitMesh;


            highlightCubie(
                cubies.find(
                    c => c.mesh === hoveredMesh
                )
            );

        }

    }
    else{

        if(hoveredMesh){

            removeHighlight(
                cubies.find(
                    c => c.mesh === hoveredMesh
                )
            );


            hoveredMesh = null;

        }

    }

}
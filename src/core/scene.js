import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";

export let scene;
export let camera;
export let renderer;
export let rotationGroup;
export let controls;
export let container;


function createCamera() {

    container = document.querySelector("#game");

    camera = new THREE.PerspectiveCamera(
        50,
        container.clientWidth / container.clientHeight,
        0.1,
        1000
    );

    camera.position.set(6,6,6);
    camera.lookAt(0,0,0);

}


function createRenderer() {

    renderer = new THREE.WebGLRenderer({
        antialias:true
    });


    renderer.setPixelRatio(
        Math.min(window.devicePixelRatio,2)
    );


    renderer.setSize(
        container.clientWidth,
        container.clientHeight
    );


    renderer.setClearColor(0x000000);


    renderer.shadowMap.enabled = true;


    container.appendChild(renderer.domElement);

}


function createLight() {


    const ambientLight =
    new THREE.AmbientLight(
        0xffffff,
        1.2
    );

    scene.add(ambientLight);



    const hemisphereLight =
    new THREE.HemisphereLight(
        0xffffff,
        0x444444,
        1.5
    );

    scene.add(hemisphereLight);



    const directionalLight =
    new THREE.DirectionalLight(
        0xffffff,
        2
    );


    directionalLight.position.set(
        5,
        8,
        5
    );


    directionalLight.castShadow = true;


    scene.add(directionalLight);



    const fillLight =
    new THREE.DirectionalLight(
        0xffffff,
        0.8
    );


    fillLight.position.set(
        -5,
        2,
        -5
    );


    scene.add(fillLight);

}



export function render() {

    renderer.render(
        scene,
        camera
    );

}



function createControls() {

    controls =
    new OrbitControls(
        camera,
        renderer.domElement
    );


    controls.enableDamping = true;

    controls.dampingFactor = 0.08;


    controls.minDistance = 4;

    controls.maxDistance = 12;


    controls.maxPolarAngle = Math.PI;

    controls.minPolarAngle = 0;


    controls.target.set(
        0,
        0,
        0
    );


    controls.update();

}



export function initScene() {

    scene = new THREE.Scene();


    rotationGroup =
    new THREE.Group();


    scene.add(
        rotationGroup
    );


    createCamera();

    createRenderer();

    createControls();

    createLight();

}



export function moveRenderer(target){


    container =
    document.querySelector(target);


    container.appendChild(
        renderer.domElement
    );


    camera.aspect =
    container.clientWidth /
    container.clientHeight;


    camera.updateProjectionMatrix();


    renderer.setSize(
        container.clientWidth,
        container.clientHeight
    );

}
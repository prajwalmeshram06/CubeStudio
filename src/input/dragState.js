export let isDragging = false;

export let selectedLayer = [];
export let rotationAxis = null;

export let startPoint = null;
export let currentAngle = 0;


export function setDragging(value){
    isDragging = value;
}


export function setSelectedLayer(layer){
    selectedLayer = layer;
}


export function setRotationAxis(axis){
    rotationAxis = axis;
}


export function setStartPoint(point){
    startPoint = point;
}


export function setCurrentAngle(angle){
    currentAngle = angle;
}
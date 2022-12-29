import * as THREE from 'three';
import {Vector3} from 'three';
import {OrbitControls} from "three/examples/jsm/controls/OrbitControls.js";
import {GLTFLoader} from 'three/examples/jsm/loaders/GLTFLoader.js';
import {USDZExporter} from "three/examples/jsm/exporters/USDZExporter";
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js';


import Stats from "three/examples/jsm/libs/stats.module";
import {HTMLElements} from "./elemetsUI.js"

const objectURL = new URL("../models/web-you.glb", import.meta.url);


let canvas, scene, camera, renderer, controls, light, stats, model, usdzURL, modelID;
let canvasWidth ;
let canvasHeight;
window.addEventListener('resize', onWindowResize, false);

init();


function createLight(scene) {
    light = new THREE.SpotLight(0xc3c3c3, 0.2);
    light.position.set(2, 2, 2);
    light.castShadow = true;
    light.shadow.bias = -0.001;
    light.shadow.mapSize.width = 1024 * 4;
    light.shadow.mapSize.height = 1024 * 4;
    scene.add(light);

    const hemiLight = new THREE.HemisphereLight(0xc3c3c3, 0x040404, 0.2);
    scene.add(hemiLight);
}

function createCamera() {
    camera = new THREE.PerspectiveCamera(60, canvasWidth / canvasHeight, 0.1, 5000);
    camera.position.set(-2.6, 1, 0)

}

function createFPSCounter(canvas) {
    stats = new Stats();
    canvas.appendChild(stats.dom);
}

function createScene() {
    scene = new THREE.Scene();
    const pmremGenerator = new THREE.PMREMGenerator( renderer );
    scene.environment = pmremGenerator.fromScene( new RoomEnvironment(), 0.04 ).texture;
    scene.background = new THREE.Color(0xf0f0f0);
}

function createRenderer(canvas) {
    renderer = new THREE.WebGLRenderer({antialias: true});
    renderer.setSize(canvasWidth, canvasHeight);
    renderer.shadowMap.renderReverseSided = true;
    renderer.shadowMap.renderSingleSided = false;
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.shadowMap.enabled = true;
    renderer.gammaOutput = true;
    renderer.gammaFactor = 2;
    renderer.outputEncoding = THREE.sRGBEncoding;

    canvas.appendChild(renderer.domElement);
}

function createOrbitControl(camera, rendererDom) {
    controls = new OrbitControls(camera, rendererDom);
    recenterCamera()
}

async function getGLBModel(objURL) {
    const loader = new GLTFLoader();
    let dataGLB = await loader.loadAsync(objURL);
    model = dataGLB.scene;
    model.name = "object"
    model.traverse(n => {
        if (n.isMesh) {
            n.castShadow = true;
            n.receiveShadow = true;
            if (n.material.map) n.material.map.anisotropy = 1;
        }
    })
    return model;
}

async function createUSDZFromGLB() {
    const exporter = new USDZExporter();
    const arraybuffer = await exporter.parse(model);
    const usdz = new Blob([arraybuffer], {type: 'application/octet-stream'});
    console.log(URL.createObjectURL(usdz));

    if(document.body.contains(document.getElementById('arButton'))){
let link = document.getElementById('arButton');
        link.href = URL.createObjectURL(usdz);
    }
    return URL.createObjectURL(usdz);
}

function animate() {
    renderer.render(scene, camera);
    light.position.set(
        camera.position.x - 1,
        camera.position.y + 1,
        camera.position.z - 1,
    );
    //stats.update();
    requestAnimationFrame(animate);
}

function onWindowResize() {
    camera.aspect = canvas.clientWidth / canvas.clientHeight;
    camera.updateProjectionMatrix();
    console.log(canvas.clientWidth + " "+ canvas.clientHeight);
    renderer.setSize(canvas.clientWidth, canvas.clientHeight);
}

export async function changeObject(button, modelURL){
    const slides = document.querySelectorAll(".slide");
    slides.forEach((element) => {
        element.classList.remove("selected");
    });
    button.className = "slide selected"
    removeEntity();
    await addEntity(modelURL);
    recenterCamera();
}

function removeEntity() {
    var selectedObject = scene.getObjectByName("object");
    scene.remove( selectedObject );
    animate();
}

async function addEntity(objURL){
    model = await getGLBModel(objURL);
    scene.add(model);
    usdzURL = await createUSDZFromGLB()
}

function recenterCamera(){
    let boundingBox = new THREE.Box3().setFromObject(model);
    camera.lookAt(model.position.x, model.position.y + (boundingBox.max.y-boundingBox.min.y)/ 2, model.position.z);
    controls.target.copy(model.position).add(new Vector3(0, (boundingBox.max.y-boundingBox.min.y)/ 2, 0));
}

async function init() {
    canvas = document.getElementById("web-you-3d-container");

     canvasWidth = canvas.clientWidth;
     canvasHeight = canvas.clientHeight;
    modelID = canvas.dataset.uuid;
    console.log(canvas.clientWidth);
    createRenderer(canvas);
    createScene();
    createCamera();
    //createFPSCounter(canvas);
    createLight(scene);

    await addEntity(objectURL.href);


    console.log(usdzURL.href);
    createOrbitControl(camera, renderer.domElement);

    const htmlElements = new HTMLElements();
    htmlElements.create(canvas, usdzURL);
    animate();

}

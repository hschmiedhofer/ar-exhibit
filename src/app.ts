import "@babylonjs/core/Debug/debugLayer";
import "@babylonjs/inspector";
import "@babylonjs/loaders/glTF";
import { setDebugLayerShortcut } from "./tools";
import { setupStandardScene } from "./scene";
import { setupXR } from "./xr";
import { Engine, Scene } from "@babylonjs/core";

async function start() {
    // create the canvas html element and attach it to the webpage
    const canvas = document.createElement("canvas");
    canvas.style.width = "100%";
    canvas.style.height = "100%";
    canvas.id = "gameCanvas";
    document.body.appendChild(canvas);

    const overlayDiv = document.createElement("div");
    overlayDiv.className = "dom-overlay-container";
    overlayDiv.innerText = "Status: Tracking..."; // example status message
    overlayDiv.style.position = "absolute";
    overlayDiv.style.bottom = "10px";
    overlayDiv.style.left = "10px";
    overlayDiv.style.padding = "10px";
    overlayDiv.style.backgroundColor = "rgba(255, 255, 255, 0.8)"; // semi-transparent background
    overlayDiv.style.borderRadius = "5px";
    document.body.appendChild(overlayDiv);

    const engine = new Engine(canvas, true);
    const scene = new Scene(engine);

    // setup camera and other stuff
    setupStandardScene(canvas, scene);

    // initialize babylon scene and engine
    await setupXR(scene, "painting-004.glb", "qr_hschmiedhofer.png");

    // set debug layer
    setDebugLayerShortcut(scene, false);

    //# start
    // run the main render loop
    engine.runRenderLoop(() => {
        scene.render();
    });
}

start();

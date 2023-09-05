import "@babylonjs/core/Debug/debugLayer";
import "@babylonjs/inspector";
import "@babylonjs/loaders/glTF";
import { setDebugLayerShortcut } from "./tools";
import { setupStandardScene } from "./scene";
import { setupXR } from "./xr";
import { Engine, Scene } from "@babylonjs/core";
import { createArOverlay, createCanvas } from "./canvas";

async function start() {
    // create the canvas html element and attach it to the webpage
    const canvas = createCanvas();

    // create engine from canvas
    const engine = new Engine(canvas, true);

    // create scene from engine
    const scene = new Scene(engine);

    // setup camera and other stuff
    setupStandardScene(canvas, scene);

    const domOverlayClassName = "dom-overlay-container";

    // create DOM overlay for AR viewer (buttons, text, etc.)
    const elements = createArOverlay(scene, domOverlayClassName);

    // initialize babylon scene and engine
    await setupXR(scene, "painting-005.glb", "qr_hschmiedhofer_002.png", 0.18, domOverlayClassName);

    // set debug layer (alt-shift-i for babylonjs debug mode)
    setDebugLayerShortcut(scene, false);

    // run the main render loop
    engine.runRenderLoop(() => {
        scene.render();
    });
}

start(); // note: this should be called asynchronously. but do we care?

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

    // Create the main container div
    const domOverlayContainer = document.createElement("div");
    domOverlayContainer.className = "dom-overlay-container";
    domOverlayContainer.style.position = "absolute";
    domOverlayContainer.style.bottom = "10px";
    domOverlayContainer.style.left = "10px";
    domOverlayContainer.style.padding = "15px";
    domOverlayContainer.style.backgroundColor = "rgba(255, 255, 255, 0.8)"; // semi-transparent white
    domOverlayContainer.style.borderRadius = "12px";
    domOverlayContainer.style.display = "flex";
    domOverlayContainer.style.flexDirection = "column";
    domOverlayContainer.style.gap = "10px";

    // Create a text element
    const statusText = document.createElement("p");
    statusText.innerText = "Status: AR mode active";
    statusText.style.margin = "0";

    // Create the swap button
    const swapButton = document.createElement("button");
    swapButton.innerText = "Swap Model";
    swapButton.style.width = "150px";
    swapButton.style.height = "50px";
    swapButton.style.fontSize = "18px";
    swapButton.style.backgroundColor = "#4CAF50";
    swapButton.style.color = "white";
    swapButton.style.border = "none";
    swapButton.style.cursor = "pointer";
    swapButton.style.borderRadius = "12px";
    swapButton.addEventListener("mouseover", function () {
        swapButton.style.backgroundColor = "#45a049";
    });
    swapButton.addEventListener("mouseout", function () {
        swapButton.style.backgroundColor = "#4CAF50";
    });

    swapButton.addEventListener("click", function () {
        const mirror = scene.getMeshByName("mirror");
        const painting = scene.getMeshByName("painting");
        mirror.isVisible = !mirror.isVisible;
        painting.isVisible = !painting.isVisible;
    });

    // Append text and button to the container
    domOverlayContainer.appendChild(statusText);
    domOverlayContainer.appendChild(swapButton);

    // Append the main container to the body
    document.body.appendChild(domOverlayContainer);

    const engine = new Engine(canvas, true);
    const scene = new Scene(engine);

    // setup camera and other stuff
    setupStandardScene(canvas, scene);

    // initialize babylon scene and engine
    await setupXR(scene, "painting-005.glb", "qr_hschmiedhofer.png", 0.15, ".dom-overlay-container");

    // set debug layer
    setDebugLayerShortcut(scene, false);

    //# start
    // run the main render loop
    engine.runRenderLoop(() => {
        scene.render();
    });
}

start();

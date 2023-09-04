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

    const swapButton = document.createElement("button");
    swapButton.innerText = "Swap Model";
    swapButton.style.position = "fixed";
    swapButton.style.top = "10px";
    swapButton.style.right = "10px";
    swapButton.style.width = "150px"; // Set width of the button
    swapButton.style.height = "50px"; // Set height of the button
    swapButton.style.fontSize = "18px"; // Set font size for the button's text
    swapButton.style.backgroundColor = "#4CAF50"; // Set background color
    swapButton.style.color = "white"; // Set text color
    swapButton.style.border = "none"; // Remove border
    swapButton.style.cursor = "pointer"; // Change cursor to pointer on hover
    swapButton.style.borderRadius = "12px"; // Round the button corners
    swapButton.addEventListener("mouseover", function () {
        // Change background color on hover
        swapButton.style.backgroundColor = "#45a049";
    });
    swapButton.addEventListener("mouseout", function () {
        // Revert background color when not hovering
        swapButton.style.backgroundColor = "#4CAF50";
    });
    document.body.appendChild(swapButton);

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

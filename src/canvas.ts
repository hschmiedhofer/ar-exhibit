import { Scene } from "@babylonjs/core";

export function createCanvas() {
    const canvas = document.createElement("canvas");
    canvas.style.width = "100%";
    canvas.style.height = "100%";
    canvas.id = "gameCanvas";
    document.body.appendChild(canvas);

    return canvas;
}

export function createArOverlay(
    scene: Scene,
    domOverlayClass: string
): { button: HTMLButtonElement; statusText: HTMLParagraphElement } {
    // Create the main container div
    const domOverlayContainer = document.createElement("div");
    domOverlayContainer.className = domOverlayClass;
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

    // Append text and button to the container
    domOverlayContainer.appendChild(statusText);
    domOverlayContainer.appendChild(swapButton);

    // Append the main container to the body
    document.body.appendChild(domOverlayContainer);

    swapButton.addEventListener("mouseover", function () {
        swapButton.style.backgroundColor = "#45a049";
    });
    swapButton.addEventListener("mouseout", function () {
        swapButton.style.backgroundColor = "#4CAF50";
    });

    swapButton.addEventListener("click", function () {
        const painting = scene.getMeshByName("painting");
        const frame = scene.getMeshByName("frame");
        const spaceship = scene.getMeshByName("valkyrie_mesh");
        painting.isVisible = !painting.isVisible;
        frame.isVisible = !frame.isVisible;
        spaceship.isVisible = !spaceship.isVisible;
    });

    return { button: swapButton, statusText: statusText };
}

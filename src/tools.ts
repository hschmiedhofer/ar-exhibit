import { Scene } from "@babylonjs/core";

export function setDebugLayerShortcut(scene: Scene, on: boolean) {
    // hide/show the Inspector
    if (on === true) scene.debugLayer.show();
    window.addEventListener("keydown", (ev) => {
        // Shift+Ctrl+Alt+I
        if (ev.shiftKey && ev.ctrlKey && ev.altKey && ev.keyCode === 73) {
            if (scene.debugLayer.isVisible()) {
                scene.debugLayer.hide();
            } else {
                scene.debugLayer.show();
            }
        }
    });
}

export function limitToNrOfDecimals(num: number, nrDecimals: number): number {
    return parseFloat(num.toFixed(nrDecimals));
}

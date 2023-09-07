import { WebXRFeaturesManager, WebXRDomOverlay } from "@babylonjs/core";

export function addDomOverlayFeature(featuresManager: WebXRFeaturesManager, element: string): WebXRDomOverlay {
    return featuresManager.enableFeature(WebXRDomOverlay, "latest", { element: element }) as WebXRDomOverlay;
}

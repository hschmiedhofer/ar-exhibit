import {
    Scene,
    WebXRDefaultExperience,
    WebXRDefaultExperienceOptions,
    TransformNode,
    SceneLoader,
    Quaternion,
    WebXRFeatureName,
    WebXRImageTracking,
    Axis,
    Space,
    WebXRDomOverlay,
} from "@babylonjs/core";

export async function setupXR(scene: Scene): Promise<WebXRDefaultExperience> {
    const options: WebXRDefaultExperienceOptions = {
        uiOptions: {
            sessionMode: "immersive-ar",
        },
    };
    const env = scene.createDefaultEnvironment({ createGround: false, createSkybox: false });

    const root = new TransformNode("root", scene);
    root.setEnabled(true);

    const model = await SceneLoader.ImportMeshAsync("", "", "painting-004.glb", scene);

    model.meshes.forEach((m) => {
        if (m.name === "frame") m.parent = root;
        if (m.name === "mirror") m.parent = root;
        if (m.name === "painting") m.dispose(true, true);
    });

    // model.meshes[1].parent = root; //todo necessary?
    root.rotationQuaternion = new Quaternion();

    const xr = await scene.createDefaultXRExperienceAsync(options);

    const featuresManager = xr.baseExperience.featuresManager;
    const imageTracking = featuresManager.enableFeature(WebXRFeatureName.IMAGE_TRACKING, "latest", {
        images: [
            {
                src: "qr_hschmiedhofer.png",
                estimatedRealWorldWidth: 0.15,
            },
        ],
    }) as WebXRImageTracking;

    imageTracking.onTrackedImageUpdatedObservable.add((image) => {
        // root.setPreTransformMatrix(image.transformationMatrix);
        image.transformationMatrix.decompose(root.scaling, root.rotationQuaternion, root.position);
        root.setEnabled(true);
        root.translate(Axis.Y, 0.1, Space.LOCAL);
    });

    featuresManager.enableFeature(WebXRDomOverlay, "latest", { element: ".dom-overlay-container" });

    return xr;
}

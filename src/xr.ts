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

export async function setupXR(
    scene: Scene,
    filenameGlb: string,
    filenameTrackingImage: string
): Promise<WebXRDefaultExperience> {
    const options: WebXRDefaultExperienceOptions = {
        uiOptions: {
            sessionMode: "immersive-ar",
        },
    };
    const env = scene.createDefaultEnvironment({ createGround: false, createSkybox: false });

    const root = new TransformNode("root", scene);
    root.setEnabled(true);

    //* load meshes from file and put them on common parent
    const model = await SceneLoader.ImportMeshAsync("", "", filenameGlb, scene);
    model.meshes.forEach((m) => {
        if (m.name === "frame") m.parent = root;
        // if (m.name === "painting") m.dispose(true, true);
        if (m.name === "painting") m.parent = root;
        if (m.name === "mirror") {
            m.parent = root;
            m.isVisible = false;
        }
    });
    root.rotationQuaternion = new Quaternion();

    //* create default experience helper
    const defaultXrExperienceHelper = await scene.createDefaultXRExperienceAsync(options);

    //* create feature manager
    const featuresManager = defaultXrExperienceHelper.baseExperience.featuresManager;

    //# add and setup image tracking
    const imageTracking = featuresManager.enableFeature(WebXRFeatureName.IMAGE_TRACKING, "latest", {
        images: [
            {
                src: filenameTrackingImage,
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

    //# add DOM overlay
    featuresManager.enableFeature(WebXRDomOverlay, "latest", { element: ".dom-overlay-container" });

    //# add light estimation
    const lightEstimationFeature = featuresManager.enableFeature(WebXRFeatureName.LIGHT_ESTIMATION, "latest", {
        createDirectionalLightSource: true,
        disableCubeMapReflection: false,
        setSceneEnvironmentTexture: true,
    });
    return defaultXrExperienceHelper;
}

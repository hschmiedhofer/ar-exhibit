import {
    Scene,
    WebXRDefaultExperience,
    WebXRDefaultExperienceOptions,
    TransformNode,
    SceneLoader,
    Quaternion,
    WebXRImageTracking,
    WebXRDomOverlay,
    WebXRLightEstimation,
    Vector3,
} from "@babylonjs/core";
import { addImageTrackingFeature } from "./AR/arImageTracking";
import { addLightEstimationFeature, addShadowSystem } from "./AR/arLightEstimation";
import { addDomOverlayFeature } from "./AR/arDomOverlay";

export async function setupXR(
    scene: Scene,
    filenameGlb: string,
    filenameTrackingImage: string,
    widthTrackingImage: number,
    domOverlayClass: string
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

    const model2 = await SceneLoader.ImportMeshAsync("", "", "spaceship.glb", scene);
    model2.meshes.forEach((m) => {
        if (m.name === "valkyrie_mesh") {
            m.position.y = 2.3;
            m.parent = root;
            m.isVisible = false;
            m.scaling = new Vector3(10, 10, 10);
        }
    });

    root.rotationQuaternion = new Quaternion();

    //* create default experience helper
    const defaultXrExperienceHelper = await scene.createDefaultXRExperienceAsync(options);

    //* create feature manager
    const featuresManager = defaultXrExperienceHelper.baseExperience.featuresManager;

    //# add and setup image tracking
    const imageTrackingFeature: WebXRImageTracking = addImageTrackingFeature(
        featuresManager,
        filenameTrackingImage,
        widthTrackingImage,
        root
    );

    //# add DOM overlay
    const featDomOverlay: WebXRDomOverlay = addDomOverlayFeature(featuresManager, domOverlayClass);

    //# add light estimation
    const lightEstimationFeature: WebXRLightEstimation = addLightEstimationFeature(featuresManager, root);

    //# install shadow system
    addShadowSystem(scene, root, lightEstimationFeature);
    // addShadowSystem(scene, root);

    return defaultXrExperienceHelper;
}

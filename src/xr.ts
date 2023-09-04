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
    ShadowGenerator,
    WebXRLightEstimation,
    MeshBuilder,
    StandardMaterial,
    Color3,
} from "@babylonjs/core";
import { ShadowOnlyMaterial } from "@babylonjs/materials";

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

    // const shadowCatcher = MeshBuilder.CreatePlane("shadowcatcher", { size: 5 }, scene);
    const shadowCatcher = MeshBuilder.CreateBox("shadowcatcher", { width: 5, depth: 3, height: 0.01 }, scene);
    // var ground = BABYLON.Mesh.CreatePlane('ground', 1000, scene)
    // ground.rotation.x = Math.PI / 2
    // shadowCatcher.material = new ShadowOnlyMaterial("shadowOnly", scene);
    shadowCatcher.material = new StandardMaterial("test", scene);
    (shadowCatcher.material as StandardMaterial).diffuseColor = Color3.Green();
    shadowCatcher.receiveShadows = true;
    shadowCatcher.parent = root;

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
        // disableCubeMapReflection: false,
        // setSceneEnvironmentTexture: true,
    }) as WebXRLightEstimation;

    const shadowGenerator = new ShadowGenerator(512, lightEstimationFeature.directionalLight);
    shadowGenerator.useBlurExponentialShadowMap = true;
    shadowGenerator.setDarkness(0.1);
    shadowGenerator.getShadowMap().renderList.push(scene.getMeshByName("frame"));

    return defaultXrExperienceHelper;
}

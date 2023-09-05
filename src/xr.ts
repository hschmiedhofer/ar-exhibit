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
    DirectionalLight,
    Vector3,
    WebXRFeaturesManager,
} from "@babylonjs/core";
import { ShadowOnlyMaterial } from "@babylonjs/materials";

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
    // const lightEstimationFeature: WebXRLightEstimation = addLightEstimationFeature(featuresManager);

    //# install shadow system
    addShadowSystem(scene, root);

    return defaultXrExperienceHelper;
}

function addDomOverlayFeature(featuresManager: WebXRFeaturesManager, element: string): WebXRDomOverlay {
    return featuresManager.enableFeature(WebXRDomOverlay, "latest", { element: element }) as WebXRDomOverlay;
}

function addShadowSystem(scene: Scene, rootNode: TransformNode) {
    // const shadowGenerator = new ShadowGenerator(512, feature.directionalLight);
    // shadowGenerator.useBlurExponentialShadowMap = true;
    // shadowGenerator.setDarkness(0.1);
    // shadowGenerator.getShadowMap().renderList.push(scene.getMeshByName("frame"));

    // //! add shadowcatcher
    // // const shadowCatcher = MeshBuilder.CreatePlane("shadowcatcher", { size: 5 }, scene);
    // const shadowCatcher = MeshBuilder.CreateBox("shadowcatcher", { width: 5, depth: 3, height: 0.01 }, scene);
    // // const shadowCatcher = MeshBuilder.CreatePlane("ground", { size: 4 }, scene);
    // // shadowCatcher.rotation.x = Math.PI / 2;
    // // shadowCatcher.material = new ShadowOnlyMaterial("shadowOnly", scene);
    // shadowCatcher.material = new StandardMaterial("test", scene);
    // (shadowCatcher.material as StandardMaterial).diffuseColor = Color3.Green();
    // shadowCatcher.receiveShadows = true;
    // shadowCatcher.parent = rootNode;

    // //! add test light

    // create light source
    const directionalLight = new DirectionalLight("dirLight", new Vector3(1, -1, -1), scene);
    directionalLight.parent = rootNode;

    // get meshes that cast shadows
    const frame = scene.getMeshByName("frame");
    console.log(frame);

    // create a shadow catcher
    const shadowCatcher = MeshBuilder.CreateBox("shadowcatcher", { width: 2, depth: 1.5, height: 0.01 }, scene);
    shadowCatcher.parent = rootNode;

    // create and apply shadow catcher material
    const shadowCatcherMaterial = new ShadowOnlyMaterial("shadowOnlyMat", scene);
    shadowCatcher.material = shadowCatcherMaterial;

    // make light source a shadow generator
    const sg = new ShadowGenerator(512, directionalLight);
    sg.useBlurExponentialShadowMap = true;
    // sg.setDarkness(0.7);

    // ad shadow casters to shadow generator / light source
    sg.addShadowCaster(frame);

    // make shadow catcher receive shadows
    shadowCatcher.receiveShadows = true;
}

function addLightEstimationFeature(featuresManager: WebXRFeaturesManager): WebXRLightEstimation {
    const feature = featuresManager.enableFeature(WebXRFeatureName.LIGHT_ESTIMATION, "latest", {
        createDirectionalLightSource: true,
        // disableCubeMapReflection: false,
        // setSceneEnvironmentTexture: true,
    }) as WebXRLightEstimation;

    return feature;
}

function addImageTrackingFeature(
    featuresManager: WebXRFeaturesManager,
    trackingImage: string,
    estimatedWidth: number,
    rootNode: TransformNode
): WebXRImageTracking {
    const feature = featuresManager.enableFeature(WebXRFeatureName.IMAGE_TRACKING, "latest", {
        images: [
            {
                src: trackingImage,
                estimatedRealWorldWidth: estimatedWidth,
            },
        ],
    }) as WebXRImageTracking;

    feature.onTrackedImageUpdatedObservable.add((image) => {
        // root.setPreTransformMatrix(image.transformationMatrix);
        image.transformationMatrix.decompose(rootNode.scaling, rootNode.rotationQuaternion, rootNode.position);
        rootNode.setEnabled(true);
        rootNode.translate(Axis.Y, 0.1, Space.LOCAL);
    });

    return feature;
}

import {
    DirectionalLight,
    IWebXRLightEstimationOptions,
    MeshBuilder,
    Scene,
    ShadowGenerator,
    TransformNode,
    Vector3,
    WebXRFeatureName,
    WebXRFeaturesManager,
    WebXRLightEstimation,
} from "@babylonjs/core";
import { limitToNrOfDecimals } from "../tools";
import { ShadowOnlyMaterial } from "@babylonjs/materials";

export function addLightEstimationFeature(
    featuresManager: WebXRFeaturesManager,
    rootNode: TransformNode
): WebXRLightEstimation {
    const options: IWebXRLightEstimationOptions = {
        createDirectionalLightSource: true,
        // disableCubeMapReflection: false,
        // setSceneEnvironmentTexture: true,
    };
    const feature = featuresManager.enableFeature(
        WebXRFeatureName.LIGHT_ESTIMATION,
        "latest",
        options
    ) as WebXRLightEstimation;

    feature.onReflectionCubeMapUpdatedObservable.add(() => {
        const dl = feature.directionalLight;
        dl.parent = rootNode;
        dl.range = 100;
        console.log(
            limitToNrOfDecimals(dl.direction.x, 1),
            limitToNrOfDecimals(dl.direction.y, 1),
            limitToNrOfDecimals(dl.direction.z, 1)
        );
        console.log("intensity:", dl.intensity);
        console.log("range:", dl.range);
    });

    return feature;
}

export function addShadowSystem(scene: Scene, rootNode: TransformNode, lightEstimationFeature?: WebXRLightEstimation) {
    // //! add test light

    // get meshes that cast shadows
    const frame = scene.getMeshByName("frame");

    // create a shadow catcher
    const shadowCatcher = MeshBuilder.CreateBox("shadowcatcher", { width: 2, depth: 1.5, height: 0.01 }, scene);
    shadowCatcher.parent = rootNode;

    // create and apply shadow catcher material
    const shadowCatcherMaterial = new ShadowOnlyMaterial("shadowOnlyMat", scene);
    shadowCatcher.material = shadowCatcherMaterial;

    // make light source a shadow generator

    let directionalLight: DirectionalLight;
    if (!lightEstimationFeature) {
        // create light source
        directionalLight = new DirectionalLight("dirLight", new Vector3(1, -1, -1), scene);
        directionalLight.parent = rootNode;
    } else {
        directionalLight = lightEstimationFeature.directionalLight;
    }

    const sg = new ShadowGenerator(1024, directionalLight);
    sg.useBlurExponentialShadowMap = true;
    // sg.enableSoftTransparentShadow = true;
    // sg.usePoissonSampling = true;
    sg.setDarkness(0.6);

    // ad shadow casters to shadow generator / light source
    sg.addShadowCaster(frame);

    // make shadow catcher receive shadows
    shadowCatcher.receiveShadows = true;
}

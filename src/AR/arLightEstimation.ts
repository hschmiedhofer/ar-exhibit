import {
    AbstractMesh,
    DirectionalLight,
    IWebXRLightEstimationOptions,
    Mesh,
    MeshBuilder,
    Scene,
    ShadowGenerator,
    TransformNode,
    Vector3,
    WebXRFeatureName,
    WebXRFeaturesManager,
    WebXRLightEstimation,
} from "@babylonjs/core";
import { ShadowOnlyMaterial } from "@babylonjs/materials";

export function addLightEstimationFeature(
    featuresManager: WebXRFeaturesManager,
    dirLightOnScene: DirectionalLight
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

    // as soon as we get an update from the system...
    feature.onReflectionCubeMapUpdatedObservable.add(() => {
        const dlFromPhone = feature.directionalLight;

        dirLightOnScene.direction = new Vector3(
            dlFromPhone.direction.x,
            dlFromPhone.direction.y,
            dlFromPhone.direction.z
        );

        // dl.parent = rootNode;
        // dl.range = 100;
        // console.log(
        //     limitToNrOfDecimals(dl.direction.x, 1),
        //     limitToNrOfDecimals(dl.direction.y, 1),
        //     limitToNrOfDecimals(dl.direction.z, 1)
        // );
        // console.log("intensity:", dl.intensity);
        // console.log("range:", dl.range);
    });

    return feature;
}

export function addShadowSystem(
    scene: Scene,
    rootNode: TransformNode,
    dirLightName: string,
    shadowCasters: AbstractMesh
) {
    // create a shadow catcher
    const shadowCatcher = MeshBuilder.CreateBox("shadowcatcher", { width: 2, depth: 1.5, height: 0.01 }, scene);
    shadowCatcher.parent = rootNode;

    // create and apply shadow catcher material
    const shadowCatcherMaterial = new ShadowOnlyMaterial("shadowOnlyMat", scene);
    shadowCatcher.material = shadowCatcherMaterial;

    // make light source a shadow generator

    // create light source
    const directionalLight = new DirectionalLight(dirLightName, new Vector3(1, -1, -1), scene);
    directionalLight.parent = rootNode;

    const sg = new ShadowGenerator(1024, directionalLight);
    sg.useBlurExponentialShadowMap = true;
    // sg.enableSoftTransparentShadow = true;
    // sg.usePoissonSampling = true;
    sg.setDarkness(0.6);

    // ad shadow casters to shadow generator / light source
    sg.addShadowCaster(shadowCasters);

    // make shadow catcher receive shadows
    shadowCatcher.receiveShadows = true;
}

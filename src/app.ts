import "@babylonjs/core/Debug/debugLayer";
import {
    Axis,
    Engine,
    Quaternion,
    Scene,
    SceneLoader,
    Space,
    TransformNode,
    WebXRDefaultExperience,
    WebXRDefaultExperienceOptions,
    WebXRFeatureName,
    WebXRImageTracking,
} from "@babylonjs/core";
import "@babylonjs/loaders/glTF";

async function setupXR(scene: Scene, options: WebXRDefaultExperienceOptions): Promise<WebXRDefaultExperience> {
    scene.createDefaultEnvironment({ createGround: false, createSkybox: false });

    const root = new TransformNode("root", scene);
    // root.setEnabled(false);

    const model = await SceneLoader.ImportMeshAsync("", "", "painting-002.glb", scene);
    model.meshes[0].parent = root;
    model.meshes[1].parent = root;
    root.rotationQuaternion = new Quaternion();

    const xr = await scene.createDefaultXRExperienceAsync(options);

    const featuresManager = xr.baseExperience.featuresManager;
    const imageTracking = featuresManager.enableFeature(WebXRFeatureName.IMAGE_TRACKING, "latest", {
        images: [
            {
                // src: "https://cdn.babylonjs.com/imageTracking.png",
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

    return xr;
}

async function init(scene: Scene): Promise<Scene> {
    await setupXR(scene, {
        uiOptions: {
            sessionMode: "immersive-ar",
        },
    });
    return scene;
}

function setDebugLayerShortcut(scene: Scene, on: boolean) {
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

async function start() {
    // create the canvas html element and attach it to the webpage
    const canvas = document.createElement("canvas");
    canvas.style.width = "100%";
    canvas.style.height = "100%";
    canvas.id = "gameCanvas";
    document.body.appendChild(canvas);

    const engine = new Engine(canvas, true);

    const scene = new Scene(engine);

    // initialize babylon scene and engine
    await init(scene);

    console.log("scene initialized");

    //# start
    // set debug layer
    // setDebugLayerShortcut(scene, false);
    // run the main render loop
    engine.runRenderLoop(() => {
        scene.render();
    });
}

start();

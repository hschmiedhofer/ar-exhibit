import "@babylonjs/core/Debug/debugLayer";
import "@babylonjs/inspector";
import {
    ArcRotateCamera,
    Axis,
    Engine,
    FreeCamera,
    HemisphericLight,
    MeshBuilder,
    Quaternion,
    Scene,
    SceneLoader,
    Space,
    Tools,
    TransformNode,
    Vector3,
    WebXRDefaultExperience,
    WebXRDefaultExperienceOptions,
    WebXRFeatureName,
    WebXRImageTracking,
} from "@babylonjs/core";
import "@babylonjs/loaders/glTF";

async function setupXR(scene: Scene): Promise<WebXRDefaultExperience> {
    const options: WebXRDefaultExperienceOptions = {
        uiOptions: {
            sessionMode: "immersive-ar",
        },
    };
    scene.createDefaultEnvironment({ createGround: false, createSkybox: false });

    const root = new TransformNode("root", scene);
    root.setEnabled(true);

    const model = await SceneLoader.ImportMeshAsync("", "", "painting-003.glb", scene);
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

// async function init(scene: Scene): Promise<Scene> {
//     await setupXR(scene, {
//         uiOptions: {
//             sessionMode: "immersive-ar",
//         },
//     });
//     return scene;
// }

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

function setupStandardScene(canvas: HTMLCanvasElement, scene: Scene) {
    const camera: ArcRotateCamera = new ArcRotateCamera(
        "Camera",
        Tools.ToRadians(270),
        Tools.ToRadians(0),
        4,
        Vector3.Zero(),
        scene
    );

    camera.wheelPrecision = 100;
    camera.lowerRadiusLimit = 2;
    // const camera = new FreeCamera("freeCam", new Vector3(0, 3, 0), scene, true);
    camera.attachControl(canvas, true);
    const light1: HemisphericLight = new HemisphericLight("light1", new Vector3(1, 1, 0), scene);

    // MeshBuilder.CreateBox("box", { size: 0.3 }, scene);
    MeshBuilder.CreateBox("box", { width: 0.6, depth: 0.4, height: 0.1 });
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

    // setup camera and other stuff
    setupStandardScene(canvas, scene);

    // initialize babylon scene and engine
    await setupXR(scene);

    // set debug layer
    setDebugLayerShortcut(scene, false);

    //# start
    // run the main render loop
    engine.runRenderLoop(() => {
        scene.render();
    });
}

start();

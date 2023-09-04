import "@babylonjs/core/Debug/debugLayer";
import "@babylonjs/inspector";
import {
    ArcRotateCamera,
    Axis,
    Color3,
    Engine,
    FreeCamera,
    HemisphericLight,
    Material,
    MeshBuilder,
    Quaternion,
    Scene,
    SceneLoader,
    Space,
    StandardMaterial,
    Tools,
    TransformNode,
    Vector3,
    WebXRDefaultExperience,
    WebXRDefaultExperienceOptions,
    WebXRDomOverlay,
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
    camera.attachControl(canvas, true);

    const light1: HemisphericLight = new HemisphericLight("light1", new Vector3(1, 1, 0), scene);

    // MeshBuilder.CreateBox("box", { size: 0.3 }, scene);
    const box = MeshBuilder.CreateBox("box", { width: 0.6, depth: 0.4, height: 0.1 });
}

async function start() {
    // create the canvas html element and attach it to the webpage
    const canvas = document.createElement("canvas");
    canvas.style.width = "100%";
    canvas.style.height = "100%";
    canvas.id = "gameCanvas";
    document.body.appendChild(canvas);

    const overlayDiv = document.createElement("div");
    overlayDiv.className = "dom-overlay-container";
    overlayDiv.innerText = "Status: Tracking..."; // example status message
    overlayDiv.style.position = "absolute";
    overlayDiv.style.bottom = "10px";
    overlayDiv.style.left = "10px";
    overlayDiv.style.padding = "10px";
    overlayDiv.style.backgroundColor = "rgba(255, 255, 255, 0.8)"; // semi-transparent background
    overlayDiv.style.borderRadius = "5px";
    document.body.appendChild(overlayDiv);

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

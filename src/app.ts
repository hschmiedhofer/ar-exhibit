import "@babylonjs/core/Debug/debugLayer";
import "@babylonjs/inspector";
import {
    Engine,
    Scene,
    ArcRotateCamera,
    Vector3,
    HemisphericLight,
    Mesh,
    MeshBuilder,
    WebXRDefaultExperienceOptions,
    WebXRDefaultExperience,
    TransformNode,
    Axis,
    Quaternion,
    SceneLoader,
    Space,
    WebXRFeatureName,
    WebXRImageTracking,
} from "@babylonjs/core";

async function initialize() {
    // create the canvas html element and attach it to the webpage
    const canvas = document.createElement("canvas");
    canvas.style.width = "100%";
    canvas.style.height = "100%";
    canvas.id = "gameCanvas";
    document.body.appendChild(canvas);

    // initialize babylon scene and engine
    const engine = new Engine(canvas, true);
    const scene = new Scene(engine);

    const camera: ArcRotateCamera = new ArcRotateCamera("Camera", Math.PI / 2, Math.PI / 2, 2, Vector3.Zero(), scene);
    camera.attachControl(canvas, true);
    const light1: HemisphericLight = new HemisphericLight("light1", new Vector3(1, 1, 0), scene);
    // const sphere: Mesh = MeshBuilder.CreateSphere("sphere", { diameter: 1 }, scene);

    scene.createDefaultEnvironment({ createGround: false, createSkybox: false });

    //* 1) load glb file public/valkyrie_mesh.glb
    const root = new TransformNode("root", scene);
    await SceneLoader.ImportMeshAsync("valkyrie_mesh", "", "valkyrie_mesh.glb", scene);
    const model = scene.getMeshByName("valkyrie_mesh");
    model.parent = root;
    root.rotationQuaternion = new Quaternion();

    //* 2) image tracking

    const options: WebXRDefaultExperienceOptions = {
        uiOptions: {
            sessionMode: "immersive-ar",
        },
    };

    const xr = await scene.createDefaultXRExperienceAsync(options);

    const featuresManager = xr.baseExperience.featuresManager;
    const imageTracking = featuresManager.enableFeature(WebXRFeatureName.IMAGE_TRACKING, "latest", {
        images: [
            {
                // src: "https://cdn.babylonjs.com/imageTracking.png",
                src: "imageTracking.png",
                estimatedRealWorldWidth: 0.2,
            },
        ],
    }) as WebXRImageTracking;

    imageTracking.onTrackedImageUpdatedObservable.add((image) => {
        // root.setPreTransformMatrix(image.transformationMatrix);
        image.transformationMatrix.decompose(root.scaling, root.rotationQuaternion, root.position);
        root.setEnabled(true);
        root.translate(Axis.Y, 0.1, Space.LOCAL);
    });

    //# start
    // set debug layer
    setDebugLayerShortcut(scene, false);
    // run the main render loop
    engine.runRenderLoop(() => {
        scene.render();
    });
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

initialize();

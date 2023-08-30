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

    // load glb file public/valkyrie_mesh.glb
    const root = new TransformNode("root", scene);
    // root.setEnabled(false);
    SceneLoader.ImportMesh("", "", "valkyrie_mesh.glb", scene, (meshes) => {
        meshes.forEach((mesh) => {
            mesh.parent = root;
        });
    });

    // hide/show the Inspector
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

    // run the main render loop
    engine.runRenderLoop(() => {
        scene.render();
    });
}

initialize();

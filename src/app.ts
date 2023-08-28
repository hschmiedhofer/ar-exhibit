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

class Demo {
    static async SetupXR(scene: Scene, options: WebXRDefaultExperienceOptions): Promise<WebXRDefaultExperience> {
        scene.createDefaultEnvironment({ createGround: false, createSkybox: false });

        const root = new TransformNode("root", scene);
        // root.setEnabled(false);

        const model = await SceneLoader.ImportMeshAsync(
            "",
            "https://piratejc.github.io/assets/",
            "valkyrie_mesh.glb",
            scene
        );
        model.meshes[0].parent = root;
        root.rotationQuaternion = new Quaternion();

        const xr = await scene.createDefaultXRExperienceAsync(options);

        const featuresManager = xr.baseExperience.featuresManager;
        const imageTracking = featuresManager.enableFeature(WebXRFeatureName.IMAGE_TRACKING, "latest", {
            images: [
                {
                    src: "https://cdn.babylonjs.com/imageTracking.png",
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

        return xr;
    }
}

// class Playground {
//     public static async CreateScene(engine: Engine, canvas: HTMLCanvasElement): Promise<Scene> {
//         const scene = new Scene(engine);
//         await Demo.SetupXR(scene, {
//             uiOptions: {
//                 sessionMode: "immersive-ar",
//             },
//         });
//         return scene;
//     }
// }
class App {
    constructor() {
        // create the canvas html element and attach it to the webpage
        var canvas = document.createElement("canvas");
        canvas.style.width = "100%";
        canvas.style.height = "100%";
        canvas.id = "gameCanvas";
        document.body.appendChild(canvas);

        // initialize babylon scene and engine
        var engine = new Engine(canvas, true);
        var scene = new Scene(engine);

        var camera: ArcRotateCamera = new ArcRotateCamera("Camera", Math.PI / 2, Math.PI / 2, 2, Vector3.Zero(), scene);
        camera.attachControl(canvas, true);
        var light1: HemisphericLight = new HemisphericLight("light1", new Vector3(1, 1, 0), scene);
        var sphere: Mesh = MeshBuilder.CreateSphere("sphere", { diameter: 1 }, scene);

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
}
new App();

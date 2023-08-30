var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import "@babylonjs/core/Debug/debugLayer";
import "@babylonjs/inspector";
import { Engine, Scene, ArcRotateCamera, Vector3, HemisphericLight, TransformNode, Axis, Quaternion, SceneLoader, Space, WebXRFeatureName, } from "@babylonjs/core";
function initialize() {
    return __awaiter(this, void 0, void 0, function* () {
        const canvas = document.createElement("canvas");
        canvas.style.width = "100%";
        canvas.style.height = "100%";
        canvas.id = "gameCanvas";
        document.body.appendChild(canvas);
        const engine = new Engine(canvas, true);
        const scene = new Scene(engine);
        const camera = new ArcRotateCamera("Camera", Math.PI / 2, Math.PI / 2, 2, Vector3.Zero(), scene);
        camera.attachControl(canvas, true);
        const light1 = new HemisphericLight("light1", new Vector3(1, 1, 0), scene);
        scene.createDefaultEnvironment({ createGround: false, createSkybox: false });
        const root = new TransformNode("root", scene);
        yield SceneLoader.ImportMeshAsync("valkyrie_mesh", "", "valkyrie_mesh.glb", scene);
        const model = scene.getMeshByName("valkyrie_mesh");
        model.parent = root;
        root.rotationQuaternion = new Quaternion();
        const options = {
            uiOptions: {
                sessionMode: "immersive-ar",
            },
        };
        const xr = yield scene.createDefaultXRExperienceAsync(options);
        const featuresManager = xr.baseExperience.featuresManager;
        const imageTracking = featuresManager.enableFeature(WebXRFeatureName.IMAGE_TRACKING, "latest", {
            images: [
                {
                    src: "imageTracking.png",
                    estimatedRealWorldWidth: 0.2,
                },
            ],
        });
        imageTracking.onTrackedImageUpdatedObservable.add((image) => {
            image.transformationMatrix.decompose(root.scaling, root.rotationQuaternion, root.position);
            root.setEnabled(true);
            root.translate(Axis.Y, 0.1, Space.LOCAL);
        });
        setDebugLayerShortcut(scene, false);
        engine.runRenderLoop(() => {
            scene.render();
        });
    });
}
function setDebugLayerShortcut(scene, on) {
    if (on === true)
        scene.debugLayer.show();
    window.addEventListener("keydown", (ev) => {
        if (ev.shiftKey && ev.ctrlKey && ev.altKey && ev.keyCode === 73) {
            if (scene.debugLayer.isVisible()) {
                scene.debugLayer.hide();
            }
            else {
                scene.debugLayer.show();
            }
        }
    });
}
initialize();

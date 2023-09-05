import { Scene, ArcRotateCamera, Tools, Vector3, HemisphericLight, MeshBuilder } from "@babylonjs/core";

export function setupStandardScene(canvas: HTMLCanvasElement, scene: Scene) {
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

    // const light1: HemisphericLight = new HemisphericLight("light1", new Vector3(1, 1, 0), scene);

    // const box = MeshBuilder.CreateBox("box", { width: 0.6, depth: 0.4, height: 0.1 });
}

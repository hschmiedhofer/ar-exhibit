import {
    Axis,
    Space,
    TransformNode,
    WebXRFeatureName,
    WebXRFeaturesManager,
    WebXRImageTracking,
} from "@babylonjs/core";

export function addImageTrackingFeature(
    featuresManager: WebXRFeaturesManager,
    trackingImage: string,
    estimatedWidth: number,
    rootNode: TransformNode
): WebXRImageTracking {
    const feature = featuresManager.enableFeature(WebXRFeatureName.IMAGE_TRACKING, "latest", {
        images: [
            {
                src: trackingImage,
                estimatedRealWorldWidth: estimatedWidth,
            },
        ],
    }) as WebXRImageTracking;

    feature.onTrackedImageUpdatedObservable.add((image) => {
        // root.setPreTransformMatrix(image.transformationMatrix);
        image.transformationMatrix.decompose(rootNode.scaling, rootNode.rotationQuaternion, rootNode.position);
        rootNode.setEnabled(true);
        rootNode.translate(Axis.Y, 0.1, Space.LOCAL);
    });

    return feature;
}

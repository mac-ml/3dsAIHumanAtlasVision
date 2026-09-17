import { setupInteraction, updatePoseRegions, updateFaceRegions, drawPersistedLabels } from './anatomy.js';
import { drawLandmarks } from './landmarks.js';

let poseLandmarker;
let faceLandmarker;
let video;
let canvasElement;
let canvasCtx;
let lastVideoTime = -1;
let anatomyDB;

export async function initMediaPipe(anatomyData) {
    anatomyDB = anatomyData;
    video = document.getElementById("webcam");
    canvasElement = document.getElementById("output_canvas");
    canvasCtx = canvasElement.getContext("2d");

    // Dynamic import from CDN
    const vision = await import("https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.14/vision_bundle.mjs");
    const { PoseLandmarker, FaceLandmarker, FilesetResolver } = vision;

    const visionBasePath = "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.14/wasm";
    const filesetResolver = await FilesetResolver.forVisionTasks(visionBasePath);

    poseLandmarker = await PoseLandmarker.createFromOptions(filesetResolver, {
        baseOptions: {
            modelAssetPath: "https://storage.googleapis.com/mediapipe-models/pose_landmarker/pose_landmarker_lite/float16/1/pose_landmarker_lite.task",
            delegate: "GPU"
        },
        runningMode: "VIDEO",
        numPoses: 1
    });

    faceLandmarker = await FaceLandmarker.createFromOptions(filesetResolver, {
        baseOptions: {
            modelAssetPath: "https://storage.googleapis.com/mediapipe-models/face_landmarker/face_landmarker/float16/1/face_landmarker.task",
            delegate: "GPU"
        },
        runningMode: "VIDEO",
        numFaces: 1
    });

    setupInteraction(canvasElement, anatomyDB);

    predictWebcam();
}

function predictWebcam() {
    canvasElement.width = video.videoWidth;
    canvasElement.height = video.videoHeight;
    
    let startTimeMs = performance.now();
    if (lastVideoTime !== video.currentTime) {
        lastVideoTime = video.currentTime;
        
        canvasCtx.save();
        canvasCtx.clearRect(0, 0, canvasElement.width, canvasElement.height);
        
        let poseResult = null;
        if (window.showPose) {
            poseResult = poseLandmarker.detectForVideo(video, startTimeMs);
        }

        let faceResult = null;
        if (window.showFace) {
            faceResult = faceLandmarker.detectForVideo(video, startTimeMs);
        }

        if (poseResult && poseResult.landmarks) {
            for (const landmark of poseResult.landmarks) {
                // Pass landmarks to a module that draws and manages hitbox regions
                drawPoseData(landmark);
            }
        }
        
        if (faceResult && faceResult.faceLandmarks) {
            for (const landmarks of faceResult.faceLandmarks) {
               drawFaceData(landmarks);
            }
        }
        
        drawPersistedLabels(canvasCtx);
        
        canvasCtx.restore();
    }
    
    // Request next frame
    window.requestAnimationFrame(predictWebcam);
}

function drawPoseData(landmarks) {
    drawLandmarks(canvasCtx, landmarks, { color: "#0071e3", lineWidth: 2, radius: 4 });
    updatePoseRegions(landmarks, canvasElement.width, canvasElement.height, canvasCtx);
}

function drawFaceData(landmarks) {
    drawLandmarks(canvasCtx, landmarks, { color: "#FF3B30", lineWidth: 1, radius: 1 });
    updateFaceRegions(landmarks, canvasElement.width, canvasElement.height, canvasCtx);
}

let videoElement;
let currentStream;
let facingMode = 'user';

export async function initCamera() {
    videoElement = document.getElementById('webcam');
    return await startStream();
}

async function startStream() {
    if (currentStream) {
        currentStream.getTracks().forEach(track => track.stop());
    }

    try {
        const stream = await navigator.mediaDevices.getUserMedia({
            video: { 
                facingMode: facingMode,
                width: { ideal: 1280 },
                height: { ideal: 720 }
            }
        });
        videoElement.srcObject = stream;
        currentStream = stream;
        
        return new Promise((resolve) => {
            videoElement.onloadedmetadata = () => {
                resolve(true);
            };
        });
    } catch (error) {
        console.error("Camera access error:", error);
        alert("Kamera erişimi gerekli / Camera access required.");
        return false;
    }
}

export async function switchCamera() {
    facingMode = facingMode === 'user' ? 'environment' : 'user';
    await startStream();
}

export function toggleCamera() {
    // simplified for MVP
}

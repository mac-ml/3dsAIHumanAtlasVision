export function setupUI() {
    const showPose = document.getElementById('show-pose');
    const showFace = document.getElementById('show-face');
    
    // In a full implementation, we'd use these toggles to control drawing logic.
    // For MVP, we can just log or store in a global state.
    showPose.addEventListener('change', (e) => {
        window.showPose = e.target.checked;
    });
    
    showFace.addEventListener('change', (e) => {
        window.showFace = e.target.checked;
    });
    
    window.showPose = true;
    window.showFace = true;
}

import { initCamera, toggleCamera, switchCamera } from './camera.js?v=2';
import { setupUI } from './ui.js?v=2';
import { loadAnatomyData, renderAtlasGrid } from './atlas.js?v=2';
import { initMediaPipe } from './pose.js?v=2';

let appState = {
    cameraActive: false,
    anatomyData: null
};

async function initApp() {
    setupUI();
    
    // Load local anatomy JSON
    appState.anatomyData = await loadAnatomyData();

    // Attach camera events
    document.getElementById('toggle-camera-btn').addEventListener('click', async (e) => {
        const btn = e.target;
        if (appState.cameraActive) {
            // Stop camera logic (simplified for MVP: just reload or pause)
            // Ideally we'd stop the stream tracks
            btn.textContent = 'Start Camera';
            appState.cameraActive = false;
        } else {
            btn.textContent = 'Loading...';
            const success = await initCamera();
            if (success) {
                btn.textContent = 'Stop Camera';
                appState.cameraActive = true;
                
                // Init MediaPipe only once camera is ready
                document.getElementById('loading-spinner').classList.remove('hidden');
                await initMediaPipe(appState.anatomyData);
                document.getElementById('loading-spinner').classList.add('hidden');
            } else {
                btn.textContent = 'Start Camera';
            }
        }
    });
    
    document.getElementById('switch-camera-btn').addEventListener('click', switchCamera);
    
    // Setup Tab Navigation
    const navLive = document.getElementById('nav-live');
    const navAtlas = document.getElementById('nav-atlas');
    const cameraSection = document.querySelector('.camera-section');
    const anatomySection = document.querySelector('.anatomy-section');
    const atlasView = document.getElementById('atlas-view');
    
    navLive.addEventListener('click', () => {
        navLive.classList.add('active');
        navAtlas.classList.remove('active');
        cameraSection.classList.remove('hidden');
        anatomySection.classList.remove('hidden');
        atlasView.classList.add('hidden');
    });
    
    navAtlas.addEventListener('click', () => {
        navAtlas.classList.add('active');
        navLive.classList.remove('active');
        cameraSection.classList.add('hidden');
        anatomySection.classList.add('hidden');
        atlasView.classList.remove('hidden');
        
        // Render grid if not already rendered
        if (atlasView.querySelector('.atlas-grid').children.length === 0) {
            renderAtlasGrid(appState.anatomyData);
        }
    });
}

document.addEventListener('DOMContentLoaded', initApp);

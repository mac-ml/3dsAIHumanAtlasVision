import { displayAnatomyInfo } from './atlas.js';
import { drawLabelWithArrow } from './landmarks.js';

let hitRegions = [];
let localDB = null;

// Label persistence
const LABEL_TTL_MS = 800; 
let activeLabels = {};
let activeRegions = {}; // For drawing persistent clickable circles

export function setupInteraction(canvas, db) {
    localDB = db;
    canvas.style.pointerEvents = "auto";
    canvas.style.cursor = "crosshair";
    
    canvas.addEventListener('click', (e) => {
        const rect = canvas.getBoundingClientRect();
        
        // Map screen click to canvas dimensions
        const scaleX = canvas.width / rect.width;
        const scaleY = canvas.height / rect.height;
        
        // Because canvas is mirrored (transform: scaleX(-1)), we must invert X coordinate
        const clickX_screen = (e.clientX - rect.left);
        const clickX = (rect.width - clickX_screen) * scaleX; 
        const clickY = (e.clientY - rect.top) * scaleY;
        
        // Find which region was clicked - use generous hit radius
        let bestMatch = null;
        let bestDist = Infinity;
        
        for (let i = 0; i < hitRegions.length; i++) {
            const region = hitRegions[i];
            const dist = Math.sqrt(Math.pow(clickX - region.x, 2) + Math.pow(clickY - region.y, 2));
            if (dist < region.radius && dist < bestDist) {
                bestDist = dist;
                bestMatch = region;
            }
        }
        
        if (bestMatch) {
            const data = db.find(item => item.id === bestMatch.id);
            if (data) {
                displayAnatomyInfo(data);
                // Flash the region to give feedback
                bestMatch.clicked = true;
                setTimeout(() => { bestMatch.clicked = false; }, 400);
            }
        }
    });
}

export function updatePoseRegions(landmarks, width, height, ctx) {
    hitRegions = [];
    
    const now = performance.now();
    const addRegion = (lm_idx, id, radius = 55) => {
        if (landmarks[lm_idx] && landmarks[lm_idx].visibility > 0.4) {
            const x = landmarks[lm_idx].x * width;
            const y = landmarks[lm_idx].y * height;
            hitRegions.push({ id, x, y, radius });
            activeRegions[id] = { x, y, radius, timestamp: now };
        }
    };
    
    addRegion(11, 'left_shoulder');
    addRegion(12, 'right_shoulder');
    addRegion(13, 'left_elbow');
    addRegion(14, 'right_elbow');
    addRegion(15, 'left_wrist');
    addRegion(16, 'right_wrist');

    if (landmarks[11] && landmarks[12]) {
        const x = ((landmarks[11].x + landmarks[12].x) / 2) * width;
        const y = ((landmarks[11].y + landmarks[12].y) / 2) * height + 50;
        hitRegions.push({ id: 'thorax', x, y, radius: 70 });
        activeRegions['thorax'] = { x, y, radius: 70, timestamp: now };
    }
}

export function updateFaceRegions(landmarks, width, height, ctx) {
    const now = performance.now();

    const addRegion = (lm_idx, id, radius = 40, offsetX = 60) => {
        if (landmarks[lm_idx]) {
            const x = landmarks[lm_idx].x * width;
            const y = landmarks[lm_idx].y * height;
            hitRegions.push({ id, x, y, radius });
            activeRegions[id] = { x, y, radius, timestamp: now };
            
            if (ctx && localDB) {
                const data = localDB.find(item => item.id === id);
                if (data) {
                    const labelName = data.name_latin || data.name;
                    activeLabels[id] = { name: labelName, x, y, offsetX, timestamp: now };
                }
            }
        }
    };
    
    addRegion(1,   'nose',        38, -90);
    addRegion(10,  'forehead',    38,  90);
    addRegion(159, 'left_eye',    32, -110);
    addRegion(386, 'right_eye',   32,  110);
    addRegion(13,  'mouth',       36, -80);
    addRegion(152, 'chin',        32,  80);
}

export function drawPersistedLabels(ctx) {
    if (!ctx) return;
    const now = performance.now();

    // Draw clickable highlight rings for all active regions
    for (const [id, region] of Object.entries(activeRegions)) {
        if (now - region.timestamp < LABEL_TTL_MS) {
            drawClickableRing(ctx, region.x, region.y, region.radius);
        } else {
            delete activeRegions[id];
        }
    }
    
    // Draw text labels
    for (const [id, label] of Object.entries(activeLabels)) {
        if (now - label.timestamp < LABEL_TTL_MS) {
            drawLabelWithArrow(ctx, label.name, label.x, label.y, { offsetX: label.offsetX, color: "#FF3B30" });
        } else {
            delete activeLabels[id];
        }
    }
}

function drawClickableRing(ctx, x, y, radius) {
    // Animated pulsing dashed ring to show clickable region
    ctx.save();
    
    // Outer glow
    ctx.beginPath();
    ctx.arc(x, y, radius, 0, 2 * Math.PI);
    ctx.strokeStyle = "rgba(255, 59, 48, 0.25)";
    ctx.lineWidth = radius * 0.4;
    ctx.stroke();
    
    // Solid ring
    ctx.beginPath();
    ctx.arc(x, y, radius * 0.85, 0, 2 * Math.PI);
    ctx.strokeStyle = "rgba(255, 59, 48, 0.7)";
    ctx.lineWidth = 2;
    ctx.setLineDash([6, 4]);
    ctx.stroke();
    ctx.setLineDash([]);
    
    // Small center dot
    ctx.beginPath();
    ctx.arc(x, y, 4, 0, 2 * Math.PI);
    ctx.fillStyle = "rgba(255, 59, 48, 0.9)";
    ctx.fill();
    
    ctx.restore();
}

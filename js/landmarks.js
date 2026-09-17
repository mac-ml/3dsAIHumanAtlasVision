// A very simplified drawing utility
export function drawLandmarks(ctx, landmarks, options) {
    ctx.fillStyle = options.color || "white";
    for (let i = 0; i < landmarks.length; i++) {
        const x = landmarks[i].x * ctx.canvas.width;
        const y = landmarks[i].y * ctx.canvas.height;
        ctx.beginPath();
        ctx.arc(x, y, options.radius || 3, 0, 2 * Math.PI);
        ctx.fill();
    }
}

export function drawLabelWithArrow(ctx, text, startX, startY, options = {}) {
    const offsetX = options.offsetX || 60;
    const offsetY = options.offsetY || -60;
    const endX = startX + offsetX;
    const endY = startY + offsetY;
    const color = options.color || "#00e5ff"; // Cyan by default

    // Draw Line
    ctx.beginPath();
    ctx.moveTo(startX, startY);
    ctx.lineTo(endX, endY);
    ctx.strokeStyle = color;
    ctx.lineWidth = 2;
    ctx.stroke();

    // Draw arrowhead
    const angle = Math.atan2(endY - startY, endX - startX);
    ctx.beginPath();
    ctx.moveTo(startX, startY);
    ctx.lineTo(startX + 10 * Math.cos(angle - Math.PI / 6), startY + 10 * Math.sin(angle - Math.PI / 6));
    ctx.lineTo(startX + 10 * Math.cos(angle + Math.PI / 6), startY + 10 * Math.sin(angle + Math.PI / 6));
    ctx.fillStyle = color;
    ctx.fill();

    // Text settings
    ctx.font = "14px Inter, sans-serif";
    const textWidth = ctx.measureText(text).width;
    const padding = 6;
    const boxWidth = textWidth + padding * 2;
    const boxHeight = 24;
    
    // Position text box
    const boxX = offsetX > 0 ? endX : endX - boxWidth;
    const boxY = endY - boxHeight / 2;

    // FLIP CANVAS FOR TEXT TO COUNTERACT CSS scaleX(-1)
    ctx.save();
    ctx.scale(-1, 1);
    
    const flippedBoxX = -boxX - boxWidth;

    // Draw background pill
    ctx.fillStyle = "rgba(0, 0, 0, 0.7)";
    ctx.beginPath();
    ctx.roundRect(flippedBoxX, boxY, boxWidth, boxHeight, 12);
    ctx.fill();
    ctx.strokeStyle = color;
    ctx.lineWidth = 1;
    ctx.stroke();

    // Draw text
    ctx.fillStyle = "#ffffff";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(text, flippedBoxX + boxWidth / 2, endY);
    
    ctx.restore();
}

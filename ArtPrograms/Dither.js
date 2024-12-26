document.getElementById('upload').addEventListener('change', function(event) {
    const file = event.target.files[0];
    const reader = new FileReader();

    reader.onload = function(e) {
        const img = new Image();
        img.onload = function() {
            const canvas = document.getElementById('canvas');
            const ctx = canvas.getContext('2d');
            canvas.width = img.width;
            canvas.height = img.height;
            ctx.drawImage(img, 0, 0);

            // Get image data
            const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
            const data = imageData.data;

            // Reduce colors
            const palette = getLimitedPalette(data, 16); // Limit to 16 colors
            applyDithering(data, palette, canvas.width, canvas.height);

            // Update canvas with dithered image
            ctx.putImageData(imageData, 0, 0);
        };
        img.src = e.target.result;
    };
    reader.readAsDataURL(file);
});

function getLimitedPalette(data, numColors) {
    // Simple k-means clustering to find a limited palette
    // For simplicity, we'll use a fixed palette here
    const palette = [
        [0, 0, 0], [255, 255, 255], [255, 0, 0], [0, 255, 0],
        [0, 0, 255], [255, 255, 0], [0, 255, 255], [255, 0, 255],
        [128, 128, 128], [128, 0, 0], [0, 128, 0], [0, 0, 128],
        [128, 128, 0], [0, 128, 128], [128, 0, 128], [192, 192, 192]
    ];
    return palette;
}

function applyDithering(data, palette, width, height) {
    for (let y = 0; y < height; y++) {
        for (let x = 0; x < width; x++) {
            const index = (y * width + x) * 4;
            const oldColor = [data[index], data[index + 1], data[index + 2]];
            const newColor = findClosestPaletteColor(oldColor, palette);
            data[index] = newColor[0];
            data[index + 1] = newColor[1];
            data[index + 2] = newColor[2];

            const error = [
                oldColor[0] - newColor[0],
                oldColor[1] - newColor[1],
                oldColor[2] - newColor[2]
            ];

            distributeError(data, x, y, width, height, error);
        }
    }
}

function findClosestPaletteColor(color, palette) {
    let closestColor = palette[0];
    let minDistance = Infinity;

    for (const paletteColor of palette) {
        const distance = colorDistance(color, paletteColor);
        if (distance < minDistance) {
            minDistance = distance;
            closestColor = paletteColor;
        }
    }

    return closestColor;
}

function colorDistance(color1, color2) {
    return Math.sqrt(
        Math.pow(color1[0] - color2[0], 2) +
        Math.pow(color1[1] - color2[1], 2) +
        Math.pow(color1[2] - color2[2], 2)
    );
}

function distributeError(data, x, y, width, height, error) {
    const diffusionMatrix = [
        { x: 1, y: 0, factor: 7 / 16 },
        { x: -1, y: 1, factor: 3 / 16 },
        { x: 0, y: 1, factor: 5 / 16 },
        { x: 1, y: 1, factor: 1 / 16 }
    ];

    for (const { x: dx, y: dy, factor } of diffusionMatrix) {
        const nx = x + dx;
        const ny = y + dy;
        if (nx >= 0 && nx < width && ny >= 0 && ny < height) {
            const index = (ny * width + nx) * 4;
            data[index] += error[0] * factor;
            data[index + 1] += error[1] * factor;
            data[index + 2] += error[2] * factor;
        }
    }
}

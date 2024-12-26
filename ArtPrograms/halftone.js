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

            // Apply grayscale filter
            const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
            const data = imageData.data;
            for (let i = 0; i < data.length; i += 4) {
                const avg = (data[i] + data[i + 1] + data[i + 2]) / 3;
                data[i] = avg;     // Red
                data[i + 1] = avg; // Green
                data[i + 2] = avg; // Blue
            }
            ctx.putImageData(imageData, 0, 0);
        };
        img.src = e.target.result;
    };
    reader.readAsDataURL(file);
});

document.getElementById('halftone').addEventListener('click', function() {
    const canvas = document.getElementById('canvas');
    const ctx = canvas.getContext('2d');
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const data = imageData.data;
    const dotSize = 5; // Size of the halftone dots

    for (let y = 0; y < canvas.height; y += dotSize) {
        for (let x = 0; x < canvas.width; x += dotSize) {
            let sum = 0;
            for (let dy = 0; dy < dotSize; dy++) {
                for (let dx = 0; dx < dotSize; dx++) {
                    const index = ((y + dy) * canvas.width + (x + dx)) * 4;
                    sum += data[index]; // Only need one channel since it's grayscale
                }
            }
            const avg = sum / (dotSize * dotSize);
            const radius = (avg / 255) * (dotSize / 2);

            ctx.fillStyle = 'black';
            ctx.beginPath();
            ctx.arc(x + dotSize / 2, y + dotSize / 2, radius, 0, Math.PI * 2);
            ctx.fill();
        }
    }
});

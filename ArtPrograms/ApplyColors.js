let img1, img2;

document.getElementById('upload1').addEventListener('change', function(event) {
    const file = event.target.files[0];
    const reader = new FileReader();

    reader.onload = function(e) {
        img1 = new Image();
        img1.onload = function() {
            drawImages();
        };
        img1.src = e.target.result;
    };
    reader.readAsDataURL(file);
});

document.getElementById('upload2').addEventListener('change', function(event) {
    const file = event.target.files[0];
    const reader = new FileReader();

    reader.onload = function(e) {
        img2 = new Image();
        img2.onload = function() {
            drawImages();
        };
        img2.src = e.target.result;
    };
    reader.readAsDataURL(file);
});

function drawImages() {
    if (img1 && img2) {
        const canvas = document.getElementById('canvas');
        const ctx = canvas.getContext('2d');
        canvas.width = img1.width;
        canvas.height = img1.height;
        ctx.drawImage(img1, 0, 0);
        ctx.drawImage(img2, img1.width, 0, img2.width, img2.height);
    }
}

document.getElementById('applyColors').addEventListener('click', function() {
    if (img1 && img2) {
        const canvas = document.getElementById('canvas');
        const ctx = canvas.getContext('2d');
        const imageData1 = ctx.getImageData(0, 0, img1.width, img1.height);
        const imageData2 = ctx.getImageData(img1.width, 0, img2.width, img2.height);

        const data1 = imageData1.data;
        const data2 = imageData2.data;

        // Calculate the average color of the source image
        let avgR = 0, avgG = 0, avgB = 0;
        for (let i = 0; i < data2.length; i += 4) {
            avgR += data2[i];
            avgG += data2[i + 1];
            avgB += data2[i + 2];
        }
        avgR /= (data2.length / 4);
        avgG /= (data2.length / 4);
        avgB /= (data2.length / 4);

        // Apply the average color to the target image
        for (let i = 0; i < data1.length; i += 4) {
            data1[i] = avgR;
            data1[i + 1] = avgG;
            data1[i + 2] = avgB;
        }

        ctx.putImageData(imageData1, 0, 0);
    }
});

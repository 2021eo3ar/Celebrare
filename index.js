
const uploadButton = document.querySelector('.upload-button');
const fileInput = document.querySelector('#upload');
const imagePreview = document.querySelector('#image-preview');
const rotateButton = document.querySelector('#rotate-button');
const flipHorizontalButton = document.querySelector('#flip-horizontal-button');
const flipVerticalButton = document.querySelector('#flip-vertical-button');
const cropButton = document.querySelector('#crop-button');

let uploadedImage = null;
let transformedImage = null;

uploadButton.addEventListener('click', () => {
    fileInput.click();
});
fileInput.addEventListener('change', handleImageUpload);
let cropper = null;

fileInput.addEventListener('change', () => {
    const selectedFile = fileInput.files[0];
    if (selectedFile) {
        const reader = new FileReader();
        reader.onload = () => {
            const img = document.createElement('img');
            img.src = reader.result;
            img.addEventListener('load', () => {
                uploadedImage = img;
                transformedImage = img.cloneNode(true);
                imagePreview.innerHTML = '';
                imagePreview.appendChild(transformedImage);
            });
        };
        reader.readAsDataURL(selectedFile);
    } else {
        uploadedImage = null;
        transformedImage = null;
        imagePreview.innerHTML = '';
    }
  });
  

rotateButton.addEventListener('click', () => {
    if (uploadedImage) {
        const currentRotation = getRotationInDegrees(transformedImage);
        const newRotation = currentRotation + 90;
        transformedImage.style.transform = `rotate(${newRotation}deg)`;
    }
});

flipHorizontalButton.addEventListener('click', () => {
    if (uploadedImage) {
        transformedImage.style.transform = `scaleX(-1)`;
    }
});

flipVerticalButton.addEventListener('click', () => {
    if (uploadedImage) {
        transformedImage.style.transform = `scaleY(-1)`;
    }
});

cropButton.addEventListener('click', () => {
    if (uploadedImage && cropper) {
        // Get the cropped canvas
        const croppedCanvas = cropper.getcroppedCanvas();

        // Convert the canvas to a data URL
        const croppedImageURL = croppedCanvas.toDataURL();

        // Create a new image element for the cropped image
        const croppedImage = new Image();
        croppedImage.src = croppedImageURL;

        // Replace the uploaded image with the cropped image
        imagePreview.innerHTML = '';
        imagePreview.appendChild(croppedImage);

        // Destroy the cropper instance
        cropper.destroy();
        cropper = null;
    }
});
function handleImageUpload(event) {
    const selectedFile = fileInput.files[0];
    if (selectedFile) {
        const reader = new FileReader();
        reader.onload = () => {
            const img = document.createElement('img');
            img.src = reader.result;
            img.addEventListener('load', () => {
                uploadedImage = img;
                transformedImage = img.cloneNode(true);
                imagePreview.innerHTML = '';
                imagePreview.appendChild(transformedImage);
                initializeCropper();
            });
        };
        reader.readAsDataURL(selectedFile);
    } else {
        uploadedImage = null;
        transformedImage = null;
        imagePreview.innerHTML = '';
    }
}
function getRotationInDegrees(element) {
    const style = window.getComputedStyle(element);
    const transform = style.getPropertyValue('transform');
    if (transform && transform !== 'none') {
        const values = transform.split('(')[1].split(')')[0].split(',');
        const angle = Math.round(Math.atan2(values[1], values[0]) * (180 / Math.PI));
        return angle >= 0 ? angle : angle + 360;
    }
    return 0;
}

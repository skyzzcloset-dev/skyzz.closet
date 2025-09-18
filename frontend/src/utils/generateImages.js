const sharp = require("sharp");
const fs = require("fs");
const path = require("path");

// Input image
const inputImage = path.join(__dirname, "public/heroImage.webp");

// Output sizes
const sizes = [657, 962, 1117, 1267, 1400];

// Ensure output folder exists
const outputDir = path.join(__dirname, "heroImage_jhlt5e/heroImage_jhlt5e_c_scale,w_200.webp");
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir);
}

// Generate images
sizes.forEach((size) => {
  sharp(inputImage)
    .resize({ width: size })
    .toFile(path.join(outputDir, `heroImage-${size}.webp`))
    .then(() => console.log(`Generated heroImage-${size}.webp`))
    .catch((err) => console.error(err));
});

const ImageKit = require("imagekit");

const imagekit = new ImageKit({
  publicKey: process.env.IMAGEKIT_PUBLIC_KEY,
  privateKey: process.env.IMAGEKIT_PRIVATE_KEY,
  urlEndpoint: process.env.IMAGEKIT_URL_ENDPOINT,
});

async function uploadFile(file, fileName, folderName) {
  try {
    const response = await imagekit.upload({
      file,       // base64 image
      fileName,
      folder: folderName ? `/products/${folderName}` : "/products",
    });
    return response;
  } catch (err) {
    throw new Error(err.message);
  }
}

module.exports = uploadFile;

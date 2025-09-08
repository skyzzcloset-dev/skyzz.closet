const ImageKit = require("imagekit");

const imagekit = new ImageKit({
  publicKey: process.env.IMAGEKIT_PUBLIC_KEY,
  privateKey: process.env.IMAGEKIT_PRIVATE_KEY,
  urlEndpoint: process.env.IMAGEKIT_URL_ENDPOINT,
});

async function uploadFile(file, fileName, folderName) {
  try {
    const response = await imagekit.upload({
      file,       // can be base64, binary, or URL
      fileName,   // e.g., "product-shirt-123.jpg"
      folder: folderName ? `/products/${folderName}` : "/products",
    });
    return response; // contains url, fileId, name, etc.
  } catch (err) {
    throw new Error(err.message);
  }
}

module.exports = uploadFile;

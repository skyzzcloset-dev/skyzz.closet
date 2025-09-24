// __mocks__/imagekit.service.js
module.exports = async function uploadFile(base64, filename, folder) {
  return {
    url: `https://dummy.url/${filename}`,
    fileId: `dummy-file-id-${filename}`,
  };
};

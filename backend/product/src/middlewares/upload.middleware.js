const multer = require("multer");
const storage = multer.memoryStorage();
const upload = multer({ storage });

function uploadMultiple(fieldName, maxCount) {
  return upload.array(fieldName, maxCount);
}

module.exports = { uploadMultiple };

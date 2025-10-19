const multer = require("multer");

const storage = multer.memoryStorage(); // ✅ so we get file.buffer
const upload = multer({ storage });

exports.uploadMultiple = (fieldName, maxCount) =>
  upload.array(fieldName, maxCount);

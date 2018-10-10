const multer = require("multer");

const formatFilename = (originFilename) => {
  const filename = `${new Date().getTime()}.${originFilename.split('.').pop()}`
  return filename
}

const uploadFile = function (dir, name) {
  const storage = multer.diskStorage({
    destination: (req, file, callback) => {
      callback(null, dir);
    },
    filename: (req, file, callback) => {
      callback(null, formatFilename(file.originalname));
    }
  });
  const upload = multer({ storage }).single(name);
  return upload;
};

const uploadMultiFiles = function (dir, name) {
  const storage = multer.diskStorage({
    destination: (req, file, callback) => {
      callback(null, dir);
    },
    filename: (req, file, callback) => {
      callback(null, formatFilename(file.originalname));
    }
  });
  const upload = multer({ storage }).array(name);
  return upload;
}

module.exports = { uploadFile, uploadMultiFiles};

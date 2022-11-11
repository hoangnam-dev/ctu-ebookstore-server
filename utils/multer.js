const multer = require("multer");
const path = require("path");
var appRoot = require("app-root-path");

// const storage = multer.diskStorage({
//   destination: function (req, file, cb) {
//       cb(null, appRoot + "/public/ebooks");
//   },

//   // By default, multer removes file extensions so let's add them back
//   filename: function (req, file, cb) {
//       cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
//   }
// });
const storage = multer.diskStorage({
  filename: function (req, file, cb) {
    cb(null, file.fieldname + "-" + Date.now() + path.extname(file.originalname));
  },
});

const fileFilter = function (req, file, cb) {
  // Accept images, epub and PDF only
  let ext = file.originalname.match(/\.(jpg|JPG|jpeg|JPEG|png|PNG|gif|GIF|pdf|epub)$/);
  if (!ext) {
    req.fileValidationError = "Only image, ePUB and PDF files are allowed!";
    return cb(new Error("Only image, ePUB and PDF files are allowed!"), false);
  }
  cb(null, true);
};

const imageFilter = function (req, file, cb) {
  // Accept images only
  let ext = file.originalname.match(/\.(jpg|JPG|jpeg|JPEG|png|PNG|gif|GIF)$/);
  if (!ext) {
    req.fileValidationError = "Only image files are allowed!";
    return cb(new Error("Only image files are allowed!"), false);
  }
  cb(null, true);
};

const upload = multer({ storage: storage, fileFilter: fileFilter});

const uploadMultiple = multer({
  storage: storage,
  fileFilter: imageFilter,
}).array("ebookImages", 6);

module.exports = { upload, uploadMultiple };

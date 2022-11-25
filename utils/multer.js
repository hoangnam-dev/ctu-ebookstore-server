const multer = require("multer");
const path = require("path");
var appRoot = require("app-root-path");
const fs = require('fs');

const storageLocalServer = multer.diskStorage({
  destination: function (req, file, cb) {
      cb(null, appRoot + `/public/uploads/${file.fieldname}`);
  },

  // By default, multer removes file extensions so let's add them back
  filename: function (req, file, cb) {
      cb(null, file.fieldname + '-' + Date.now() + '_' + file.originalname);
  }
});

const storage = multer.diskStorage({
  filename: function (req, file, cb) {
    cb(
      null,
      file.fieldname + "-" + Date.now() + path.extname(file.originalname)
    );
  },
});

const fileFilter = function (req, file, cb) {
  // Accept images, epub and PDF only
  let ext = file.originalname.match(
    /\.(jpg|JPG|jpeg|JPEG|png|PNG|gif|GIF|pdf|epub)$/
  );
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

const upload = multer({ storage: storage, fileFilter: fileFilter });
const uploadLocalServer = multer({ storage: storageLocalServer, fileFilter: fileFilter });

const uploadMultiple = multer({
  storage: storage,
  fileFilter: imageFilter,
}).array("ebookImages", 6);

const uploadFileAndImages = async (req, res, next) => {
  uploadLocalServer.fields([
    { name: "ebookAvatar", maxCount: 1 },
    { name: "ebookEPUB", maxCount: 1 },
    { name: "ebookPDF", maxCount: 1 },
    { name: "ebookImages", maxCount: 6 },
  ])(req, res, (err) => {
    if (err instanceof multer.MulterError) {
      req.uploadAvatarAndImagesMessage = err;
      req.uploadAvatarAndImagesStatus = false;
      next();
    } else if (err) {
      req.uploadAvatarAndImagesMessage = err;
      req.uploadAvatarAndImagesStatus = false;
      next();
    } else {
      req.uploadAvatarAndImagesStatus = true;
      req.avatarSaved = "";
      req.ePubSaved = "";
      var imagesSaved = [];

      // If choose a avatar image => update
      if (req.files["ebookAvatar"]) {
        // req.avatarSaved = "/images/" + req.files["ebookAvatar"][0].filename;
        req.avatarSaved = req.files["ebookAvatar"][0].filename;
      } else {
        req.avatarSaved = undefined;
      }
      // If choose a epub => update
      if (req.files["ebookEPUB"]) {
        // req.ePubSaved = "/epub/" + req.files["ebookEPUB"][0].filename;
        req.ePubSaved = req.files["ebookEPUB"][0].filename;
      } else {
        req.ePubSaved = undefined;
      }
      // If choose a pdf => update
      if (req.files["ebookPDF"]) {
        // req.pdfSaved = "/pdf/" + req.files["ebookPDF"][0].filename;
        req.pdfSaved = req.files["ebookPDF"][0].filename;
        req.pdfReviewSaved = Date.now()+'-review_'+req.files["ebookPDF"][0].filename;
      } else {
        req.pdfSaved = undefined;
      }

      // If choose a list images => update
      let array = [];
      if (req.files["ebookImages"]) {
        // let array = [];
        for (let i = 0; i < req.files["ebookImages"].length; i++) {
          // array.push("/images/" + req.files["ebookImages"][i].filename);
          array.push(req.files["ebookImages"][i].filename);
          // imagesSaved.push(array);
          // req.imagesSaved.push(req.files["ebookImages"][i].filename);
        }
      } else {
        req.imagesSaved = undefined;
      }

      // req.imagesSaved = imagesSaved;
      req.imagesSaved = array;
      next();
    }
  });
};

module.exports = { upload, uploadMultiple, uploadFileAndImages };

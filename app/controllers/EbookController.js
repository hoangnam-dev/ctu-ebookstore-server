const { express } = require("express");
const Ebook = require("../models/Ebook");
const { cloudinary } = require("../../utils/cloudinary");

// Handle result
function handleResult(arrData) {
  var resData = arrData.map((data) => {
    // Handle Author list of the ebook
    // var authorList = data.authorList.map((author) => {
    //   return {
    //     permissionID: perm.permissionid,
    //     permissionCode: perm.permissioncode,
    //     permissionName: perm.permissionname,
    //     permissionDescription: perm.permissiondescription,
    //   };
    // });

    // Handle Category list of the ebook
    // var permList = data.permissionList.map((perm) => {
    //   return {
    //     permissionID: perm.permissionid,
    //     permissionCode: perm.permissioncode,
    //     permissionName: perm.permissionname,
    //     permissionDescription: perm.permissiondescription,
    //   };
    // });

    // Handle Image list of the ebook
    var imgList = data.imageList.map((image) => {
      return {
        imageID: image.imageid,
        imageSource: image.imagesource,
      };
    });

    // return ebook
    return {
      ebookID: data.ebookid,
      ebookCode: data.ebookcode,
      ebookName: data.ebookname,
      ebookDescription: data.ebookdescription,
      authorList: authorList,
      categoryList: categoryList,
      imageList: imgList,
    };
  });
  return resData;
}

// Show all ebook
const allEbook = function (req, res) {
  Ebook.getAll(function (err, ebooks) {
    if (err) {
      res.json({
        error: true,
        statusCode: 0,
        message: "Lỗi! Không truy xuất được dữ liệu",
      });
    } else {
      res.json(ebooks);
    }
  });
};

// Search ebook
const search = function (req, res) {
  var col = req.query.type;
  var val = req.query.input;
  Ebook.search(col, val, function (err, ebook) {
    if (err || Object.keys(ebook).length === 0) {
      res.json({
        error: true,
        statusCode: 0,
        message: "Lỗi! Không tìm thấy ebook",
      });
    } else {
      res.json(ebook);
    }
  });
};

// Store new ebook
const store = async function (req, res) {
  var newEbook = new Ebook(req.body);
  // var listCatagoryID = req.body.categoriesID;
  var listCatagoryID = [1,2];
  // console.log(req.avatarPathSaved);
  // console.log(req.ePubPathSaved);
  // console.log(req.pdfPathSaved);
  // console.log(req.imagesPathSaved);

  if (
    !newEbook.ebookname ||
    !newEbook.ebookprice ||
    !newEbook.ebookstatusid ||
    !newEbook.supplierid
  ) {
    res.json({
      error: true,
      statusCode: 0,
      message: "Thông tin ebook không được để trống",
    });
  } else {
    try {
      // Upload Avatar
      if (req.avatarPathSaved !== undefined) {
        let avatarPath = req.avatarPathSaved;
        let uploadResponse = await cloudinary.uploader.upload(avatarPath, {
          upload_preset: "ebookstore_ebook_images",
        });
        newEbook.ebookavatar = uploadResponse.secure_url;
      }
      // Upload Images
      var cloudPathImages = [];
      if (req.imagesPathSaved !== undefined) {
        for (let i = 0; i < req.imagesPathSaved.length; i++) {
          let imagesPath = req.imagesPathSaved[i];
          let uploadResponse = await cloudinary.uploader.upload(imagesPath, {
            upload_preset: "ebookstore_ebook_images",
          });
          cloudPathImages.push(uploadResponse.secure_url);
        }
      }
      // Upload epub
      if (req.ePubPathSaved !== undefined) {
        console.log(req.ePubPathSaved);
        var epubPath = req.ePubPathSaved;
        let uploadResponse = await cloudinary.uploader.upload(epubPath, {
          upload_preset: "ebookstore_ebook_epub",
        });
        newEbook.ebookepub = uploadResponse.secure_url;
        console.log(uploadResponse.secure_url);
      } else {
        newEbook.ebookepub = "";
      }
      // Upload pdf
      if (req.pdfPathSaved !== undefined) {
        console.log(req.pdfPathSaved);
        var pdfPath = req.pdfPathSaved;
        let uploadResponse = await cloudinary.uploader.upload(pdfPath, {
          upload_preset: "ebookstore_ebook_pdf",
        });
        newEbook.ebookpdf = uploadResponse.secure_url;
        console.log(uploadResponse.secure_url);
      } else {
        newEbook.ebookpdf = "";
      }

      // Store ebook
      Ebook.store(newEbook, function (err, ebook) {
        if (err) {
          res.json({
            error: true,
            statusCode: 0,
            message: "Lỗi! Thêm ebook không thành công",
          });
        } else {
          Ebook.storeCategory(ebook, listCatagoryID, function(err, category) {
            if (err) {
              res.json({
                error: true,
                statusCode: 0,
                message: "Thêm ebook category không thành công",
              });
            } else {
              res.json({
                error: false,
                statusCode: 1,
                message: "Thêm ebook thành công",
              });
            }
          })
        }
      });
    } catch (err) {
      console.error(err);
      res.status(500).json({
        error: true,
        statusCode: 0,
        message: "Upload không thành công",
      });
    }
  }
};

// Get ebook by ID
const getEbookByID = function (req, res) {
  var ebookID = req.params.id;
  Ebook.getEbookByID(ebookID, function (err, ebook) {
    if (err) {
      res.json({
        error: true,
        statusCode: 0,
        message: "Lỗi! Không tìm thấy ebook",
      });
    } else {
      let ebookInfo = handleResult(ebook);
      console.log(ebookInfo);
      res.json(ebookInfo);
    }
  });
};

// Store new ebook
const update = function (req, res) {
  var newEbook = new Ebook(req.body);
  var ebookID = req.params.id;
  if (!newEbook.ebookname || !newEbook.ebookprice || !newEbook.ebookstatus) {
    res.json({
      error: true,
      statusCode: 0,
      message: "Thông tin ebook không được để trống",
    });
  } else {
    Ebook.update(ebookID, newEbook, function (err, ebook) {
      if (err) {
        res.json({
          error: true,
          statusCode: 0,
          message: "Lỗi! Cập nhật ebook không thành công",
        });
      } else {
        res.json({
          error: false,
          statusCode: 1,
          message: "Cập nhật ebook thành công",
        });
      }
    });
  }
};

// Soft destroy ebook
const destroy = function (req, res) {
  var ebookID = req.params.id;
  Ebook.getEbookByID(ebookID, function (err, ebook) {
    if (err || Object.keys(ebook).length === 0) {
      res.json({
        error: true,
        statusCode: 0,
        message: "Lỗi! Không tìm thấy ebook",
      });
    } else {
      Ebook.delete(ebookID, function (err, ebook) {
        if (err) {
          res.json({
            error: true,
            statusCode: 0,
            message: "Lỗi! Xóa ebook không thành công",
          });
        } else {
          res.json({
            error: false,
            statusCode: 1,
            message: "Xóa ebook thành công",
          });
        }
      });
    }
  });
};

// Restore ebook
const restore = function (req, res) {
  var ebookID = req.params.id;
  Ebook.getEbookByID(ebookID, function (err, ebook) {
    if (err || Object.keys(ebook).length === 0) {
      res.json({
        error: true,
        statusCode: 0,
        message: "Lỗi! Không tìm thấy ebook",
      });
    } else {
      Ebook.restore(ebookID, function (err, ebook) {
        if (err) {
          res.json({
            error: true,
            statusCode: 0,
            message: "Lỗi! Khôi phục ebook không thành công",
          });
        } else {
          res.json({
            error: false,
            statusCode: 1,
            message: "Khôi phục ebook thành công",
          });
        }
      });
    }
  });
};

module.exports = {
  allEbook,
  getEbookByID,
  search,
  store,
  update,
  destroy,
  restore,
};

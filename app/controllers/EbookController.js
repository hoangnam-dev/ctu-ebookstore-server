const { express } = require("express");
const Ebook = require("../models/Ebook");
const ImageEbook = require("../models/ImageEbook");
const { cloudinary } = require("../../utils/cloudinary");

// Handle result
function handleResultAll(arrData) {
  var resData = arrData.map((data) => {
    // Handle EbookStatus list of the ebook
    var ebookstatusList = data.ebookstatusList.map((status) => {
      return {
        ebookstatusID: status.ebookstatusid,
        ebookstatusCode: status.ebookstatuscode,
        ebookstatusName: status.ebookstatusname,
        ebookstatusColor: status.ebookstatuscolor,
      };
    });

    // return ebook
    return {
      ebookID: data.ebookid,
      ebookName: data.ebookname,
      ebookAvatar: data.ebookavatar,
      ebookPrice: data.ebookprice,
      ebookstatusList: ebookstatusList
    };
  });
  return resData;
}
function handleResult(arrData) {
  var resData = arrData.map((data) => {
    // Handle Author list of the ebook
    var authorList = data.authorList.map((author) => {
      return {
        authorID: author.authorid,
        authorName: author.authorname,
      };
    });

    // Handle Category list of the ebook
    var categoryList = data.categoryList.map((category) => {
      return {
        categoryID: category.categoryid,
        categoryName: category.categoryname,
      };
    });

    // Handle Sale list of the ebook
    var saleList = data.saleList.map((sale) => {
      return {
        saleID: sale.saleid,
        saleCode: sale.salecode,
        saleName: sale.salename,
        saleType: sale.saleebooktype,
        saleValue: sale.salevalue,
        saleQuantityMax: sale.salequantitymax,
        saleQuantityCurrent: sale.salequantitycurrent,
      };
    });

    // Handle Image list of the ebook
    var imgList = data.imageebookList.map((imageebook) => {
      return {
        imageebookID: imageebook.imageebookid,
        imageebookSource: imageebook.imageebooksource,
      };
    });

    // Handle EbookStatus list of the ebook
    var ebookstatusList = data.ebookstatusList.map((status) => {
      return {
        ebookstatusID: status.ebookstatusid,
        ebookstatusCode: status.ebookstatuscode,
        ebookstatusName: status.ebookstatusname,
        ebookstatusColor: status.ebookstatuscolor,
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
      saleList: saleList,
      imageList: imgList,
      ebookstatusList: ebookstatusList,
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
      let ebookInfo = handleResultAll(ebooks);
      res.json(ebookInfo);
    }
  });
};

// Search ebook
const search = function (req, res) {
  var col = req.query.type;
  var val = req.query.input;
  Ebook.search(col, val, function (err, ebooks) {
    if (err || Object.keys(ebooks).length === 0) {
      res.json({
        error: true,
        statusCode: 0,
        message: "Lỗi! Không tìm thấy ebook",
      });
    } else {
      let ebookInfo = handleResultAll(ebooks);
      res.json(ebookInfo);
    }
  });
};

// Store new ebook
const store = async function (req, res) {
  var newEbook = new Ebook(req.body);
  var categoriesID = req.body.categoriesID;
  // var categoriesID = [1,2]; // test
  if (
    !newEbook.ebookname ||
    !newEbook.ebookprice ||
    !newEbook.ebookstatusidid ||
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
        var epubPath = req.ePubPathSaved;
        let uploadResponse = await cloudinary.uploader.upload(epubPath, {
          upload_preset: "ebookstore_ebook_epub",
        });
        newEbook.ebookepub = uploadResponse.secure_url;
      } else {
        newEbook.ebookepub = "";
      }
      // Upload pdf
      if (req.pdfPathSaved !== undefined) {
        var pdfPath = req.pdfPathSaved;
        let uploadResponse = await cloudinary.uploader.upload(pdfPath, {
          upload_preset: "ebookstore_ebook_pdf",
        });
        newEbook.ebookpdf = uploadResponse.secure_url;
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
          Ebook.storeCategory(ebook, categoriesID, function(err, category) {
            if (err) {
              res.json({
                error: true,
                statusCode: 0,
                message: "Thêm ebook category không thành công",
              });
            } else {
              ImageEbook.storeEbookImages(ebook, cloudPathImages, function(err, images) {
                if (err) {
                  res.json({
                    error: true,
                    statusCode: 0,
                    message: "Thêm ebook images không thành công",
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
          })
        }
      });
    } catch (err) {
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
      res.json(ebookInfo);
    }
  });
};

// Update ebook info
const update = async function (req, res) {
  var newEbook = new Ebook(req.body);
  var ebookID = req.params.id;
  if (!newEbook.ebookname || !newEbook.ebookprice || !newEbook.ebookstatusid || !newEbook.supplierid) {
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
      } else {
        newEbook.ebookavatar = null;
      }
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
    } catch (error) {
      res.status(500).json({
        error: true,
        statusCode: 0,
        message: "Upload không thành công",
      });
    }
    
  }
};
// Update ebook content
const updateEbookContent = async function (req, res) {
  var newEbookCotentLink = '';
  var ebookID = req.params.id;
  try {
    var contentType= '';
    // Upload epub
    if (req.ePubPathSaved !== undefined) {
      contentType = 'epub';
      var epubPath = req.ePubPathSaved;
      let uploadResponse = await cloudinary.uploader.upload(epubPath, {
        upload_preset: "ebookstore_ebook_epub",
      });
      newEbookCotentLink = uploadResponse.secure_url;
    }
    // Upload pdf
    if (req.pdfPathSaved !== undefined) {
      contentType = 'pdf';
      var pdfPath = req.pdfPathSaved;
      let uploadResponse = await cloudinary.uploader.upload(pdfPath, {
        upload_preset: "ebookstore_ebook_pdf",
      });
      newEbookCotentLink = uploadResponse.secure_url;
    }
    if(contentType === '') {
      res.status(500).json({
        error: true,
        statusCode: 0,
        message: "Hãy chọn nội dung cho ebook",
      });
    } else {
      Ebook.updateEbookContent(ebookID, contentType, newEbookCotentLink, function (err, ebook) {
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
  } catch (error) {
    res.status(500).json({
      error: true,
      statusCode: 0,
      message: "Upload không thành công",
    });
  }
};

// add Images
const addImage = async function (req, res) {
  var ebookID = req.body.ebookID;
  try {
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
      ImageEbook.store(ebookID, cloudPathImages, function(err, images) {
        if (err) {
          res.json({
            error: true,
            statusCode: 0,
            message: "Thêm ebook images không thành công",
          });
        } else {
          res.json({
            error: false,
            statusCode: 1,
            message: "Thêm ebook images thành công",
          });
        }
      })
    }
  } catch (error) {
    res.status(500).json({
      error: true,
      statusCode: 0,
      message: "Upload không thành công",
    });
  }
};
// delete Images
const deleteImage = async function (req, res) {
  var imageEbookID = req.body.imageEbookID;
  var ebookID = req.body.ebookID;
  ImageEbook.delete(imageEbookID, ebookID, function(err, images) {
    if (err) {
      res.json({
        error: true,
        statusCode: 0,
        message: "Xóa ebook images không thành công",
      });
    } else {
      res.json({
        error: false,
        statusCode: 1,
        message: "Xóa ebook images thành công",
      });
    }
  })
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
  updateEbookContent,
  addImage,
  deleteImage,
  destroy,
  restore,
};

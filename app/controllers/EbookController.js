const { express } = require("express");
const Ebook = require("../models/Ebook");
const ImageEbook = require("../models/ImageEbook");
const { cloudinary } = require("../../utils/cloudinary");
const fs = require("fs");
const path = require("path");
const { PDFDocument } = require("pdf-lib");
var appRoot = require("app-root-path");

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

    // Handle ebook sale price and Sale list of the ebook
    var salePrice = null;
    var saleList = [];
    if(Object.keys(data.saleList).length > 0) {
      salePrice = parseFloat(data.ebookprice);
      saleList = data.saleList.map((sale) => {
        salePrice -= parseFloat(sale.salevalue);
        return {
          saleID: sale.saleid,
          saleName: sale.salename,
          saleValue: sale.salevalue,
          saleEndAt: sale.saleendat,
        };
      });
    }

    // return ebook
    return {
      ebookID: data.ebookid,
      ebookName: data.ebookname,
      ebookAvatar: data.ebookavatar,
      ebookPrice: data.ebookprice,
      salePrice: salePrice,
      saleList: saleList[0],
      ebookstatusList: ebookstatusList[0],
      
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

    // Handle ebook sale price and Sale list of the ebook
    var salePrice = parseFloat(data.ebookprice);
    var saleList = data.saleList.map((sale) => {
      salePrice -= parseFloat(sale.salevalue);
      return {
        saleID: sale.saleid,
        saleName: sale.salename,
        saleValue: sale.salevalue,
        saleEndAt: sale.saleendat,
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
      ebookName: data.ebookname,
      ebookPrice: data.ebookprice,
      salePrice: salePrice,
      ebookAvatar: data.ebookavatar,
      ebookDescription: data.ebookdescription,
      ebookEPUB: data.ebookepub,
      ebookPDF: data.ebookpdf,
      ebookPDFReview: data.ebookpdfreview,
      ebookReleasedAt: data.ebookreleasedat,
      authorList: authorList,
      categoryList: categoryList,
      saleList: saleList,
      ebookstatusList: ebookstatusList,
    };
  });
  return resData;
}
const handleFilePath = (directoryPath, fileName) => {
  return `https://localhost:${
    process.env.PORT || 3001
  }/${directoryPath}/${fileName}`;
};

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
// Slipt pdf file to small pdf
const splitPDF = async (
  pdfFilePath,
  outputDirectory,
  separatePage,
  fileNameSave
) => {
  const writePdf = await PDFDocument.create();
  var pdf = await PDFDocument.load(fs.readFileSync(pdfFilePath));
  if (pdf.getPageIndices().length < separatePage) {
    reject(err);
  }
  var pageMerge = [];
  for (var i = 0; i < separatePage; i++) {
    pageMerge.push(i);
  }

  var copiedPages = await writePdf.copyPages(pdf, pageMerge);
  copiedPages.forEach((page) => writePdf.addPage(page));
  const bytes = await writePdf.save();
  const outputPath2 = path.join(outputDirectory, fileNameSave);
  await fs.promises.writeFile(outputPath2, bytes);
};

const store = async function (req, res) {
  var newEbook = new Ebook(req.body);
  // var categoriesID = req.body.categoriesID;
  // var authorsID = req.body.authorsID;
  var categoriesID = [1, 2]; // test
  var authorsID = [1, 2]; // test
  var separatePage = req.body.separatePage;
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
        let uploadResponse = await cloudinary.uploader.upload(req.avatarPathSaved, {
          upload_preset: "ebookstore_ebook_images",
        });
        newEbook.ebookavatar = uploadResponse.secure_url;
      }
      // Upload epub
      if (req.ePubSaved !== undefined) {
        newEbook.ebookepub = handleFilePath(
          "public/uploads/ebookEPUB",
          req.ePubSaved
        );
      } else {
        newEbook.ebookepub = "";
      }
      // Upload pdf
      if (req.pdfSaved !== undefined) {
        newEbook.ebookpdf = handleFilePath(
          "public/uploads/ebookPDF",
          req.pdfSaved
        );
        newEbook.ebookpdfreview = handleFilePath(
          "public/uploads/ebookPDF/pdf-review",
          req.pdfReviewSaved
        );
        var pdfPath = appRoot + "\\public\\uploads\\ebookPDF\\" + req.pdfSaved;

        splitPDF(
          pdfPath,
          appRoot + "/public/uploads/ebookPDF/pdf-review",
          separatePage,
          req.pdfReviewSaved
        )
          .then()
          .catch((errorSlipt) => console.error);
      } else {
        newEbook.ebookpdf = "";
      }

      // Store ebook
      Ebook.store(newEbook, categoriesID, authorsID, function (err, ebook) {
        if (err) {
          res.json({
            error: true,
            statusCode: 0,
            message: "Lỗi! Thêm ebook không thành công",
          });
        } else {
          res.json({
            error: false,
            statusCode: 1,
            message: "Thêm ebook thành công",
          });
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
  // var categoriesID = req.body.categoriesID;
  // var authorsID = req.body.authorsID;
  if (!newEbook.ebookname || !newEbook.ebookprice || !newEbook.ebookstatusid) {
    res.json({
      error: true,
      statusCode: 0,
      message: "Thông tin ebook không được để trống",
    });
  } else {
    try {
      // Upload Avatar
      if (req.avatarSaved !== undefined) {
        let avatarPath = req.avatarSaved;
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
  var newEbookContentLink = "";
  var ebookID = req.params.id;
  var separatePage = req.body.separatePage;
  var newEbookReviewLink = "";
  try {
    var contentType = "";
    // Upload epub
    if (req.ePubSaved !== undefined) {
      contentType = "epub";
      newEbookContentLink = handleFilePath(
        "public/uploads/ebookEPUB",
        req.ePubSaved
      );
    }
    // Upload pdf
    if (req.pdfSaved !== undefined) {
      contentType = "pdf";
      newEbookContentLink = handleFilePath(
        "public/uploads/ebookPDF",
        req.pdfSaved
      );
      newEbookReviewLink = handleFilePath(
        "public/uploads/ebookPDF/pdf-review",
        req.pdfReviewSaved
      );
      var pdfPath = appRoot + "\\public\\uploads\\ebookPDF\\" + req.pdfSaved;

      splitPDF(
        pdfPath,
        appRoot + "/public/uploads/ebookPDF/pdf-review",
        separatePage,
        req.pdfReviewSaved
      )
        .then()
        .catch((err) => console.error);
    }
    if (contentType === "") {
      res.status(500).json({
        error: true,
        statusCode: 0,
        message: "Hãy chọn nội dung cho ebook",
      });
    } else {
      Ebook.updateEbookContent(
        ebookID,
        contentType,
        newEbookContentLink,
        newEbookReviewLink,
        function (err, ebook) {
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
        }
      );
    }
  } catch (error) {
    res.status(500).json({
      error: true,
      statusCode: 0,
      message: "Upload không thành công",
    });
  }
};

// add Category
const addCategory = async function (req, res) {
  var ebookID = req.params.id;
  var categoriesID = req.body.categoriesID;
  Ebook.storeCategory(ebookID, categoriesID, (err, result) => {
    if (err) {
      res.status(500).json({
        error: true,
        statusCode: 0,
        message: "Thêm thể loại cho ebook không thành công",
      });
    } else {
      res.status(500).json({
        error: true,
        statusCode: 0,
        message: "Thêm thể loại cho ebook thành công",
      });
    }
  });
};
// delete Category
const deleteCategory = async function (req, res) {
  var ebookID = req.params.id;
  var categoryID = req.body.categoryID;
  Ebook.deleteCategory(ebookID, categoryID, function (err, images) {
    if (err) {
      res.json({
        error: true,
        statusCode: 0,
        message: "Xóa thể loại của ebook  không thành công",
      });
    } else {
      res.json({
        error: false,
        statusCode: 1,
        message: "Xóa thể loại của ebook thành công",
      });
    }
  });
};

// add Author
const addAuthor = async function (req, res) {
  var ebookID = req.params.id;
  var authorsID = req.body.authorsID;
  Ebook.storeAuthor(ebookID, authorsID, (err, result) => {
    if (err) {
      res.status(500).json({
        error: true,
        statusCode: 0,
        message: "Thêm tác giả của ebook không thành công",
      });
    } else {
      res.status(500).json({
        error: true,
        statusCode: 0,
        message: "Thêm tác giả của ebook thành công",
      });
    }
  });
};
// delete Author
const deleteAuthor = async function (req, res) {
  var ebookID = req.params.id;
  var authorID = req.body.authorID;
  Ebook.deleteAuthor(ebookID, authorID, function (err, images) {
    if (err) {
      res.json({
        error: true,
        statusCode: 0,
        message: "Xóa tác giả của ebook  không thành công",
      });
    } else {
      res.json({
        error: false,
        statusCode: 1,
        message: "Xóa tác giả của ebook thành công",
      });
    }
  });
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
  addAuthor,
  addCategory,
  deleteAuthor,
  deleteCategory,
  destroy,
  restore,
};

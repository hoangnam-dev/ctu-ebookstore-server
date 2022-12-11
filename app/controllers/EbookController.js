const express = require("express");
const Ebook = require("../models/Ebook");
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
  return `http://localhost:${
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
// Split pdf file to small pdf
const splitPDF = async (
  pdfFilePath,
  outputDirectory,
  startPage,
  separatePage,
  fileNameSave
) => {
  const writePdf = await PDFDocument.create();
  var pdf = await PDFDocument.load(fs.readFileSync(pdfFilePath));
  if (pdf.getPageIndices().length < separatePage) {
    reject(err);
  }
  // create array page of pdf split
  let start = parseFloat(startPage) - 1;
  var pageMerge = [];
  for (var i = start; i < separatePage; i++) {
    pageMerge.push(i);
  }

  var copiedPages = await writePdf.copyPages(pdf, pageMerge);
  copiedPages.forEach((page) => writePdf.addPage(page));
  const bytes = await writePdf.save();
  const outputPath = path.join(outputDirectory, fileNameSave);
  await fs.promises.writeFile(outputPath, bytes);
};

const store = async function (req, res) {
  var newEbook = new Ebook(req.body);
  // var categoriesID = req.body.categoriesID;
  // var authorsID = req.body.authorsID;
  // var categoriesID = [1, 2]; // test
  // var authorsID = [1, 2]; // test
  var separatePage = req.body.separatePage;
  var startPage = req.body.startPage;

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
      if (req.avatarSaved !== undefined) {
        let uploadResponse = await cloudinary.uploader.upload(req.avatarSaved, {
          upload_preset: "ebookstore_ebook_images",
        });
        newEbook.ebookavatar = uploadResponse.secure_url;
      }
      // Upload epub
      if (req.ePubSaved !== undefined) {
        newEbook.ebookepub = handleFilePath(
          "uploads/ebookEPUB",
          req.ePubSaved
        );
      } else {
        newEbook.ebookepub = "";
      }
      // Upload pdf
      if (req.pdfSaved !== undefined) {
        if(!separatePage || startPage < 1 || (startPage > separatePage)) {
          return res.json({
            error: true,
            statusCode: 0,
            message: "Số trang cắt không hợp lệ",
          });
        }
        newEbook.ebookpdf = handleFilePath(
          "uploads/ebookPDF",
          req.pdfSaved
        );
        newEbook.ebookpdfreview = handleFilePath(
          "uploads/ebookPDF/pdf-review",
          req.pdfReviewSaved
        );
        var pdfPath = appRoot + "\\public\\uploads\\ebookPDF\\" + req.pdfSaved;

        splitPDF(
          pdfPath,
          appRoot + "/public/uploads/ebookPDF/pdf-review",
          startPage,
          separatePage,
          req.pdfReviewSaved
        )
          .then()
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
      res.json({
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
      res.json({
        error: true,
        statusCode: 0,
        message: "Upload không thành công",
      });
    }
  }
};
// Update ebook content
const getFileName = (localPath) => {
  let splitIndex = localPath.lastIndexOf('/');
  let fileName = localPath.slice(splitIndex+1)
  return fileName;
}
const removeFile = (directory, fileName) => {
  const publicPath = `D:\\Projects\\NodeJS\\CTU-EbookStore\\public\\uploads\\${directory}\\${fileName}`;
  fs.unlink(publicPath);
}
const updateEbookContent = async function (req, res) {
  var newEbookContentLink = "";
  var ebookID = req.params.id;
  var startPage = req.body.startPage;
  var separatePage = req.body.separatePage;

  var newEbookReviewLink = "";
  const publicPath = process.env.PUBLIC_PATH || "D:/Projects/NodeJS/CTU-EbookStore/public/uploads"
  try {
    Ebook.getEbookContent(ebookID, (err, ebookContent) => {
      if(err) {
        return res.json({
          error: true,
          statusCode: 0,
          message: "Lỗi truy xuất dữ liệu"
        });
      } 
      else {
        var contentType = "";

        // if file update is .epub => contentType = "epub"
        // if file update is .pdf => contentType = "pdf"
        // Upload epub
        if (req.ePubSaved !== undefined) {
          contentType = "epub";
          newEbookContentLink = handleFilePath(
            "uploads/ebookEPUB",
            req.ePubSaved 
          );
          if(ebookContent.ebookepub !== '') {
            let fileName = getFileName(ebookContent.ebookepub);
            let removePath = publicPath + "/ebookEPUB/" + fileName;
            if(fs.existsSync(removePath)) {
              fs.unlink(removePath, (errRemove) => {
                if(errRemove) {
                  console.log(errRemove);
                  return res.json({
                    error: true,
                    statusCode: 0,
                    message: "Xóa file ePUB cũ không thành công",
                  });
                }
              });
            }
          }
        }

        // Upload pdf
        if (req.pdfSaved !== undefined) {
          if(!separatePage || startPage < 1 || (startPage > separatePage)) {
            return res.json({
              error: true,
              statusCode: 0,
              message: "Số trang cắt không hợp lệ",
            });
          }
          contentType = "pdf";
          newEbookContentLink = handleFilePath(
            "uploads/ebookPDF",
            req.pdfSaved
          );
          newEbookReviewLink = handleFilePath(
            "uploads/ebookPDF/pdf-review",
            req.pdfReviewSaved
          );

          // remove old file
          if(ebookContent.ebookpdf !== '') {
            let fileName = getFileName(ebookContent.ebookpdf);
            let removePath = publicPath + "/ebookPDF/" + fileName;
            if(fs.existsSync(removePath)) {
              fs.unlink(removePath, (errRemove) => {
                if (errRemove) {
                  return res.json({
                    error: true,
                    statusCode: 0,
                    message: "Xóa file PDF cũ không thành công",
                  });
                } else {
                  let fileName = getFileName(ebookContent.ebookpdfreview);
                  let removePath = publicPath + "/ebookPDF/pdf-review/" + fileName;
                  if(fs.existsSync(removePath)) {
                    fs.unlink(removePath, (errRemoveReview) => {
                      if (errRemoveReview) {
                        return res.json({
                          error: true,
                          statusCode: 0,
                          message: "Xóa file PDF review cũ không thành công",
                        });
                      }
                    });
                  }
                }
              });
            } 
          }

          // slipt pdf
          var pdfPath = appRoot + "\\public\\uploads\\ebookPDF\\" + req.pdfSaved;
          splitPDF(
            pdfPath,
            appRoot + "/public/uploads/ebookPDF/pdf-review",
            startPage,
            separatePage,
            req.pdfReviewSaved
          )
            .then()
        }
    
        // Check if contentType not null => update to DB
        if (contentType === "") {
          res.json({
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
      }
    })
  } catch (error) {
    res.json({
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
      res.json({
        error: true,
        statusCode: 0,
        message: "Thêm thể loại cho ebook không thành công",
      });
    } else {
      res.json({
        error: false,
        statusCode: 1,
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
      res.json({
        error: true,
        statusCode: 0,
        message: "Thêm tác giả của ebook không thành công",
      });
    } else {
      res.json({
        error: false,
        statusCode: 1,
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

const { express } = require('express');
const Ebook = require("../models/Ebook");
const { cloudinary } = require("../../utils/cloudinary");
const multer = require("multer");
const path = require("path");

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
  try {
    // const file = req.files['ebookAvatar'][0] ;
    // console.log(file);
    const data = req.body;
    console.log(data);
    res.json(data);
    // const fileStr = req.body.data;
    // const uploadResponse = await cloudinary.uploader.upload(fileStr, {
    //     upload_preset: 'ebookstore_setups',
    // });
    // console.log(uploadResponse.url);
    // res.json({ msg: 'yaya' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ err: "Something went wrong" });
  }
  // if (!newEbook.ebookname || !newEbook.ebookprice || !newEbook.ebookstatus) {
  //   res.json({
  //     error: true,
  //     statusCode: 0,
  //     message: "Thông tin ebook không được để trống",
  //   });
  // } else {
  //   Ebook.store(newEbook, function (err, ebook) {
  //     if (err) {
  //       res.json({
  //         error: true,
  //         statusCode: 0,
  //         message: "Lỗi! Thêm ebook không thành công",
  //       });
  //     } else {
  //       res.json({
  //         error: false,
  //         statusCode: 1,
  //         message: "Thêm ebook thành công",
  //       });
  //     }
  //   });
  // }
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

// Ebook uploadfile
const handleUploadFile = async (req, res) => {

  console.log(req.body);
  console.log(req.file);
  if (req.fileValidationError) {

      return res.send(req.fileValidationError);
  }
  else if (!req.file) {
      return res.send('Please select an image to upload');
  }

  // Display uploaded image for user validation
  res.send(`You have uploaded this image: <hr/><img src="/images/${req.file.filename}" width="500"><hr /><a href="/api/uploads">Upload another image</a>`);
  // });
}


const handleUploadMultipleFiles = async (req, res) => {
  console.log(req.body);
  console.log(req.file);
  if (req.fileValidationError) {
      return res.send(req.fileValidationError);
  }
  else if (!req.files) {
      return res.send('Please select an image to upload');
  }

  let result = "You have uploaded these images: <hr />";
  const files = req.files;
  let index, len;

  console.log(files);
  // Loop through all the uploaded images and display them on frontend
  for (index = 0, len = files.length; index < len; ++index) {
      result += `<img src="/image/${files[index].filename}" width="300" style="margin-right: 20px;">`;
  }
  result += '<hr/><a href="/upload">Upload more images</a>';
  res.send(result);

}


module.exports = {
  allEbook,
  getEbookByID,
  search,
  store,
  handleUploadFile,
  handleUploadMultipleFiles,
  update,
  destroy,
  restore,
};

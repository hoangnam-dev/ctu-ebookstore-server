const Ebook = require("../models/Ebook");

const getNewEbook = (req, res) => {
  Ebook.getNewEbook(function (err, ebooks) {
    if (err) {
      res.json({
        error: true,
        statusCode: 0,
        message: "Lỗi! Không truy xuất được dữ liệu",
      });
    } else {
      var resData = ebooks.map((data) => {
        // Handle Author list of the ebook
        var authorList = data.authorList.map((author) => {
          return {
            authorID: author.authorid,
            authorName: author.authorname,
          };
        });
        // return ebook
        return {
          ebookID: data.ebookid,
          ebookName: data.ebookname,
          ebookAvatar: data.ebookavatar,
          ebookPrice: data.ebookprice,
          ebookCreatedAt: data.ebookcreatedat,
          statusCode: data.ebookstatuscode,
          statusName: data.ebookstatusname,
          statusColor: data.ebookstatuscolor,
          authorList: authorList
        };
      });
      res.json(resData);
    }
  });
};
const getBestsellerEbook = (req, res) => {
  Ebook.getBestsellerEbook(function (err, ebooks) {
    if (err) {
      res.json({
        error: true,
        statusCode: 0,
        message: "Lỗi! Không truy xuất được dữ liệu",
      });
    } else {
      var resData = ebooks.map((data) => {
        // Handle Author list of the ebook
        var authorList = data.authorList.map((author) => {
          return {
            authorID: author.authorid,
            authorName: author.authorname,
          };
        });
        // return ebook
        return {
          totalSell: data.totalsale,
          ebookID: data.ebookid,
          ebookName: data.ebookname,
          ebookAvatar: data.ebookavatar,
          ebookPrice: data.ebookprice,
          ebookCreatedAt: data.ebookcreatedat,
          statusCode: data.ebookstatuscode,
          statusName: data.ebookstatusname,
          statusColor: data.ebookstatuscolor,
          authorList: authorList
        };
      });
      res.json(resData);
    }
  });
};

module.exports = {
  getNewEbook,
  getBestsellerEbook,
};

const db = require("../../config/db");
const moment = require("moment");
const { result } = require("lodash");
const util = require("util");

// Constructor
const Ebook = function (ebook) {
  this.ebookid = ebook.ebookID;
  this.ebookname = ebook.ebookName;
  this.ebookdescription = ebook.ebookDescription;
  this.ebookprice = ebook.ebookPrice;
  this.ebookavatar = ebook.ebookAvatar;
  this.ebookepub = ebook.ebookEPUB;
  this.ebookpdf = ebook.ebookPDF;
  this.ebookpdfreview = ebook.ebookPDFReview;
  this.ebookcreatedat = ebook.ebookCreatedAt;
  this.ebookreleasedat = ebook.ebookReleasedAt;
  this.ebookstatusid = ebook.ebookStatusID;
  this.supplierid = ebook.supplierID;
};

// Get list author of ebook
async function hasAuthor(ebookID) {
  return new Promise((resolve, reject) => {
    db.query(
      "SELECT author.authorid, author.authorname FROM authorofebook INNER JOIN author ON authorofebook.authorid = author.authorid WHERE authorofebook.ebookid = ?",
      [ebookID],
      async function (err, resSub) {
        if (err) {
          reject(err);
        } else {
          resolve(resSub);
        }
      }
    );
  });
}
// Get list category of ebook
async function hasCategory(ebookID) {
  return new Promise((resolve, reject) => {
    db.query(
      "SELECT category.categoryid, category.categoryname FROM categoryofebook INNER JOIN category ON categoryofebook.categoryid = category.categoryid WHERE categoryofebook.ebookid = ?",
      [ebookID],
      async function (err, resSub) {
        if (err) {
          reject(err);
        } else {
          resolve(resSub);
        }
      }
    );
  });
}
// Get list sale of ebook
async function hasSale(ebookID) {
  return new Promise((resolve, reject) => {
    db.query(
      "SELECT saleebook.*, sale.* FROM saleebook INNER JOIN sale ON saleebook.saleid = sale.saleid WHERE saleebook.ebookid = ?",
      [ebookID],
      async function (err, resSub) {
        if (err) {
          reject(err);
        } else {
          resolve(resSub);
        }
      }
    );
  });
}
// Get list imageebook of ebook
async function hasImages(ebookID) {
  return new Promise((resolve, reject) => {
    db.query(
      "SELECT imageebookid, imageebooksource FROM imageebook WHERE imageebook.ebookid = ?",
      [ebookID],
      async function (err, resSub) {
        if (err) {
          reject(err);
        } else {
          resolve(resSub);
        }
      }
    );
  });
}
// Get list ebookstatus of ebook
async function hasEbookStatus(ebookID) {
  return new Promise((resolve, reject) => {
    db.query(
      "SELECT ebookstatus.* FROM ebook INNER JOIN ebookstatus ON ebook.ebookstatusid = ebookstatus.ebookstatusid WHERE ebook.ebookid = ?",
      [ebookID],
      async function (err, resSub) {
        if (err) {
          reject(err);
        } else {
          resolve(resSub);
        }
      }
    );
  });
}
// Customer result,
async function resultEbook(res) {
  let listInfo = res.map(async (res) => {
    var authors = [];
    var categories = [];
    var sales = [];
    var images = [];
    var status = [];

    await hasAuthor(res.ebookid)
      .then(function (resAuthor) {
        authors = resAuthor;
      })
      .catch(function (errAuthor) {
        result(errAuthor, null);
      });

    await hasCategory(res.ebookid)
      .then(function (resCategory) {
        categories = resCategory;
      })
      .catch(function (errCategory) {
        result(errCategory, null);
      });

    await hasSale(res.ebookid)
      .then(function (resSale) {
        sales = resSale;
      })
      .catch(function (errSale) {
        result(errSale, null);
      });

    await hasEbookStatus(res.ebookid)
      .then(function (resEbookStt) {
        status = resEbookStt;
      })
      .catch(function (errEbookStt) {
        result(errEbookStt, null);
      });

    await hasImages(res.ebookid)
      .then(function (resImages) {
        images = resImages;
      })
      .catch(function (errImages) {
        result(errImages, null);
      });

    var ebookInfo = {
      ...res,
      authorList: authors,
      categoryList: categories,
      saleList: sales,
      imageebookList: images,
      ebookstatusList: status,
    };

    return ebookInfo;
  });

  const ebookData = await Promise.all(listInfo);
  return ebookData;
}

// Get all ebook
Ebook.getAll = function getAllEbook(result) {
  db.query(
    "SELECT ebookid, ebookname, ebookprice, ebookstatusid FROM ebook",
    async function (err, res) {
      if (err) {
        result(err, null);
      } else {
        const ebookData = await resultEbook(res);
        result(null, ebookData);
      }
    }
  );
};

// Get ebook by ID
Ebook.getEbookByID = function getEbookByID(ebookID, result) {
  db.query(
    "SELECT * FROM ebook WHERE ebookid = ?",
    ebookID,
    async function (err, res) {
      if (err) {
        result(err, null);
      } else {
        const ebookData = await resultEbook(res);
        result(null, ebookData);
      }
    }
  );
};

// Get ebook by categoryID
Ebook.getEbookByDirectoryID = function getEbookByDirectoryID(
  categoryID,
  result
) {
  db.query(
    "SELECT * FROM ebook WHERE categoryid = ?",
    [categoryID],
    function (err, res) {
      if (err) {
        result(err, null);
      } else {
        result(null, res);
      }
    }
  );
};

// Search ebook
Ebook.search = function searchEbook(col, val, result) {
  const sql = `SELECT * FROM ebook WHERE REPLACE(${col}, 'Đ', 'D') LIKE '%${val}%' AND ebookdeletedat IS NULL`;
  db.query(sql, async function (err, res) {
    if (err) {
      result(err, null);
    } else {
      const ebookData = await resultEbook(res);
      result(null, ebookData);
    }
  });
};

// Store ebook
Ebook.store = function storeEbook(newEbook, categoriesID, authorsID, result) {
  newEbook.ebookcreatedat = moment().format("YYYY-MM-DD HH:mm:ss");
  db.query("INSERT INTO ebook set ?", newEbook, async function (err, res) {
    if (err) {
      result(err, null);
    } else {
      var valuesCategory = [];
      categoriesID.forEach((categoryID) => {
        valuesCategory.push([res.insertId, categoryID]);
      });
      var valuesAuthor = [];
      authorsID.forEach((authorID) => {
        valuesAuthor.push([res.insertId, authorID]);
      });
      const insertCategory =
        "INSERT INTO categoryofebook (ebookid, categoryid) VALUES ?";
      const insertAuthor =
        "INSERT INTO authorofebook (ebookid, authorid) VALUES ?";
      db.query(insertCategory, [valuesCategory], function (errCate, resCate) {
        if (errCate) {
          result(errCate, null);
        } else {
          db.query(
            insertAuthor,
            [valuesAuthor],
            function (errAuthor, resAuthor) {
              if (errAuthor) {
                result(errAuthor, null);
              } else {
                result(null, res.insertId);
              }
            }
          );
        }
      });
    }
  });
};
// Store ebook
Ebook.storeCategory = function storeEbookCategory(
  ebookID,
  categoriesID,
  result
) {
  var values = [];
  categoriesID.forEach((categoryID) => {
    values.push([ebookID, categoryID]);
  });
  const sql = "INSERT INTO categoryofebook (ebookid, categoryid) VALUES ?";
  db.query(sql, [values], function (err, res) {
    if (err) {
      result(err, null);
    } else {
      result(null, res.insertId);
    }
  });
};
// Store ebook
Ebook.storeAuthor = function storeEbookAuthor(ebookID, authorsID, result) {
  var values = [];
  authorsID.forEach((authorID) => {
    values.push([ebookID, authorID]);
  });
  const sql = "INSERT INTO authorofebook (ebookid, authorid) VALUES ?";
  db.query(sql, [values], function (err, res) {
    if (err) {
      result(err, null);
    } else {
      result(null, res.insertId);
    }
  });
};

// Update ebook
Ebook.update = function updateEbook(ebookID, ebook, result) {
  var sql =
    "UPDATE ebook SET ebookname = ?, ebookdescription = ?, ebookprice = ?, ebookavatar = ?, ebookreleasedat = ?, ebookstatusid = ?, supplierid = ? WHERE ebookid = ?";
  var values = [
    ebook.ebookname,
    ebook.ebookdescription,
    ebook.ebookprice,
    ebook.ebookavatar,
    ebook.ebookreleasedat,
    ebook.ebookstatusid,
    ebook.supplierid,
    ebookID,
  ];
  if (ebook.ebookavatar === null) {
    sql =
      "UPDATE ebook SET ebookname = ?, ebookdescription = ?, ebookprice = ?, ebookreleasedat = ?, ebookstatusid = ?, supplierid = ? WHERE ebookid = ?";
    values = [
      ebook.ebookname,
      ebook.ebookdescription,
      ebook.ebookprice,
      ebook.ebookreleasedat,
      ebook.ebookstatusid,
      ebook.supplierid,
      ebookID,
    ];
  }
  db.query(sql, values, function (err, res) {
    if (err) {
      result(err, null);
    } else {
      result(null, res);
    }
  });
};

// Update ebook content
Ebook.updateEbookContent = function updateEbookContent(
  ebookID,
  contentType,
  ebookContent,
  ebookReviewContent,
  result
) {
  var sql = "UPDATE ebook SET ebookepub = ? WHERE ebookid = ?";
  if (contentType === "pdf") {
    sql = "UPDATE ebook SET ebookpdf = ?, ebookpdfreview = ? WHERE ebookid = ?";
  }
  db.query(
    sql,
    [ebookContent, ebookReviewContent, ebookID],
    function (err, res) {
      if (err) {
        result(err, null);
      } else {
        result(null, res);
      }
    }
  );
};

// Delete ebook
Ebook.delete = function deleteEbook(ebookID, result) {
  let now = moment().format("YYYY-MM-DD");
  db.query(
    "UPDATE ebook SET ebookdeletedat = ? WHERE ebookid = ?",
    [now, ebookID],
    function (err, res) {
      if (err) {
        result(err, null);
      } else {
        result(null, res);
      }
    }
  );
};

// Restore ebook
Ebook.restore = function restoreEbook(ebookID, result) {
  db.query(
    "UPDATE ebook SET ebookdeletedat = NULL WHERE ebookid = ?",
    [ebookID],
    function (err, res) {
      if (err) {
        result(err, null);
      } else {
        result(null, res);
      }
    }
  );
};

const query = util.promisify(db.query).bind(db);
Ebook.getSaleOrder = async function getSaleOrder(saleCode, result) {
  const sql = `SELECT sale.salecode, sale.salequantitymax, sale.salequantitycurrent, sale.salestatus, saleebook.saleebooktype as saleType, saleebook.salevalue as saleValue
  FROM sale 
  INNER JOIN saleebook ON sale.saleid = saleebook.saleid 
  WHERE sale.salecode = '${saleCode}'`;
  const data = await query(sql);
  result(null, data[0]);
};

module.exports = Ebook;

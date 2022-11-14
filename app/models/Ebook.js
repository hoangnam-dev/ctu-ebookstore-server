const db = require("../../config/db");
const moment = require("moment");

// Constructor
const Ebook = function (ebook) {
  this.ebookid = ebook.ebookID;
  this.ebookname = ebook.ebookName;
  this.ebookdescription = ebook.ebookDescription;
  this.ebookprice = ebook.ebookPrice;
  this.ebookavatar = ebook.ebookAvatar;
  this.ebookepub = ebook.ebookEPUB;
  this.ebookpdf = ebook.ebookPDF;
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
Ebook.store = function storeEbook(newEbook, result) {
  newEbook.ebookcreatedat = moment().format("YYYY-MM-DD HH:mm:ss");
  db.query("INSERT INTO ebook set ?", newEbook, function (err, res) {
    if (err) {
      result(err, null);
    } else {
      result(null, res.insertId);
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
  result
) {
  var sql = "UPDATE ebook SET ebookepub = ? WHERE ebookid = ?";
  if (contentType === "pdf") {
    sql = "UPDATE ebook SET ebookpdf = ? WHERE ebookid = ?";
  }
  db.query(sql, [ebookContent, ebookID], function (err, res) {
    if (err) {
      result(err, null);
    } else {
      result(null, res);
    }
  });
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

module.exports = Ebook;

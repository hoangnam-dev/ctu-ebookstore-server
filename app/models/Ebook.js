const db = require("../../config/db");
const moment = require('moment');

// Constructor
const Ebook = function (ebook) {
  this.ebookid = ebook.ebookID;
  this.ebookname = ebook.ebookName;
  this.ebookdescription = ebook.ebookDescription;
  this.ebookprice = ebook.ebookPrice;
  this.ebookavatar = ebook.ebookAvatar;
  this.ebookepub = ebook.ebookEpub;
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
      "SELECT author.authorid FROM authorofebook INNER JOIN author ON authorofebook.authorid = author.authorid WHERE authorofebook.ebookid = ?",
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
      "SELECT category.categoryid FROM categoryofebook INNER JOIN category ON categoryofebook.categoryid = category.categoryid WHERE categoryofebook.ebookid = ?",
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
      "SELECT imageebookid, imageebooksource FROM imageebookebook WHERE imageebookebook.ebookid = ?",
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
    var images = [];

    await hasAuthor(res.ebookid)
      .then(function (resAuthor) {
        authors = resAuthor;
      })
      .catch(function (err) {
        result(err, null);
      });

    await hasCategory(res.ebookid)
      .then(function (resCategory) {
        categories = resCategory;
      })
      .catch(function (err) {
        result(err, null);
      });

    await hasImages(res.ebookid)
      .then(function (resImages) {
        images = resImages;
      })
      .catch(function (err) {
        result(err, null);
      });

    var ebookInfo = {
      ...res,
      authorList: authors,
      categoryList: categories,
      imageList: images,
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
    function (err, res) {
      if (err) {
        result(err, null);
      } else {
        result(null, res);
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
  db.query(sql, function (err, res) {
    if (err) {
      result(err, null);
    } else {
      result(null, res);
    }
  });
};

// Store ebook
Ebook.store = function storeEbook(newEbook, result) {
  newEbook.ebookcreatedat = moment().format('YYYY-MM-DD HH:mm:ss');
  db.query("INSERT INTO ebook set ?", newEbook, function (err, res) {
    if (err) {
      result(err, null);
    } else {
      result(null, res.insertId);
    }
  });
};
// Store ebook images
Ebook.storeEbookImages = function storeEbookImages(ebookID, images, result) {
  var values = [];
  images.forEach((image) => {
    values.push([ebookID, image]);
  }); 
  const sql = "INSERT INTO imageebook (ebookid, imageebooksource) VALUES ?";
  db.query(sql, [values], function (err, res) {
    if (err) {
      result(err, null);
    } else {
      result(null, res.insertId);
    }
  });
};
// Store ebook
Ebook.storeCategory = function storeEbookCategory(ebookID, categoriesID, result) {
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
  db.query(
    "UPDATE ebook SET ebookname = ?, ebookdescription = ?, ebookprice = ?, ebookavatar = ?, ebookepub = ?, ebookpdf = ?, ebookcreateat = ?, ebookreleasedatat = ?, ebookstatusid = ?, inputinfoid = ?, supplierid = ?, WHERE ebookid = ?",
    [
      ebook.ebookname,
      ebook.ebookdescription,
      ebook.ebookprice,
      ebook.ebookavatar,
      ebook.ebookepub,
      ebook.ebookpdf,
      ebook.ebookcreateat,
      ebook.ebookreleasedat,
      ebook.ebookstatusid,
      ebook.supplierid,
      ebook.inputinfoid,
      ebookID,
    ],
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

module.exports = Ebook;

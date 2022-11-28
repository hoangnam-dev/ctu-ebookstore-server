const db = require("../../config/db");

// Constructor
const Sale = function (sale) {
  this.saleid = sale.saleID;
  this.salename = sale.saleName;
  this.salecontent = sale.saleContent;
  this.salestartat = sale.saleStartAt;
  this.saleendat = sale.saleEndAt;
};
// Get list detail of sale
async function hasDetail(saleID) {
  return new Promise((resolve, reject) => {
    const sql = `SELECT ebook.ebookid, ebook.ebookname, ebook.ebookavatar, ebook.ebookprice, saleebook.salevalue  FROM saleebook
    INNER JOIN ebook ON ebook.ebookid = saleebook.ebookid 
    WHERE saleebook.saleid = ${saleID}`;
    db.query(sql, async function (err, resSub) {
        if (err) {
          reject(err);
        } else {
          resolve(resSub);
        }
      }
    );
  });
}
// Sale result,
async function resultDetail(res) {
  let listInfo = res.map(async (res) => {
    var details = [];
    await hasDetail(res.saleid)
      .then(function (resDetail) {
        details = resDetail;
      })
      .catch(function (errDetail) {
        result(errDetail, null);
      });

    var saleInfo = {
      ...res,
      detailList: details,
    };

    return saleInfo;
  });

  const saleData = await Promise.all(listInfo);
  return saleData;
}
// Get all sale
Sale.getAll = function getAllSale(result) {
  db.query("SELECT saleid, salename, salestartat, saleendat FROM sale", function (err, res) {
    if (err) {
      result(err, null);
    } else {
      result(null, res);
    }
  });
};

// Get sale by ID
Sale.getSaleByID = function getSaleByID(saleID, result) {
  db.query("SELECT * FROM sale WHERE saleid = ?", [saleID], async function (err, res) {
    if (err) {
      result(err, null);
    } else {
      const resData = await resultDetail(res);
      result(null, resData);
    }
  });
};


// Search sale
Sale.search = function searchSale(col, val, result) {
  const sql = `SELECT * FROM sale WHERE REPLACE(${col}, 'Đ', 'D') LIKE '%${val}%'`;
    db.query(sql, function (err, res) {
      if (err) {
        result(err, null);
      } else {
        result(null, res);
      }
    });
  };

// Store sale
Sale.store = function storeSale(newSale, saleDetail, result) {
  var values = [];
  db.query("INSERT INTO sale set ?", newSale, function (err, res) {
    if (err) {
      result(err, null);
    } else {
      saleDetail.forEach((item) => {
        values.push([res.insertId,item.ebookID, item.saleValue]);
      });
      const insertSaleEbook = "INSERT INTO saleebook (saleid, ebookid, salevalue) VALUES ?"
      db.query(insertSaleEbook, [values], function (errSaleEbook, resSaleEbook) {
        if(errSaleEbook) {
          result(errSaleEbook, null);
        } else {
          result(null, res.insertId);
        }
      })
    }
  });
};

// Update sale
Sale.update = function updateSale(saleID, sale, result) {
  db.query(
    "UPDATE sale SET salename = ?,  salecontent = ?, salestartat = ?, saleendat = ? WHERE saleid = ?",
    [
      sale.salename,
      sale.salecontent,
      sale.salestartat,
      sale.saleendat,
      saleID,
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

// Delete sale
Sale.delete = function deleteSale(saleID, result) {
    db.query(
      "DELETE FROM saleebook WHERE saleid = ?",
      saleID,
      function (err, res) {
        if (err) {
          result(err, null);
        } else {
          db.query(
            "DELETE FROM sale WHERE saleid = ?",
            saleID,
            function (err, res) {
              if (err) {
                result(err, null);
              } else {
                result(null, res);
              }
            }
          );
        }
      }
    );
  };

module.exports = Sale;

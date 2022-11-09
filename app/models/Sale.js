const db = require("../../config/db");

// Constructor
const Sale = function (sale) {
  this.saleid = sale.saleID;
  this.salecode = sale.saleCode;
  this.salename = sale.saleName;
  this.salequantitymax = sale.saleQuantityMax;
  this.salequantitycurrent = sale.saleQuantityCurrent;
  this.salestatus = sale.saleStatus;
  this.salecontent = sale.saleContent;
  this.salestartat = sale.saleStartAt;
  this.saleendat = sale.saleEndAt;
};

// Get all sale
Sale.getAll = function getAllSale(result) {
  db.query("SELECT * FROM sale", function (err, res) {
    if (err) {
      result(err, null);
    } else {
      result(null, res);
    }
  });
};

// Get sale by ID
Sale.getSaleByID = function getSaleByID(saleID, result) {
  db.query("SELECT * FROM sale WHERE saleid = ?", saleID, function (err, res) {
    if (err) {
      result(err, null);
    } else {
      result(null, res);
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

// Get sale by ID
Sale.getSaleByID = function getSaleByID(saleID, result) {
  db.query("SELECT * FROM sale WHERE saleid = ?", saleID, function (err, res) {
    if (err) {
      result(err, null);
    } else {
      result(null, res);
    }
  });
};

// Store sale
Sale.store = function storeSale(newSale, result) {
  db.query("INSERT INTO sale set ?", newSale, function (err, res) {
    if (err) {
      result(err, null);
    } else {
      result(null, res.insertId);
    }
  });
};

// Update sale
Sale.update = function updateSale(saleID, sale, result) {
  console.log(saleID);
  db.query(
    "UPDATE sale SET salecode = ?, salename = ?, salequantitymax = ?,  salequantitycurrent = ?,  salestatus = ?,  salecontent = ?, salestartat = ?, saleendat = ? WHERE saleid = ?",
    [
      sale.salecode,
      sale.salename,
      sale.salequantitymax,
      sale.salequantitycurrent,
      sale.salestatus,
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

const db = require("../../config/db");

// Constructor
const SaleDetail = function (detail) {
  this.saleid = detail.saleID;
  this.ebookid = detail.ebookID;
  this.salevalue = detail.saleValue;
};


// Store sale
SaleDetail.store = function storeSaleDetail(newSaleDetail, result) {
  db.query("INSERT INTO saleebook set ?", [newSaleDetail], function (err, res) {
    if (err) {
      result(err, null);
    } else {
      result(null, res.insertId);
    }
  });
};

// Delete sale
SaleDetail.delete = function deleteSaleDetail(saleID, ebookID, result) {
    const sql = `DELETE FROM saleebook WHERE saleid = ${saleID} AND ebookid = ${ebookID}`;
  db.query(sql, function (err, res) {
      if (err) {
        result(err, null);
      } else {
        result(null, res);
      }
    }
  );
};


module.exports = SaleDetail;

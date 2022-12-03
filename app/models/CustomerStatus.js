const db = require("../../config/db");
const moment = require("moment");

// Constructor
const CustomerStatus = function (customerstatus) {
  this.customerstatusid = customerstatus.customerstatusID;
  this.customerstatuscode = customerstatus.customerstatusCode;
  this.customerstatusname = customerstatus.customerstatusName;
  this.customerstatuscolor = customerstatus.customerstatusColor;
};

// Get all customerstatus
CustomerStatus.getAll = function getAllCustomerStatus(result) {
  db.query(
    "SELECT * FROM customerstatus WHERE (customerstatusdeletedat IS NULL OR customerstatusdeletedat = 0)",
    function (err, res) {
      if (err) {
        result(err, null);
      } else {
        result(null, res);
      }
    }
  );
};

// Search customerstatus
CustomerStatus.search = function searchCustomerStatus(col, val, result) {
  const sql = `SELECT * FROM customerstatus WHERE REPLACE(${col}, 'Đ', 'D') LIKE '%${val}%' AND (customerstatusdeletedat IS NULL OR customerstatusdeletedat = 0)`;
  db.query(sql, function (err, res) {
    if (err) {
      result(err, null);
    } else {
      result(null, res);
    }
  });
};

// Get customerstatus by ID
CustomerStatus.getCustomerStatusByID = function getCustomerStatusByID(customerstatusID, result) {
  let sql =
    "SELECT * FROM customerstatus WHERE customerstatusid = ? AND (customerstatusdeletedat IS NULL OR customerstatusdeletedat = 0)";
  db.query(sql, customerstatusID, function (err, res) {
    if (err) {
      result(err, null);
    } else {
      result(null, res);
    }
  });
};

// Store customerstatus
CustomerStatus.store = function storeCustomerStatus(newCustomerStatus, result) {
  db.query("INSERT INTO customerstatus set ?", newCustomerStatus, function (err, res) {
    if (err) {
      result(err, null);
    } else {
      result(null, res.insertId);
    }
  });
};

// Update customerstatus
CustomerStatus.update = function updateCustomerStatus(customerstatus, result) {
  db.query(
    "UPDATE customerstatus SET customerstatuscode = ?, customerstatusname = ?, customerstatuscolor = ? WHERE customerstatusid = ?",
    [
      customerstatus.customerstatuscode,
      customerstatus.customerstatusname,
      customerstatus.customerstatuscolor,
      customerstatus.customerstatusid,
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

// Delete customerstatus
CustomerStatus.delete = function deleteCustomerStatus(customerstatusID, result) {
  let now = moment().format("YYYY-MM-DD HH:mm:ss");
  db.query(
    "UPDATE customerstatus SET customerstatusdeletedat = ? WHERE customerstatusid = ?",
    [now, customerstatusID],
    function (err, res) {
      if (err) {
        result(err, null);
      } else {
        result(null, res);
      }
    }
  );
};

// Restore customerstatus
CustomerStatus.restore = function restoreCustomerStatus(customerstatusID, result) {
  db.query(
    "UPDATE customerstatus SET customerstatusdeletedat = NULL WHERE customerstatusid = ?",
    [customerstatusID],
    function (err, res) {
      if (err) {
        result(err, null);
      } else {
        result(null, res);
      }
    }
  );
};

module.exports = CustomerStatus;

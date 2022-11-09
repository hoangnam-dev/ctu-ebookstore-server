const db = require("../../config/db");
const moment = require("moment");

// Constructor
const Supplier = function (supplier) {
  this.supplierid = supplier.supplierID;
  this.suppliername = supplier.supplierName;
  this.supplieraddress = supplier.supplierAddress;
  this.supplieremail = supplier.supplierEmail;
  this.supplierphone = supplier.supplierPhone;
  this.supplierbanknumber = supplier.supplierBankNumber;
  this.wardid = supplier.wardID;
};

// Get all supplier
Supplier.getAll = function getAllSupplier(result) {
  db.query(
    "SELECT * FROM supplier WHERE supplierdeletedat IS NULL",
    function (err, res) {
      if (err) {
        result(err, null);
      } else {
        result(null, res);
      }
    }
  );
};

// Search supplier
Supplier.search = function searchSupplier(col, val, result) {
  const sql = `SELECT * FROM supplier WHERE REPLACE(${col}, 'Đ', 'D') LIKE '%${val}%' AND supplierdeletedat IS NULL`;
  db.query(sql, function (err, res) {
    if (err) {
      result(err, null);
    } else {
      result(null, res);
    }
  });
};

// Get supplier by ID
Supplier.getSupplierByID = function getSupplierByID(supplierID, result) {
  let sql =
    "SELECT supplier.*, ward.districtid, district.provinceid FROM supplier INNER JOIN ward ON supplier.wardid = ward.wardid INNER JOIN district ON ward.districtid = district.districtid WHERE supplierid = ?";
  db.query(sql, supplierID, function (err, res) {
    if (err) {
      result(err, null);
    } else {
      result(null, res);
    }
  });
};

// Store supplier
Supplier.store = function storeSupplier(newSupplier, result) {
  db.query("INSERT INTO supplier set ?", newSupplier, function (err, res) {
    if (err) {
      result(err, null);
    } else {
      result(null, res.insertId);
    }
  });
};

// Update supplier
Supplier.update = function updateSupplier(supplier, result) {
  db.query(
    "UPDATE supplier SET suppliername = ?, supplieraddress = ?, supplieremail = ?, supplierphone = ?, supplierbanknumber = ?, wardid = ? WHERE supplierid = ?",
    [
      supplier.suppliername,
      supplier.supplieraddress,
      supplier.supplieremail,
      supplier.supplierphone,
      supplier.supplierbanknumber,
      supplier.wardid,
      supplier.supplierid,
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

// Delete supplier
Supplier.delete = function deleteSupplier(supplierID, result) {
  let now = moment().format("YYYY-MM-DD HH:mm:ss");
  db.query(
    "UPDATE supplier SET supplierdeletedat = ? WHERE supplierid = ?",
    [now, supplierID],
    function (err, res) {
      if (err) {
        result(err, null);
      } else {
        result(null, res);
      }
    }
  );
};

// Restore supplier
Supplier.restore = function restoreSupplier(supplierID, result) {
  db.query(
    "UPDATE supplier SET supplierdeletedat = NULL WHERE supplierid = ?",
    [supplierID],
    function (err, res) {
      if (err) {
        result(err, null);
      } else {
        result(null, res);
      }
    }
  );
};

module.exports = Supplier;

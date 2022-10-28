const db = require('../../config/db');

// Constructor
const Supplier = function(supplier) {
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
    db.query("SELECT * FROM supplier", function(err, res) {
        if(err) {
            result(err, null);
        } else {
            result(null, res);
        }
    });
};

// Get supplier by ID
Supplier.getSupplierByID = function getSupplierByID(supplierID, result) {
    db.query("SELECT * FROM supplier WHERE supplierid = ?", supplierID, function(err, res) {
        if(err) {
            result(err, null);
        } else {
            result(null, res);
        }
    });
};

// Store supplier
Supplier.store = function storeSupplier(newSupplier, result) {
    db.query("INSERT INTO supplier set ?", newSupplier, function (err, res) {

        if(err) {
            result(err, null);
        }
        else{
            result(null, res.insertId);
        }
    });
};

// Update supplier
Supplier.update = function updateSupplier(supplierID, supplier, result) {
    console.log(supplierID);
    db.query("UPDATE supplier SET suppliername = ?, supplieraddress = ?, supplieremail = ?, supplierphone = ?, supplierbanknumber = ?,supplierwardid = ?, WHERE supplierid = ?",
    [supplier.suppliername, supplier.supplieraddress, supplier.supplieremail, supplier.supplierphone, supplier.supplierbanknumber, supplier.wardid ,supplierID],
    function(err, res) {
        if(err) {
            result(null, err);
        }
        else{
            result(null, res);
        }
    });
};

// Delete supplier
Supplier.delete = function deleteSupplier(supplierID, result) {
    db.query("DELETE FROM supplier WHERE supplierid = ?", supplierID, function(err, res) {
        if(err) {
            result(null, err);
        }
        else{
            result(null, res);
        }
    })
};

module.exports = Supplier;

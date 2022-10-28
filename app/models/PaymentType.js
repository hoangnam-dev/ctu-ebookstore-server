const db = require('../../config/db');

// Constructor
const PaymentType = function(paymenttype) {
    this.paymenttypeid = paymenttype.paymenttypeID;
    this.paymenttypename = paymenttype.paymenttypeName;
};

// Get all paymenttype
PaymentType.getAll = function getAllPaymentType(result) {
    db.query("SELECT * FROM paymenttype", function(err, res) {
        if(err) {
            result(err, null);
        } else {
            result(null, res);
        }
    });
};

// Get paymenttype by ID
PaymentType.getPaymentTypeByID = function getPaymentTypeByID(paymenttypeID, result) {
    db.query("SELECT * FROM paymenttype WHERE paymenttypeid = ?", paymenttypeID, function(err, res) {
        if(err) {
            result(err, null);
        } else {
            result(null, res);
        }
    });
};

// Store paymenttype
PaymentType.store = function storePaymentType(newPaymentType, result) {
    db.query("INSERT INTO paymenttype set ?", newPaymentType, function (err, res) {

        if(err) {
            result(err, null);
        }
        else{
            result(null, res.insertId);
        }
    });
};

// Update paymenttype
PaymentType.update = function updatePaymentType(paymenttypeID, paymenttype, result) {
    console.log(paymenttypeID);
    db.query("UPDATE paymenttype SET paymenttypename = ? WHERE paymenttypeid = ?",
    [paymenttype.paymenttypename, paymenttypeID],
    function(err, res) {
        if(err) {
            result(null, err);
        }
        else{
            result(null, res);
        }
    });
};

// Delete paymenttype
PaymentType.delete = function deletePaymentType(paymenttypeID, result) {
    db.query("DELETE FROM paymenttype WHERE paymenttypeid = ?", paymenttypeID, function(err, res) {
        if(err) {
            result(null, err);
        }
        else{
            result(null, res);
        }
    })
};

module.exports = PaymentType;

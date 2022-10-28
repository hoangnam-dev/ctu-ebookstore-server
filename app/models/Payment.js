const db = require('../../config/db');

// Constructor
const Payment = function(payment) {
    this.paymentid = payment.paymentID;
    this.paymentname = payment.paymentName;
    this.paymentnumber = payment.paymentNumber;
    this.paymenttypeid = payment.paymentTypeID;
};

// Get all payment
Payment.getAll = function getAllPayment(result) {
    db.query("SELECT * FROM payment", function(err, res) {
        if(err) {
            result(err, null);
        } else {
            result(null, res);
        }
    });
};

// Get payment by ID
Payment.getPaymentByID = function getPaymentByID(paymentID, result) {
    db.query("SELECT * FROM payment WHERE paymentid = ?", paymentID, function(err, res) {
        if(err) {
            result(err, null);
        } else {
            result(null, res);
        }
    });
};

// Store payment
Payment.store = function storePayment(newPayment, result) {
    db.query("INSERT INTO payment set ?", newPayment, function (err, res) {

        if(err) {
            result(err, null);
        }
        else{
            result(null, res.insertId);
        }
    });
};

// Update payment
Payment.update = function updatePayment(paymentID, payment, result) {
    console.log(paymentID);
    db.query("UPDATE payment SET paymentname = ?, paymentnumber = ?, paymenttypeid = ? WHERE paymentid = ?",
    [payment.paymentname, payment.paymentnumber, payment.paymenttypeid, paymentID],
    function(err, res) {
        if(err) {
            result(null, err);
        }
        else{
            result(null, res);
        }
    });
};

// Delete payment
Payment.delete = function deletePayment(paymentID, result) {
    db.query("DELETE FROM payment WHERE paymentid = ?", paymentID, function(err, res) {
        if(err) {
            result(null, err);
        }
        else{
            result(null, res);
        }
    })
};

module.exports = Payment;

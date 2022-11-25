const db = require("../../config/db");
const moment = require("moment");

// Constructor
const PaypalPayment = function (paypal) {
  this.orderid = paypal.orderID;
  this.paymentid = paypal.paymentID;
  this.payerid = paypal.payerID;
};

// Store paypal payment transaction
PaypalPayment.store = function storeTransation(newTransation, result) {
    console.log(newTransation);
    newTransation.createdat = moment().format('YYYY-MM-DD HH:mm');
    db.query("INSERT INTO paypal_transaction set ?", newTransation, function (err, res) {
      if (err) {
        console.log(err);
        result(err, null);
      } else {
        result(null, res.insertId);
      }
    });
  };

  module.exports = PaypalPayment;
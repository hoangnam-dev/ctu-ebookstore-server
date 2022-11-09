const db = require('../../config/db');

// Constructor
const Order = function(order) {
    this.orderid = order.orderID;
    this.ordertotalprice = order.orderTotalPrice;
    this.ordercreateat = order.orderCreateAt;
    this.orderstatus = order.orderStatus;
    this.paymentid = order.paymentID;
    this.customerid = order.customerID;
};

// Get all order
Order.getAll = function getAllOrder(result) {
    db.query("SELECT * FROM order_tbl", function(err, res) {
        if(err) {
            result(err, null);
        } else {
            result(null, res);
        }
    });
};

// Get order by ID
Order.getOrderByID = function getOrderByID(orderID, result) {
    db.query("SELECT * FROM order_tbl WHERE orderid = ?", orderID, function(err, res) {
        if(err) {
            result(err, null);
        } else {
            result(null, res);
        }
    });
};

// Store order
Order.store = function storeOrder(newOrder, result) {
    db.query("INSERT INTO order_tbl set ?", newOrder, function (err, res) {

        if(err) {
            result(err, null);
        }
        else{
            result(null, res.insertId);
        }
    });
};

// Update order
Order.update = function updateOrder(orderID, order, result) {
    console.log(orderID);
    db.query("UPDATE order_tbl SET orderstatus = ? WHERE orderid = ?",
    [order.orderstatus, orderID],
    function(err, res) {
        if(err) {
            result(err, null);
        }
        else{
            result(null, res);
        }
    });
};

// Delete order
Order.delete = function deleteOrder(orderID, result) {
    db.query("DELETE FROM order_tbl WHERE orderid = ?", orderID, function(err, res) {
        if(err) {
            result(err, null);
        }
        else{
            result(null, res);
        }
    })
};

module.exports = Order;

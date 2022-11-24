const db = require("../../config/db");
const moment = require("moment");
const util = require("util");
const { log } = require("console");

// Constructor
const Order = function (order) {
  this.orderid = order.orderID;
  this.ordertotalprice = order.orderTotalPrice;
  this.orderstatus = order.orderStatus;
  this.ordercreatedat = order.orderCreatedAt;
  this.ordernote = order.orderNote;
  this.customerid = order.customerID;
};

const generateString = (length) => {
  const characters ='ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  const charactersLength = characters.length;
  for ( let i = 0; i < length; i++ ) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength)); 
  } 
  return result; 
}

// Get all order
Order.getAll = function getAllOrder(result) {
  db.query("SELECT * FROM order_tbl", function (err, res) {
    if (err) {
      result(err, null);
    } else {
      result(null, res);
    }
  });
};

// Get order by ID
Order.getOrderByID = function getOrderByID(orderID, result) {
  db.query(
    "SELECT * FROM order_tbl WHERE orderid = ?",
    orderID,
    function (err, res) {
      if (err) {
        result(err, null);
      } else {
        result(null, res);
      }
    }
  );
};

// Store order
Order.store = function storeOrder(newOrder, itemList, result) {
  newOrder.ordercreatedat = moment().format("YYYY-MM-DD HH:mm:ss");
  db.query("INSERT INTO order_tbl set ?", newOrder, function (err, res) {
    if (err) {
        console.log(err);
      result(err, null);
    } else {
      var detailorderQuantity = 1;
      var values = [];
      itemList.map((item) => {
        values.push([item.ebookID, res.insertId, item.ebookPrice, detailorderQuantity]);
      });
      const sql = "INSERT INTO detailorder (ebookid, orderid, detailorderprice, detailorderquantity) VALUES ?";
      db.query(sql, [values], function (errDetail, resDetail) {
        if (errDetail) {
            console.log(errDetail);
          result(errDetail, null);
        } else {
          result(null, res.insertId);
        }
      });
    }
  });
};

// Update order status
const query = util.promisify(db.query).bind(db);
Order.completeOrder = async function completeOrder(orderID, orderStatus, customerID, result) {
  const sqlDetail = `SELECT ebookid FROM detailorder WHERE orderid = ${orderID}`;
  const data = await query(sqlDetail);
  var licenseCreatedAt = moment().format("YYYY-MM-DD HH:mm:ss");

  db.query(
    "UPDATE order_tbl SET orderstatus = ? WHERE orderid = ?",
    [orderStatus, orderID],
    function (err, res) {
      if (err) {
        result(err, null);
      } else {
        var values = [];
        data.map((item) => {

            values.push([item.ebookid, customerID, generateString(5), licenseCreatedAt]);
        });
        console.log(values);
        const sql = "INSERT INTO license (ebookid, customerid, licensecode, licensecreatedat) VALUES ?";
        db.query(sql, [values], function (errLicense, resLicense) {
          if (errLicense) {
            result(errLicense, null);
          } else {
            result(null, res);
          }
        });
      }
    }
  );
};


Order.complete = async function complete(orderID, orderStatus, customerID, expiresBorrow, result) {
  const sql = `SELECT ebookid FROM detailorder WHERE orderid = ${orderID}`;
  const data = await query(sql);
  var values = [];
  data.map((item) => {
    if(expiresBorrow !== undefined) {
      values.push([item.ebookid, orderID, 1, expiresBorrow]);
    } else {
      values.push([item.ebookid, orderID]);
    }
  });
 console.log(values);
  // db.query(
  //   "UPDATE order_tbl SET orderstatus = ? WHERE orderid = ?",
  //   [orderStatus, orderID],
  //   function (err, res) {
  //     if (err) {
  //       result(err, null);
  //     } else {
  //       result(null, res);
  //     }
  //   }
  // );
};

// Update order
Order.update = function updateOrder(orderID, order, result) {
  console.log(orderID);
  db.query(
    "UPDATE order_tbl SET orderstatus = ? WHERE orderid = ?",
    [order.orderstatus, orderID],
    function (err, res) {
      if (err) {
        result(err, null);
      } else {
        result(null, res);
      }
    }
  );
};

// Delete order
Order.delete = function deleteOrder(orderID, result) {
  db.query(
    "DELETE FROM order_tbl WHERE orderid = ?",
    orderID,
    function (err, res) {
      if (err) {
        result(err, null);
      } else {
        result(null, res);
      }
    }
  );
};

module.exports = Order;

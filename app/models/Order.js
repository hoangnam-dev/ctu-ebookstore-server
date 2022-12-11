const db = require("../../config/db");
const moment = require("moment");
const util = require("util");

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


// Get list detail of order
async function ofCustomer(customerID) {
  return new Promise((resolve, reject) => {
    const sql = `SELECT customerid, customername, customeremail FROM customer WHERE customerid = ${customerID}`;
    db.query(sql, async function (err, resSub) {
        if (err) {
          reject(err);
        } else {
          resolve(resSub);
        }
      }
    );
  });
}

// Get list detail of order
async function hasDetail(orderID) {
  return new Promise((resolve, reject) => {
    const sql = `SELECT ebook.ebookid, ebook.ebookname, detailorder.* FROM detailorder 
        INNER JOIN ebook ON detailorder.ebookid = ebook.ebookid
        WHERE detailorder.orderid = ${orderID}`;
    db.query(sql, [orderID], async function (err, resSub) {
        if (err) {
          reject(err);
        } else {
          resolve(resSub);
        }
      }
    );
  });
}


// Order result,
async function resultOrder(res) {
  let listInfo = res.map(async (res) => {
    var detail = [];
    var customer = {};

    await hasDetail(res.orderid)
      .then(function (resOrder) {
        detail = resOrder;
      })
      .catch(function (errOrder) {
        result(errOrder, null);
      });

    await ofCustomer(res.customerid)
      .then(function (resCustomer) {
        customer = resCustomer[0];
      })
      .catch(function (errCustomer) {
        result(errCustomer, null);
      });

    var orderInfo = {
      ...res,
      detailList: detail,
      customer: customer
    };
    return orderInfo;
  });

  const resultData = await Promise.all(listInfo);
  return resultData;
}

// Get all order
Order.getAll = function getAllOrder(result) {
  db.query("SELECT * FROM order_tbl WHERE orderstatus = 1", async function (err, res) {
    if (err) {
      result(err, null);
    } else {
      const orderData = await resultOrder(res);
      result(null, orderData)
    }
  });
};

// Get order by ID
Order.getOrderByID = function getOrderByID(orderID, result) {
  db.query(
    "SELECT * FROM order_tbl WHERE orderid = ?",
    orderID,
    async function (err, res) {
      if (err) {
        result(err, null);
      } else {
        const orderData = await resultOrder(res);
        result(null, orderData);
      }
    }
  );
};

// Search order
Order.search = function searchOrder(orderID, result) {
  const sql =
    `SELECT * FROM order_tbl WHERE orderid LIKE '%${orderID}%'`;
  db.query(sql, function (err, res) {
    if (err) {
      result(err, null);
    } else {
      result(null, res);
    }
  });
};

// Store order
Order.store = function storeOrder(newOrder, itemList, result) {
  newOrder.ordercreatedat = moment().format("YYYY-MM-DD HH:mm:ss");
  db.query("INSERT INTO order_tbl set ?", newOrder, function (err, res) {
    if (err) {
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
          // Delete the order when can create deltail order
          const sqlDel = `DELETE FROM order_tbl WHERE orderid = '${res.insertId}'`;
          db.query(sql, [values], function (errDel, resDel) {
            if(errDel) {
              result(null, errDel);
            } else {
              result(errDetail, null);
            }

          });
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


// Order.complete = async function complete(orderID, orderStatus, customerID, expiresBorrow, result) {
//   const sql = `SELECT ebookid FROM detailorder WHERE orderid = ${orderID}`;
//   const data = await query(sql);
//   var values = [];
//   data.map((item) => {
//     if(expiresBorrow !== undefined) {
//       values.push([item.ebookid, orderID, 1, expiresBorrow]);
//     } else {
//       values.push([item.ebookid, orderID]);
//     }
//   });
//   // db.query(
//   //   "UPDATE order_tbl SET orderstatus = ? WHERE orderid = ?",
//   //   [orderStatus, orderID],
//   //   function (err, res) {
//   //     if (err) {
//   //       result(err, null);
//   //     } else {
//   //       result(null, res);
//   //     }
//   //   }
//   // );
// };


// Update order
Order.updateStatus = function updateOrder(orderID, orderStatus, result) {
  db.query(
    "UPDATE order_tbl SET orderstatus = ? WHERE orderid = ?",
    [orderStatus, orderID],
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
Order.destroy = function destroyOrder(orderID, result) {
  db.query(
    "DELETE FROM detailorder WHERE orderid = ?",
    orderID,
    function (errDetail, resDetail) {
      if (errDetail) {
        result(errDetail, null);
      } else {
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
      }
    }
  );
};

module.exports = Order;

const db = require("../../config/db");
const moment = require("moment");

// Constructor
const Customer = function (customer) {
  this.customerid = customer.customerID;
  this.customername = customer.customerName;
  this.customeremail = customer.customerEmail;
  this.customerpassword = customer.customerPassword;
  this.customeravatar = customer.customerAvatar;
  this.customercreatedat = customer.customerCreatedAt;
  this.customerstatusid = customer.customerStatusID;
};

// Get list customerstatus of customer
async function hasCustomerStatus(customerID) {
  return new Promise((resolve, reject) => {
    db.query(
      "SELECT customerstatus.* FROM customer INNER JOIN customerstatus ON customer.customerstatusid = customerstatus.customerstatusid WHERE customer.customerid = ? AND customerstatus.customerstatusdeletedat IS NULL OR customerstatus.customerstatusdeletedat = 0",
      [customerID],
      async function (err, resSub) {
        if (err) {
          reject(err);
        } else {
          resolve(resSub);
        }
      }
    );
  });
}

// Customer result,
async function resultCustomer(res) {
  let listInfo = res.map(async (res) => {
    var status = [];

    await hasCustomerStatus(res.customerid)
      .then(function (resStatus) {
        status = resStatus;
      })
      .catch(function (errStatus) {
        result(errStatus, null);
      });

    var customerInfo = {
      ...res,
      statusList: status,
    };
    return customerInfo;
  });

  const resultData = await Promise.all(listInfo);
  return resultData;
}

// Get all customer
Customer.getAll = function getAllCustomer(result) {
  db.query("SELECT * FROM customer WHERE customerdeletedat IS NULL OR customerdeletedat = 0", async function (err, res) {
    if (err) {
      result(err, null);
    } else {
      const customerData = await resultCustomer(res);
      result(null, customerData);
    }
  });
};

// Get customer by ID
Customer.getCustomerByID = function getCustomerByID(customerID, result) {
  db.query(
    "SELECT * FROM customer WHERE customerid = ? AND customerdeletedat IS NULL OR customerdeletedat = 0",
    customerID,
    async function (err, res) {
      if (err) {
        result(err, null);
      } else {
        const customerData = await resultCustomer(res);
        result(null, customerData);
      }
    }
  );
};

// Get customer by ID
Customer.getPassword = function getPassword(customerID, result) {
  db.query(
    "SELECT customerpassword FROM customer WHERE customerid = ?",
    customerID,
    async function (err, res) {
      if (err) {
        result(err, null);
      } else {
        result(null, res[0].customerpassword);
      }
    }
  );
};

// Search customer
Customer.search = function searchCustomer(col, val, result) {
  const sql = `SELECT * FROM customer WHERE REPLACE(${col}, 'Đ', 'D') LIKE '%${val}%' AND customerdeletedat IS NULL OR customerdeletedat = 0`;

  db.query(sql, async function (err, res) {
    if (err) {
      result(err, null);
    } else {
      const customerData = await resultCustomer(res);
      result(null, customerData);
    }
  });
};

// Store customer
Customer.store = function storeCustomer(newCustomer, result) {
  newCustomer.customercreatedat = moment().format("YYYY-MM-DD HH:mm:ss");
  db.query("INSERT INTO customer SET ?", newCustomer, function (err, res) {
    if (err) {
      result(err, null);
    } else {
      result(null, res.insertId);
    }
  });
};

// Get customer by ID
Customer.checkEmail = function checkEmail(customerEmail, result) {
  db.query(
    "SELECT customerid FROM customer WHERE customeremail = ?",
    [customerEmail],
    async function (err, res) {
      if (err) {
        result(err, null);
      } else {
        result(null, res);
      }
    }
  );
};

// Update customer
Customer.update = function updateCustomer(customerID, customer, result) {
  db.query(
    "UPDATE customer SET customername = ?, customeremail = ?, customerstatusid = ? WHERE customerid = ?",
    [
      customer.customername,
      customer.customeremail,
      customer.customerstatusid,
      customerID,
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
// Chagne customer avatar
Customer.changeAvatar = function changeAvatar(customerID, customerAvatar, result) {
  const sql = "UPDATE customer SET customeravatar = ? WHERE customerid = ?";
  db.query(sql, [customerAvatar, customerID], function (err, res) {
    if (err) {
      result(err, null);
    } else {
      result(null, res);
    }
  });
};
// Change customer password
Customer.changePassword = function changePassword(customerID, customerPassword, result) {
  const sql = "UPDATE customer SET customerpassword = ? WHERE customerid = ?";
  db.query(sql, [customerPassword, customerID], function (err, res) {
    if (err) {
      result(err, null);
    } else {
      result(null, res);
    }
  });
};

// Delete customer
Customer.delete = function deleteCustomer(customerID, result) {
  let now = moment().format("YYYY-MM-DD HH:mm:ss");
  db.query(
    "UPDATE customer SET customerdeletedat = ? WHERE customerid = ?",
    [now, customerID],
    function (err, res) {
      if (err) {
        result(err, null);
      } else {
        result(null, res);
      }
    }
  );
};

// Restore customer
Customer.restore = function restoreCustomer(customerID, result) {
  db.query(
    "UPDATE customer SET customerdeletedat = NULL WHERE customerid = ?",
    [customerID],
    function (err, res) {
      if (err) {
        result(err, null);
      } else {
        result(null, res);
      }
    }
  );
};

module.exports = Customer;

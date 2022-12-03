const db = require("../../config/db");
const moment = require("moment");

// Constructor
const CustomerAuth = function (customer) {
  this.customerid = customer.customerID;
  this.customername = customer.customerName;
  this.customeremail = customer.customerEmail;
  this.customerpassword = customer.customerPassword;
  this.customeravatar = customer.customerAvatar;
  this.customerstatusid = 1;
};

// Get list customerstatus of customer
async function hasCustomerStatus(customerID) {
  return new Promise((resolve, reject) => {
    db.query(
      "SELECT customerstatus.* FROM customer INNER JOIN customerstatus ON customer.customerstatusid = customerstatus.customerstatusid WHERE customer.customerid = ? ANd customerstatus.customerstatusdeletedat  IS NULL AND customer.customerstatusdeletedat = 0",
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
// Get list order_tbl of customer
async function hasOrder(customerID) {
  return new Promise((resolve, reject) => {
    db.query(
      "SELECT * FROM order_tbl WHERE order_tbl.customerid = ?",
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

// Get list customerstatus of customer
async function hasEbook(customerID) {
  return new Promise((resolve, reject) => {
    const sql = `SELECT ebook.ebookid, ebook.ebookname, ebook.ebookavatar, license.* FROM customer 
        INNER JOIN license ON customer.customerid = license.customerid 
        INNER JOIN ebook ON license.ebookid = ebook.ebookid 
        WHERE customer.customerid = ${customerID} AND (licenseexpires IS NULL OR datediff(licenseexpires, CURDATE()) > 0) AND ebook.ebookdeletedat IS NULL OR ebook.ebookdeletedat = 0`;
    db.query(sql, [customerID], async function (err, resSub) {
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
    var orders = [];
    var ebookOwn = [];

    await hasCustomerStatus(res.customerid)
      .then(function (resStatus) {
        status = resStatus;
      })
      .catch(function (errStatus) {
        result(errStatus, null);
      });

    await hasOrder(res.customerid)
      .then(function (resOrder) {
        orders = resOrder
        console.log(resOrder);
      })
      .catch(function (errOrder) {
        result(errOrder, null);
      });

    await hasEbook(res.customerid)
      .then(function (resEbook) {
        ebookOwn = resEbook
      })
      .catch(function (errEbook) {
        result(errEbook, null);
      });

    var customerInfo = {
      ...res,
      statusList: status,
      orderList: orders,
      ebookOwnList: ebookOwn,
    };
    return customerInfo;
  });

  const resultData = await Promise.all(listInfo);
  return resultData;
}

// Login
CustomerAuth.checkCustomerLogin = function checkCustomerLogin(customerEmail, result) {
  console.log(customerEmail);
  const sql = "SELECT * FROM customer WHERE customeremail = '" + customerEmail + "'";
  db.query(sql, async function (err, res) {
    if (err) {
      result(err, null);
    } else {
      const customerData = await resultCustomer(res);
      result(null, customerData);
    }
  });
};
// Login
CustomerAuth.getCustomerLoginInfo = function  getCustomerLoginInfo(customerID, result) {
  const sql = "SELECT * FROM customer WHERE customerid = '" + customerID + "'";
  db.query(sql, async function (err, res) {
    if (err) {
      result(err, null);
    } else {
      const customerData = await resultCustomer(res);
      result(null, customerData);
    }
  });
};

// Update customer
// Get customer by ID
CustomerAuth.checkEmail = function checkEmail(customerEmail, result) {
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

// Store user resgister
CustomerAuth.store = function storeCustomer(newCustomer, result) {
  newCustomer.customercreatedat = moment().format("YYYY-MM-DD HH:mm:ss");
  db.query("INSERT INTO customer SET ?", newCustomer, function (err, res) {
    if (err) {
      result(err, null);
    } else {
      result(null, res.insertId);
    }
  });
};

// Profile
CustomerAuth.profile = function profile(customerID, result) {
  db.query(
    "SELECT * FROM customer WHERE customerid = ?",
    customerID,
    async function (err, res) {
      if (err) {
        result(err, null);
      } else {
        const customerData = await resultCustomer(res);
        console.log(customerData);
        result(null, customerData);
      }
    }
  );
};

// Update Profile
CustomerAuth.checkEmail = function checkEmail(customerEmail, result) {
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
CustomerAuth.update = function updateProfile(customerID, customer, result) {
  db.query(
    "UPDATE customer SET customername = ?, customeremail = ? WHERE customerid = ?",
    [
      customer.customername,
      customer.customeremail,
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
CustomerAuth.changeAvatar = function changeAvatar(customerID, customerAvatar, result) {
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
CustomerAuth.getPassword = function getPassword(customerID, result) {
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
CustomerAuth.changePassword = function changePassword(customerID, customerPassword, result) {
  const sql = "UPDATE customer SET customerpassword = ? WHERE customerid = ?";
  db.query(sql, [customerPassword, customerID], function (err, res) {
    if (err) {
      result(err, null);
    } else {
      result(null, res);
    }
  });
};

module.exports = CustomerAuth;

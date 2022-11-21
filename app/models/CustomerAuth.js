const db = require("../../config/db");

// Constructor
const CustomerAuth = function (customer) {
  this.customeremail = customer.customerEmail;
  this.customerpassword = customer.customerPassword;
};

// Get list customerstatus of customer
async function hasCustomerStatus(customerID) {
  return new Promise((resolve, reject) => {
    db.query(
      "SELECT customerstatus.* FROM customer INNER JOIN customerstatus ON customer.customerstatusid = customerstatus.customerstatusid WHERE customer.customerid = ?",
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
    const sql = `SELECT ebook.ebookid, license.* FROM customer 
        INNER JOIN license ON customer.customerid = license.customerid 
        INNER JOIN ebook ON license.ebookid = ebook.ebookid 
        WHERE customer.customerid = ${customerID}`;
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
    var ebookOwn = [];

    await hasCustomerStatus(res.customerid)
      .then(function (resStatus) {
        status = resStatus;
      })
      .catch(function (errStatus) {
        result(errStatus, null);
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
      ebookOwnList: ebookOwn,
    };
    return customerInfo;
  });

  const resultData = await Promise.all(listInfo);
  return resultData;
}

// Login
CustomerAuth.checkCustomerLogin = function checkCustomerLogin(customerEmail, result) {
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
CustomerAuth.getCustomerLoginInfo = function getCustomerLoginInfo(customerID, result) {
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

module.exports = CustomerAuth;

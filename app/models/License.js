const db = require("../../config/db");
const moment = require("moment");

// Constructor
const License = function (license) {
  this.licensecode = license.licenseCode;
  this.licensestatus = license.licenseStatus;
  this.licenseisrent = license.licenseIsRent;
  this.licenseexpires = license.licenseExpires;
  this.licensecreatedat = license.licenseCreatedAt;
  this.ebookID = license.ebookID;
  this.customerid = license.customerID;
};

const generateString = (length) => {
  const characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let result = "";
  const charactersLength = characters.length;
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
};

// Get ebook
async function ofEbook(ebookID) {
  return new Promise((resolve, reject) => {
    db.query(
      "SELECT ebookid, ebookname, ebookavatar FROM ebook WHERE ebookid = ?",
      [ebookID],
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
// Get Customer
async function ofCustomer(customerID) {
  return new Promise((resolve, reject) => {
    db.query(
      "SELECT customerid, customername FROM customer WHERE customerid = ?",
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
async function resultData(res) {
  let listInfo = res.map(async (res) => {
    var ebook = {};
    var customer = {};

    await ofEbook(res.ebookid)
      .then(function (resEbook) {
        ebook = resEbook[0];
      })
      .catch(function (errEbook) {
        result(errEbook, null);
      });

    await ofCustomer(res.customerid)
      .then(function (resCustomer) {
        customer = resCustomer[0];
      })
      .catch(function (errCustomer) {
        result(errCustomer, null);
      });

    var licenseInfo = {
      ...res,
      ebook: ebook,
      customer: customer,
    };

    return licenseInfo;
  });

  const licenseData = await Promise.all(listInfo);
  return licenseData;
}

// Get all license
License.getAll = function getAllLicense(result) {
  db.query("SELECT * FROM license", async function (err, res) {
    if (err) {
      result(err, null);
    } else {
      const data = await resultData(res);
      result(null, data);
    }
  });
};

// Get license by ID
License.getLicenseByID = function getLicenseByID(licenseCode, result) {
  const sql = `SELECT * FROM license WHERE licensecode = '${licenseCode}'`;
  db.query(sql, async function (err, res) {
    if (err) {
      result(err, null);
    } else {
      const data = await resultData(res);
      result(null, data);
    }
  });
};


// Search license
License.search = function searchLicense(col, val, result) {
  const sql = `SELECT * FROM license WHERE REPLACE(${col}, 'Đ', 'D') LIKE '%${val}%'`;

  db.query(sql, async function (err, res) {
    if (err) {
      result(err, null);
    } else {
      const data = await resultData(res);
      result(null, data);
    }
  });
};

// Store license
License.store = function storeLicense(newLicense, result) {
  newLicense.licensecode = generateString(5);
  newLicense.licensecreatedat = moment().format("YYYY-MM-DD HH:mm:ss");
  db.query("INSERT INTO license set ?", newLicense, function (err, res) {
    if (err) {
      result(err, null);
    } else {
      result(null, res.insertId);
    }
  });
};

// Delete license
License.delete = function deleteLicense(licenseCode, result) {
  const sql = `DELETE FROM license WHERE licensecode = '${licenseCode}'`;
  db.query(sql, function (err, res) {
    if (err) {
      result(err, null);
    } else {
      result(null, res);
    }
  });
};

module.exports = License;

const db = require("../../config/db");
const moment = require("moment");

// Constructor
const OutputInfo = function (outputinfo) {
  this.outputinfoid = outputinfo.outputinfoID;
  this.outputinfodescription = outputinfo.outputinfoDescription;
  this.outputinfototalmoney = outputinfo.outputinfoTotalMoney;
  this.outputinfocreatedat = outputinfo.outputinfoCreatedAt;
  this.userid = outputinfo.userID;
  this.supplierid = outputinfo.supplierID;
};

// Get list inputinfo of outputinfo
async function hasInputInfo(outputinfoID) {
  return new Promise((resolve, reject) => {
    db.query(
      "SELECT inputinfo.* FROM inputinfo WHERE inputinfo.outputinfoid = ? AND (inputinfo.inputinfodeletedat IS NULL OR inputinfo.inputinfodeletedat = 0)",
      [outputinfoID],
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
// Get list user of outputinfo
async function hasUser(userID) {
  return new Promise((resolve, reject) => {
    db.query(
      "SELECT user.userid, user.username FROM user WHERE user.userid = ? AND (user.userdeletedat IS NULL OR user.userdeletedat = 0)",
      [userID],
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

// Get list supplier of outputinfo
async function hasSupplier(supplierID) {
  return new Promise((resolve, reject) => {
    db.query(
      "SELECT * FROM supplier WHERE supplier.supplierid = ? AND (supplier.supplierdeletedat IS NULL OR supplier.supplierdeletedat = 0)",
      [supplierID],
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

// User result,
async function resultOutputInfo(res) {
  let listInfo = res.map(async (res) => {
    var user = [];
    var supplier = [];
    var inputinfo = [];

    await hasUser(res.userid)
      .then(function (resUser) {
        user = resUser;
      })
      .catch(function (errUser) {
        result(errUser, null);
      });

    await hasInputInfo(res.outputinfoid)
      .then(function (resInputInfo) {
        inputinfo = resInputInfo;
      })
      .catch(function (errInputInfo) {
        result(errInputInfo, null);
      });

    var outputInfo = {
      ...res,
      userList: user,
      supplierList: supplier,
      inputinfoList: inputinfo,
    };
    return outputInfo;
  });

  const resultData = await Promise.all(listInfo);
  return resultData;
}

// Get all outputinfo
OutputInfo.getAll = function getAllOutputInfo(result) {
  db.query(
    "SELECT outputinfo.outputinfoid, outputinfo.outputinfototalmoney, outputinfo.outputinfocreatedat, outputinfo.supplierid, supplier.suppliername FROM outputinfo INNER JOIN supplier ON outputinfo.supplierid = supplier.supplierid WHERE (outputinfo.outputinfodeletedat IS NULL OR outputinfo.outputinfodeletedat = 0)",
    function (err, res) {
      if (err) {
        result(err, null);
      } else {
        result(null, res);
      }
    }
  );
};

// Get outputinfo by ID
OutputInfo.getOutputInfoByID = function getOutputInfoByID(
  outputinfoID,
  result
) {
  db.query(
    "SELECT * FROM outputinfo WHERE outputinfoid = ? AND (outputinfodeletedat IS NULL OR outputinfodeletedat = 0)",
    outputinfoID,
    async function (err, res) {
      if (err) {
        result(err, null);
      } else {
        const data = await resultOutputInfo(res);
        result(null, data);
      }
    }
  );
};

// Search outputinfo
OutputInfo.search = function searchOutputInfo(col, val, result) {
  const sql = `SELECT outputinfo.outputinfoid, outputinfo.outputinfototalmoney, outputinfo.outputinfocreatedat, supplier.suppliername FROM outputinfo INNER JOIN supplier ON outputinfo.supplierid = supplier.supplierid WHERE REPLACE(${col}, 'Đ', 'D') LIKE '%${val}%' AND (outputinfo.outputinfodeletedat IS NULL OR outputinfo.outputinfodeletedat = 0)`;
  db.query(sql, async function (err, res) {
    if (err) {
      console.log(err);
      result(err, null);
    } else {
      result(null, res);
    }
  });
};

// Store outputinfo
OutputInfo.store = function storeOutputInfo(newOutputInfo, result) {
  newOutputInfo.outputinfototalmoney = 0;
  newOutputInfo.outputinfocreatedat = moment().format("YYYY-MM-DD HH:mm:ss");
  db.query("INSERT INTO outputinfo set ?", newOutputInfo, function (err, res) {
    if (err) {
      result(err, null);
    } else {
      result(null, res.insertId);
    }
  });
};

// Update outputinfo
OutputInfo.update = function updateOutputInfo(
  outputinfoID,
  outputinfo,
  result
) {
  db.query(
    "UPDATE outputinfo SET outputinfodescription = ?, userid = ?, supplierid = ? WHERE outputinfoid = ?",
    [
      outputinfo.outputinfodescription,
      outputinfo.userid,
      outputinfo.supplierid,
      outputinfoID,
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

// Delete outputinfo
OutputInfo.delete = function deleteOutputInfo(outputinfoID, result) {
  let now = moment().format("YYYY-MM-DD HH:mm:ss");
  db.query(
    "UPDATE outputinfo SET outputinfodeletedat = ? WHERE outputinfoid = ?",
    [now, outputinfoID],
    function (err, res) {
      if (err) {
        result(err, null);
      } else {
        result(null, res);
      }
    }
  );
};

// Restore outputinfo
OutputInfo.restore = function restoreOutputInfo(outputinfoID, result) {
  db.query(
    "UPDATE outputinfo SET outputinfodeletedat = NULL WHERE outputinfoid = ?",
    [outputinfoID],
    function (err, res) {
      if (err) {
        result(err, null);
      } else {
        result(null, res);
      }
    }
  );
};

module.exports = OutputInfo;

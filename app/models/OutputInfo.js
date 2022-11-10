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
      "SELECT inputinfo.* FROM inputinfo WHERE inputinfo.outputinfoid = ? AND inputinfo.inputinfodeletedat IS NULL",
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
async function hasUser(outputinfoID) {
  return new Promise((resolve, reject) => {
    db.query(
      "SELECT user.userid, user.username FROM outputinfo INNER JOIN user ON outputinfo.userid = user.userid WHERE outputinfo.outputinfoid = ? AND user.userdeletedat IS NULL",
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

// Get list supplier of outputinfo
async function hasSupplier(outputinfoID) {
  return new Promise((resolve, reject) => {
    db.query(
      "SELECT supplier.* FROM outputinfo INNER JOIN supplier ON outputinfo.supplierid = supplier.supplierid WHERE outputinfo.outputinfoid = ? AND supplier.supplierdeletedat IS NULL",
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

// User result,
async function resultOutputInfo(res) {
  let listInfo = res.map(async (res) => {
    var user = [];
    var supplier = [];
    var inputinfo = [];

    await hasUser(res.outputinfoid)
      .then(function (resUser) {
        user = resUser;
      })
      .catch(function (errUser) {
        result(errUser, null);
      });

    await hasSupplier(res.outputinfoid)
      .then(function (resSupplier) {
        supplier = resSupplier;
      })
      .catch(function (errSupplier) {
        result(errSupplier, null);
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
    "SELECT * FROM outputinfo WHERE outputinfodeletedat IS NULL",
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
    "SELECT * FROM outputinfo WHERE outputinfoid = ?",
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
  const sql = `SELECT * FROM outputinfo WHERE REPLACE(${col}, 'Đ', 'D') LIKE '%${val}%' AND outputinfodeletedat IS NULL`;
  db.query(sql, async function (err, res) {
    if (err) {
      result(err, null);
    } else {
      result(null, res);
    }
  });
};

// Store outputinfo
OutputInfo.store = function storeOutputInfo(newOutputInfo, result) {
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
    "UPDATE outputinfo SET outputinfototalmoney = ?, outputinfodescription = ?, userid = ?, supplierid = ? WHERE outputinfoid = ?",
    [
      outputinfo.outputinfototalmoney,
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

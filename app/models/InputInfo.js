const db = require("../../config/db");
const moment = require("moment");

// Constructor
const InputInfo = function (inputinfo) {
  this.inputinfoid = inputinfo.inputinfoID;
  this.inputinfototalmoney = inputinfo.inputinfoTotalMoney;
  this.inputinfocreatedat = inputinfo.inputinfoCreateAt;
  this.userid = inputinfo.userID;
  this.supplierid = inputinfo.supplierID;
  this.outputinfoid = inputinfo.outputinfoID;
};

// Get list ebook of outputinfo
async function hasEbook(roleID) {
  return new Promise((resolve, reject) => {
    db.query(
      "SELECT ebook.ebookid, ebook.ebookname, ebook.ebookprice, inputinfo_ebook.inputprice as input_price FROM inputinfo_ebook RIGHT JOIN ebook ON inputinfo_ebook.ebookid = ebook.ebookid  WHERE inputinfo_ebook.inputinfoid = ?;",
      [roleID],
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
// Get list user of inputinfo
async function hasUser(inputinfoID) {
  return new Promise((resolve, reject) => {
    db.query(
      "SELECT user.userid, user.username FROM inputinfo INNER JOIN user ON inputinfo.userid = user.userid WHERE inputinfo.inputinfoid = ?",
      [inputinfoID],
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

// Get list supplier of inputinfo
async function hasSupplier(inputinfoID) {
  return new Promise((resolve, reject) => {
    db.query(
      "SELECT supplier.* FROM inputinfo INNER JOIN supplier ON inputinfo.supplierid = supplier.supplierid WHERE inputinfo.inputinfoid = ?",
      [inputinfoID],
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

// Get list outputinfo of inputinfo
async function hasOutputInfo(outputinfoID) {
  return new Promise((resolve, reject) => {
    db.query(
      "SELECT outputinfo.* FROM outputinfo WHERE outputinfo.outputinfoid = ?",
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

// Get list outputinfo of inputinfo
async function getTotalMomeyOutputInfo(outputinfoID) {
  return new Promise((resolve, reject) => {
    db.query(
      "SELECT outputinfototalmoney FROM outputinfo WHERE outputinfoid = ?",
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
// Get list outputinfo of inputinfo
async function getTotalMomeyInputInfo(outputinfoID) {
  return new Promise((resolve, reject) => {
    db.query(
      "SELECT SUM(inputinfototalmoney) as inputinfototalmoney  FROM inputinfo WHERE outputinfoid = ?",
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
async function resultTotalMoney(outputinfoID) {
  var inputTotalMoney = 0;

  await getTotalMomeyInputInfo(outputinfoID)
    .then(function (resInput) {
      inputTotalMoney = resInput[0].inputinfototalmoney;
    })
    .catch(function (errInput) {
      result(errInput, null);
    });

  return inputTotalMoney;
}
// User result,
async function resultOutputInfo(res) {
  let listInfo = res.map(async (res) => {
    var ebooks = [];
    var user = [];
    var supplier = [];
    var outputinfo = [];

    await hasEbook(res.inputinfoid)
      .then(function (resEbooks) {
        ebooks = resEbooks;
      })
      .catch(function (errUser) {
        result(errUser, null);
      });

    await hasUser(res.inputinfoid)
      .then(function (resUser) {
        user = resUser;
      })
      .catch(function (errUser) {
        result(errUser, null);
      });

    await hasOutputInfo(res.outputinfoid)
      .then(function (resOuputInfo) {
        outputinfo = resOuputInfo;
      })
      .catch(function (errOuputInfo) {
        result(errOuputInfo, null);
      });

    var inputInfo = {
      ...res,
      ebookList: ebooks,
      userList: user,
      supplierList: supplier,
      outputinfoList: outputinfo,
    };
    return inputInfo;
  });

  const resultData = await Promise.all(listInfo);
  return resultData;
}

// Get all inputinfo
InputInfo.getAll = function getAllInputInfo(result) {
  db.query(
    "SELECT * FROM inputinfo WHERE inputinfodeletedat IS NULL",
    function (err, res) {
      if (err) {
        result(err, null);
      } else {
        result(null, res);
      }
    }
  );
};

// Get inputinfo by ID
InputInfo.getInputInfoByID = function getInputInfoByID(inputinfoID, result) {
  db.query(
    "SELECT * FROM inputinfo WHERE inputinfoid = ?",
    inputinfoID,
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

// Search inputinfo
InputInfo.search = function searchInputInfo(col, val, result) {
  const sql = `SELECT * FROM inputinfo WHERE REPLACE(${col}, 'Đ', 'D') LIKE '%${val}%' AND inputinfodeletedat IS NULL`;
  db.query(sql, async function (err, res) {
    if (err) {
      result(err, null);
    } else {
      result(null, res);
    }
  });
};

// Store inputinfo
InputInfo.store = function storeInputInfo(newInputInfo, result) {
  newInputInfo.inputinfocreatedat = moment().format("YYYY-MM-DD HH:mm:ss");
  db.query(
    "INSERT INTO inputinfo set ?",
    newInputInfo,
    async function (err, res) {
      if (err) {
        result(err, null);
      } else {
        var totalMoneyOutput = await resultTotalMoney(newInputInfo.outputinfoid);
        db.query(
          "UPDATE outputinfo SET outputinfototalmoney = ? WHERE outputinfoid = ?",
          [totalMoneyOutput, newInputInfo.outputinfoid],
          function (errUpdate, resUpdate) {
            if (errUpdate) {
              result(errUpdate, null);
            } else {
              result(null, res.insertId);
            }
          }
        );
      }
    }
  );
};

// Store inputinfo_detail
InputInfo.storeDetail = function storeInputInfoDetail(
  inputinfoID,
  inputDetail,
  result
) {
  var values = [];
  inputDetail.forEach((detail) => {
    values.push([inputinfoID, detail.ebookID, detail.inputPrice]);
  });
  const sql =
    "INSERT INTO inputinfo_ebook (inputinfoid, ebookid, inputprice) VALUES ?";
  db.query(sql, [values], function (err, res) {
    if (err) {
      result(err, null);
    } else {
      result(null, res.insertId);
    }
  });
};

// Update inputinfo
InputInfo.update = function updateInputInfo(inputinfoID, inputinfo, result) {
  db.query(
    "UPDATE inputinfo SET inputinfototalmoney = ?, inputinfostatus = ?, outputinfoid = ?, userid = ?, supplierid = ? WHERE inputinfoid = ?",
    [
      inputinfo.inputinfototalmoney,
      inputinfo.inputinfostatus,
      inputinfo.outputinfoid,
      inputinfo.userid,
      inputinfo.supplierid,
      inputinfoID,
    ],
    async function (err, res) {
      if (err) {
        result(err, null);
      } else {
        var totalMoneyOutput = await resultTotalMoney(inputinfo.outputinfoid);
        db.query(
          "UPDATE outputinfo SET outputinfototalmoney = ? WHERE outputinfoid = ?",
          [totalMoneyOutput, inputinfo.outputinfoid],
          function (errUpdate, resUpdate) {
            if (errUpdate) {
              result(errUpdate, null);
            } else {
              result(null, res.insertId);
            }
          }
        );
      }
    }
  );
};

// Add detail inputinfo
InputInfo.addItemDetail = function addItemDetail(
  inputinfoID,
  ebookID,
  inputPrice,
  result
) {
  db.query(
    "INSERT INTO inputinfo_ebook SET inputinfoid = ?, ebookid = ?, inputprice = ?",
    [inputinfoID, ebookID, inputPrice],
    function (err, res) {
      if (err) {
        result(err, null);
      } else {
        result(null, res);
      }
    }
  );
};

// Update detail inputinfo
InputInfo.updateItemDetail = function updateItemDetail(
  inputinfoID,
  ebookID,
  inputPrice,
  result
) {
  db.query(
    "UPDATE inputinfo_ebook SET ebookid = ?, inputprice = ? WHERE inputinfoid = ?",
    [ebookID, inputPrice, inputinfoID],
    function (err, res) {
      if (err) {
        result(err, null);
      } else {
        result(null, res);
      }
    }
  );
};

// Delete inputinfo
InputInfo.deleteItemDetail = function deleteItemDetail(
  inputinfoID,
  ebookID,
  result
) {
  db.query(
    "DELETE FROM inputinfo_ebook WHERE inputinfoid = ? AND ebookid = ?",
    [inputinfoID, ebookID],
    function (err, res) {
      if (err) {
        result(err, null);
      } else {
        result(null, res);
      }
    }
  );
};

// Update inputinfo total money
InputInfo.updateTotalMoney = function updateTotalMoney(
  inputinfoID,
  totalMoneyInput,
  outputinfoID,
  result
) {
  db.query(
    "UPDATE inputinfo SET inputinfototalmoney = ? WHERE inputinfoid = ?",
    [totalMoneyInput, inputinfoID],
    async function (err, res) {
      if (err) {
        result(err, null);
      } else {
        var totalMoneyOutput = await resultTotalMoney(outputinfoID);
        console.log(outputinfoID);
        console.log(totalMoneyOutput);
        db.query(
          "UPDATE outputinfo SET outputinfototalmoney = ? WHERE outputinfoid = ?",
          [totalMoneyOutput, outputinfoID],
          function (errUpdate, resUpdate) {
            if (errUpdate) {
              result(errUpdate, null);
            } else {
              result(null, res.insertId);
            }
          }
        );
      }
    }
  );
};

// Delete inputinfo
InputInfo.delete = function deleteInputInfo(inputinfoID, result) {
  let now = moment().format("YYYY-MM-DD HH:mm:ss");
  db.query(
    "UPDATE inputinfo SET inputinfodeletedat = ? WHERE inputinfoid = ?",
    [now, inputinfoID],
    function (err, res) {
      if (err) {
        result(err, null);
      } else {
        result(null, res);
      }
    }
  );
};

// Restore inputinfo
InputInfo.restore = function restoreInputInfo(inputinfoID, result) {
  db.query(
    "UPDATE inputinfo SET inputinfodeletedat = NULL WHERE inputinfoid = ?",
    [inputinfoID],
    function (err, res) {
      if (err) {
        result(err, null);
      } else {
        result(null, res);
      }
    }
  );
};

module.exports = InputInfo;

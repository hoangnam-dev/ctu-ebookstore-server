const db = require("../../config/db");
const moment = require("moment");

// Constructor
const InputInfo = function (inputinfo) {
  this.inputinfoid = inputinfo.inputinfoID;
  this.inputinfototalmoney = inputinfo.inputinfoTotalMoney;
  this.inputinfocreateat = inputinfo.inputinfoCreateAt;
  this.inputinfostatus = inputinfo.inputinfoStatus;
  this.userid = inputinfo.userID;
  this.supplierid = inputinfo.supplierID;
  this.outputinfoid = inputinfo.outputInfoID;
};

// Get all inputinfo
InputInfo.getAll = function getAllInputInfo(result) {
  db.query("SELECT * FROM inputinfo WHERE inputinfodeletedat IS NULL", function (err, res) {
    if (err) {
      result(err, null);
    } else {
      result(null, res);
    }
  });
};

// Get inputinfo by ID
InputInfo.getInputInfoByID = function getInputInfoByID(inputinfoID, result) {
  db.query(
    "SELECT * FROM inputinfo WHERE inputinfoid = ?",
    inputinfoID,
    function (err, res) {
      if (err) {
        result(err, null);
      } else {
        result(null, res);
      }
    }
  );
};

// Search inputinfo
InputInfo.search = function searchInputInfo(col, val, result) {
    const sql =
      "SELECT * FROM inputinfo WHERE " +
      col +
      " LIKE '%" +
      val +
      "%' and inputinfodeletedat IS NULL";
    db.query(sql, async function (err, res) {
      if (err) {
        result(err, null);
      } else {
        const inputinfoData = await resultInputInfo(res);
        result(null, inputinfoData);
      }
    });
  };

// Store inputinfo
InputInfo.store = function storeInputInfo(newInputInfo, result) {
  db.query("INSERT INTO inputinfo set ?", newInputInfo, function (err, res) {
    if (err) {
      result(err, null);
    } else {
      result(null, res.insertId);
    }
  });
};

// Update inputinfo
InputInfo.update = function updateInputInfo(inputinfoID, inputinfo, result) {
  console.log(inputinfoID);
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
    function (err, res) {
      if (err) {
        result(null, err);
      } else {
        result(null, res);
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
          result(null, err);
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
          result(null, err);
        } else {
          result(null, res);
        }
      }
    );
  };
  
  

module.exports = InputInfo;

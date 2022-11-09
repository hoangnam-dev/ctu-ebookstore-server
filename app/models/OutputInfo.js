const db = require('../../config/db');

// Constructor
const OutputInfo = function(outputinfo) {
    this.outputinfoid = outputinfo.outputinfoID;
    this.outputinfodescription = outputinfo.outputinfoDescription;
    this.outputinfototalmoney = outputinfo.outputinfoTotalMoney;
    this.outputinfocreateat = outputinfo.outputinfoCreateAt;
    this.userid = outputinfo.userID;
    this.supplierid = outputinfo.supplierID;
};

// Get all outputinfo
OutputInfo.getAll = function getAllOutputInfo(result) {
    db.query("SELECT * FROM outputinfo WHERE outputinfodeletedat IS NULL", function(err, res) {
        if(err) {
            result(err, null);
        } else {
            result(null, res);
        }
    });
};

// Get outputinfo by ID
OutputInfo.getOutputInfoByID = function getOutputInfoByID(outputinfoID, result) {
    db.query("SELECT * FROM outputinfo WHERE outputinfoid = ?", outputinfoID, function(err, res) {
        if(err) {
            result(err, null);
        } else {
            result(null, res);
        }
    });
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
    db.query("INSERT INTO outputinfo set ?", newOutputInfo, function (err, res) {

        if(err) {
            result(err, null);
        }
        else{
            result(null, res.insertId);
        }
    });
};

// Update outputinfo
OutputInfo.update = function updateOutputInfo(outputinfoID, outputinfo, result) {
    console.log(outputinfoID);
    db.query("UPDATE outputinfo SET outputinfototalmoney = ?, outputinfodescription = ?, userid = ?, supplierid = ? WHERE outputinfoid = ?",
    [outputinfo.outputinfototalmoney, outputinfo.outputinfodescription, outputinfo.userid, outputinfo.supplierid, outputinfoID],
    function(err, res) {
        if(err) {
            result(err, null);
        }
        else{
            result(null, res);
        }
    });
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

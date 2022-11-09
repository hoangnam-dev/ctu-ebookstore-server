const db = require("../../config/db");
const moment = require("moment");

// Constructor
const UserStatus = function (userstatus) {
  this.userstatusid = userstatus.userstatusID;
  this.userstatuscode = userstatus.userstatusCode;
  this.userstatusname = userstatus.userstatusName;
  this.userstatuscolor = userstatus.userstatusColor;
};

// Get all userstatus
UserStatus.getAll = function getAllUserStatus(result) {
  db.query(
    "SELECT * FROM userstatus WHERE userstatusdeletedat IS NULL",
    function (err, res) {
      if (err) {
        result(err, null);
      } else {
        result(null, res);
      }
    }
  );
};

// Search userstatus
UserStatus.search = function searchUserStatus(col, val, result) {
  const sql =
    "SELECT * FROM userstatus WHERE " +
    col +
    " LIKE '%" +
    val +
    "%' and userstatusdeletedat IS NULL";
  db.query(sql, function (err, res) {
    if (err) {
      result(err, null);
    } else {
      result(null, res);
    }
  });
};

// Get userstatus by ID
UserStatus.getUserStatusByID = function getUserStatusByID(userstatusID, result) {
  let sql =
    "SELECT * FROM userstatus WHERE userstatusid = ?";
  db.query(sql, userstatusID, function (err, res) {
    if (err) {
      result(err, null);
    } else {
      result(null, res);
    }
  });
};

// Store userstatus
UserStatus.store = function storeUserStatus(newUserStatus, result) {
  db.query("INSERT INTO userstatus set ?", newUserStatus, function (err, res) {
    if (err) {
      result(err, null);
    } else {
      result(null, res.insertId);
    }
  });
};

// Update userstatus
UserStatus.update = function updateUserStatus(userstatus, result) {
  db.query(
    "UPDATE userstatus SET userstatuscode = ?, userstatusname = ?, userstatuscolor = ? WHERE userstatusid = ?",
    [
      userstatus.userstatuscode,
      userstatus.userstatusname,
      userstatus.userstatuscolor,
      userstatus.userstatusid,
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

// Delete userstatus
UserStatus.delete = function deleteUserStatus(userstatusID, result) {
  let now = moment().format("YYYY-MM-DD HH:mm:ss");
  db.query(
    "UPDATE userstatus SET userstatusdeletedat = ? WHERE userstatusid = ?",
    [now, userstatusID],
    function (err, res) {
      if (err) {
        result(err, null);
      } else {
        result(null, res);
      }
    }
  );
};

// Restore userstatus
UserStatus.restore = function restoreUserStatus(userstatusID, result) {
  db.query(
    "UPDATE userstatus SET userstatusdeletedat = NULL WHERE userstatusid = ?",
    [userstatusID],
    function (err, res) {
      if (err) {
        result(err, null);
      } else {
        result(null, res);
      }
    }
  );
};

module.exports = UserStatus;

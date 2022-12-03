const db = require("../../config/db");
const moment = require("moment");

// Constructor
const EbookStatus = function (ebookstatus) {
  this.ebookstatusid = ebookstatus.ebookstatusID;
  this.ebookstatuscode = ebookstatus.ebookstatusCode;
  this.ebookstatusname = ebookstatus.ebookstatusName;
  this.ebookstatuscolor = ebookstatus.ebookstatusColor;
};

// Get all ebookstatus
EbookStatus.getAll = function getAllEbookStatus(result) {
  db.query(
    "SELECT * FROM ebookstatus WHERE (ebookstatusdeletedat IS NULL OR ebookstatusdeletedat = 0)",
    function (err, res) {
      if (err) {
        result(err, null);
      } else {
        result(null, res);
      }
    }
  );
};

// Search ebookstatus
EbookStatus.search = function searchEbookStatus(col, val, result) {
  const sql = `SELECT * FROM ebookstatus WHERE REPLACE(${col}, 'Đ', 'D') LIKE '%${val}%' AND (ebookstatusdeletedat IS NULL OR ebookstatusdeletedat = 0)`;
  db.query(sql, function (err, res) {
    if (err) {
      result(err, null);
    } else {
      result(null, res);
    }
  });
};

// Get ebookstatus by ID
EbookStatus.getEbookStatusByID = function getEbookStatusByID(ebookstatusID, result) {
  let sql =
    "SELECT * FROM ebookstatus WHERE ebookstatusid = ? AND (ebookstatusdeletedat IS NULL OR ebookstatusdeletedat = 0)";
  db.query(sql, ebookstatusID, function (err, res) {
    if (err) {
      result(err, null);
    } else {
      result(null, res);
    }
  });
};

// Store ebookstatus
EbookStatus.store = function storeEbookStatus(newEbookStatus, result) {
  db.query("INSERT INTO ebookstatus set ?", newEbookStatus, function (err, res) {
    if (err) {
      result(err, null);
    } else {
      result(null, res.insertId);
    }
  });
};

// Update ebookstatus
EbookStatus.update = function updateEbookStatus(ebookstatus, result) {
  db.query(
    "UPDATE ebookstatus SET ebookstatuscode = ?, ebookstatusname = ?, ebookstatuscolor = ? WHERE ebookstatusid = ?",
    [
      ebookstatus.ebookstatuscode,
      ebookstatus.ebookstatusname,
      ebookstatus.ebookstatuscolor,
      ebookstatus.ebookstatusid,
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

// Delete ebookstatus
EbookStatus.delete = function deleteEbookStatus(ebookstatusID, result) {
  let now = moment().format("YYYY-MM-DD HH:mm:ss");
  db.query(
    "UPDATE ebookstatus SET ebookstatusdeletedat = ? WHERE ebookstatusid = ?",
    [now, ebookstatusID],
    function (err, res) {
      if (err) {
        result(err, null);
      } else {
        result(null, res);
      }
    }
  );
};

// Restore ebookstatus
EbookStatus.restore = function restoreEbookStatus(ebookstatusID, result) {
  db.query(
    "UPDATE ebookstatus SET ebookstatusdeletedat = NULL WHERE ebookstatusid = ?",
    [ebookstatusID],
    function (err, res) {
      if (err) {
        result(err, null);
      } else {
        result(null, res);
      }
    }
  );
};

module.exports = EbookStatus;

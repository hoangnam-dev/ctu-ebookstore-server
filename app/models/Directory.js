const db = require('../../config/db');
const moment = require('moment');

// Constructor
const Directory = function(directory) {
    this.directoryid = directory.directoryID;
    this.directoryname = directory.directoryName;
    this.directorydescription = directory.directoryDescription;
};

// Get all directory
Directory.getAll = function getAllDirectory(result) {
    db.query("SELECT * FROM directory WHERE directorydeletedat IS NULL", function(err, res) {
        if(err) {
            result(err, null);
        } else {
            result(null, res);
        }
    });
};

// Get directory by ID
Directory.search = function search(directoryName, result) {
    const sql = `SELECT * FROM directory WHERE REPLACE(${col}, 'Đ', 'D') LIKE '%${val}%' AND directorydeletedat IS NULL`;
  db.query(sql, function (err, res) {
    if (err) {
      result(err, null);
    } else {
      result(null, res);
    }
  });
};

// Get directory by ID
Directory.getDirectoryByID = function getDirectoryByID(directoryID, result) {
    db.query("SELECT * FROM directory WHERE directoryid = ?", directoryID, function(err, res) {
        if(err) {
            result(err, null);
        } else {
            result(null, res);
        }
    });
};

// Store directory
Directory.store = function storeDirectory(newDirectory, result) {
    db.query("INSERT INTO directory set ?", newDirectory, function (err, res) {

        if(err) {
            result(err, null);
        }
        else{
            result(null, res.insertId);
        }
    });
};

// Update directory
Directory.update = function updateDirectory(directoryID, directory, result) {
    db.query("UPDATE directory SET directoryname = ?, directorydescription = ? WHERE directoryid = ?",
    [directory.directoryname, directory.directorydescription, directoryID],
    function(err, res) {
        if(err) {
            result(err, null);
        }
        else{
            result(null, res);
        }
    });
};

// Delete directory
Directory.delete = function deleteDirectory(directoryID, result) {
    let now = moment().format('YYYY-MM-DD');
    db.query("UPDATE directory SET directorydeletedat = ? WHERE directoryid = ?",
    [now, directoryID],
    function(err, res) {
        if(err) {
            result(err, null);
        }
        else{
            result(null, res);
        }
    });
};

// Restore directory
Directory.restore = function restoreDirectory(directoryID, result) {
    db.query("UPDATE directory SET directorydeletedat = NULL WHERE directoryid = ?",
    [directoryID],
    function(err, res) {
        if(err) {
            result(err, null);
        }
        else{
            result(null, res);
        }
    });
};

module.exports = Directory;

const db = require('../../config/db');

// Constructor
const Directory = function(directory) {
    this.directoryid = directory.directoryID;
    this.directoryname = directory.directoryName;
    this.directorydescription = directory.directoryDescription;
};

// Get all directory
Directory.getAll = function getAllDirectory(result) {
    db.query("SELECT * FROM directory", function(err, res) {
        if(err) {
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
    console.log(directoryID);
    db.query("UPDATE directory SET directoryname = ?, directorydescription = ? WHERE directoryid = ?",
    [directory.directoryname, directory.directorydescription, directoryID],
    function(err, res) {
        if(err) {
            result(null, err);
        }
        else{
            result(null, res);
        }
    });
};

// Delete directory
Directory.delete = function deleteDirectory(directoryID, result) {
    db.query("DELETE FROM directory WHERE directoryid = ?", directoryID, function(err, res) {
        if(err) {
            result(null, err);
        }
        else{
            result(null, res);
        }
    })
};

module.exports = Directory;

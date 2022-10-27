const db = require('../../config/db');

// Constructor
const Ward = function(ward) {
    this.wardid = ward.wardID;
    this.wardname = ward.wardName;
    this.wardtype = ward.wardType;
    this.districtid = ward.districtID;
};

// Get all ward
Ward.getAll = function getAllProvince(result) {
    db.query("SELECT * FROM ward", function(err, res) {
        if(err) {
            result(err, null);
        } else {
            result(null, res);
        }
    });
};

// Get ward by ID
Ward.getProvinceByID = function getProvinceByID(wardID, result) {
    db.query("SELECT * FROM ward WHERE wardid = ?", wardID, function(err, res) {
        if(err) {
            result(err, null);
        } else {
            result(null, res);
        }
    });
};

// Store ward
Ward.store = function storeProvince(newProvince, result) {
    db.query("INSERT INTO ward set ?", newProvince, function (err, res) {

        if(err) {
            result(err, null);
        }
        else{
            result(null, res.insertId);
        }
    });
};

// Update ward
Ward.update = function updateProvince(wardID, ward, result) {
    console.log(wardID);
    db.query("UPDATE ward SET wardname = ?, wardtype = ?, districtid = ? WHERE wardid = ?",
    [ward.wardname, ward.wardtype, ward.districtID, wardID],
    function(err, res) {
        if(err) {
            result(null, err);
        }
        else{
            result(null, res);
        }
    });
};

// Delete ward
Ward.delete = function deleteProvince(wardID, result) {
    db.query("DELETE FROM ward WHERE wardid = ?", wardID, function(err, res) {
        if(err) {
            result(null, err);
        }
        else{
            result(null, res);
        }
    })
};

module.exports = Ward;

const db = require('../../config/db');

// Constructor
const Province = function(province) {
    this.provinceid = province.provinceID;
    this.provincename = province.provinceName;
    this.provincetype = province.provinceType;
};

// Get all province
Province.getAll = function getAllProvince(result) {
    db.query("SELECT * FROM province", function(err, res) {
        if(err) {
            result(err, null);
        } else {
            result(null, res);
        }
    });
};

// Get province by ID
Province.getProvinceByID = function getProvinceByID(provinceID, result) {
    db.query("SELECT * FROM province WHERE provinceid = ?", provinceID, function(err, res) {
        if(err) {
            result(err, null);
        } else {
            result(null, res);
        }
    });
};

// Store province
Province.store = function storeProvince(newProvince, result) {
    db.query("INSERT INTO province set ?", newProvince, function (err, res) {

        if(err) {
            result(err, null);
        }
        else{
            result(null, res.insertId);
        }
    });
};

// Update province
Province.update = function updateProvince(provinceID, province, result) {
    console.log(provinceID);
    db.query("UPDATE province SET provincename = ?, provincetype = ? WHERE provinceid = ?",
    [province.provincename, province.provincetype, provinceID],
    function(err, res) {
        if(err) {
            result(err, null);
        }
        else{
            result(null, res);
        }
    });
};

// Delete province
Province.delete = function deleteProvince(provinceID, result) {
    db.query("DELETE FROM province WHERE provinceid = ?", provinceID, function(err, res) {
        if(err) {
            result(err, null);
        }
        else{
            result(null, res);
        }
    })
};

module.exports = Province;

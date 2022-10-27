const db = require('../../config/db');

// Constructor
const District = function(district) {
    this.districtid = district.districtID;
    this.districtname = district.districtName;
    this.districttype = district.districtType;
    this.provinceid = district.provinceID;
};

// Get all district
District.getAll = function getAllProvince(result) {
    db.query("SELECT * FROM district", function(err, res) {
        if(err) {
            result(err, null);
        } else {
            result(null, res);
        }
    });
};

// Get district by ID
District.getProvinceByID = function getProvinceByID(districtID, result) {
    db.query("SELECT * FROM district WHERE districtid = ?", districtID, function(err, res) {
        if(err) {
            result(err, null);
        } else {
            result(null, res);
        }
    });
};

// Store district
District.store = function storeProvince(newProvince, result) {
    db.query("INSERT INTO district set ?", newProvince, function (err, res) {

        if(err) {
            result(err, null);
        }
        else{
            result(null, res.insertId);
        }
    });
};

// Update district
District.update = function updateProvince(districtID, district, result) {
    console.log(districtID);
    db.query("UPDATE district SET districtname = ?, districttype = ?, provinceid = ? WHERE districtid = ?",
    [district.districtname, district.districttype, district.provinceID, districtID],
    function(err, res) {
        if(err) {
            result(null, err);
        }
        else{
            result(null, res);
        }
    });
};

// Delete district
District.delete = function deleteProvince(districtID, result) {
    db.query("DELETE FROM district WHERE districtid = ?", districtID, function(err, res) {
        if(err) {
            result(null, err);
        }
        else{
            result(null, res);
        }
    })
};

module.exports = District;

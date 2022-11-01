const db = require('../../config/db');

// Constructor
const District = function(district) {
    this.districtid = district.districtID;
    this.districtname = district.districtName;
    this.districttype = district.districtType;
    this.provinceid = district.provinceID;
};

// Get all district
District.getAll = function getAllDistrict(result) {
    db.query("SELECT * FROM district", function(err, res) {
        if(err) {
            result(err, null);
        } else {
            result(null, res);
        }
    });
};

// Get district by ID
District.getDistrictByID = function getDistrictByID(districtID, result) {
    db.query("SELECT * FROM district WHERE districtid = ?", districtID, function(err, res) {
        if(err) {
            result(err, null);
        } else {
            result(null, res);
        }
    });
};

// Get district by ID
District.getDistrictByProvinceID = function getDistrictByProvinceID(provinceID, result) {
    db.query("SELECT * FROM district WHERE provinceid = ?", provinceID, function(err, res) {
        if(err) {
            result(err, null);
        } else {
            result(null, res);
        }
    });
};

// Store district
District.store = function storeDistrict(newDistrict, result) {
    db.query("INSERT INTO district set ?", newDistrict, function (err, res) {

        if(err) {
            result(err, null);
        }
        else{
            result(null, res.insertId);
        }
    });
};

// Update district
District.update = function updateDistrict(districtID, district, result) {
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
District.delete = function deleteDistrict(districtID, result) {
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

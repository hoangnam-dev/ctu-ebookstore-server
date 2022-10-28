const db = require('../../config/db');

// Constructor
const InputInfo = function(inputinfo) {
    this.inputinfoid = inputinfo.inputinfoID;
    this.inputinfototalmoney = inputinfo.inputinfoTotalMoney;
    this.inputinfocreateat = inputinfo.inputinfoCreateAt;
    this.userid = inputinfo.userID;
    this.supplierid = inputinfo.supplierID;
    this.outputinfoid = inputinfo.outputInfoID;  
};

// Get all inputinfo
InputInfo.getAll = function getAllInputInfo(result) {
    db.query("SELECT * FROM inputinfo", function(err, res) {
        if(err) {
            result(err, null);
        } else {
            result(null, res);
        }
    });
};

// Get inputinfo by ID
InputInfo.getInputInfoByID = function getInputInfoByID(inputinfoID, result) {
    db.query("SELECT * FROM inputinfo WHERE inputinfoid = ?", inputinfoID, function(err, res) {
        if(err) {
            result(err, null);
        } else {
            result(null, res);
        }
    });
};

// Store inputinfo
InputInfo.store = function storeInputInfo(newInputInfo, result) {
    db.query("INSERT INTO inputinfo set ?", newInputInfo, function (err, res) {

        if(err) {
            result(err, null);
        }
        else{
            result(null, res.insertId);
        }
    });
};

// Update inputinfo
InputInfo.update = function updateInputInfo(inputinfoID, inputinfo, result) {
    console.log(inputinfoID);
    db.query("UPDATE inputinfo SET inputinfototalmoney = ?, outputinfoid = ?, userid = ?, supplierid = ? WHERE inputinfoid = ?",
    [inputinfo.inputinfototalmoney, inputinfo.outputinfoid, inputinfo.userid, inputinfo.supplierid, inputinfoID],
    function(err, res) {
        if(err) {
            result(null, err);
        }
        else{
            result(null, res);
        }
    });
};

// Delete inputinfo
InputInfo.delete = function deleteInputInfo(inputinfoID, result) {
    db.query("DELETE FROM inputinfo WHERE inputinfoid = ?", inputinfoID, function(err, res) {
        if(err) {
            result(null, err);
        }
        else{
            result(null, res);
        }
    })
};

module.exports = InputInfo;

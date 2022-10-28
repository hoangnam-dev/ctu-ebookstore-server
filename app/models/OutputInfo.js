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
    db.query("SELECT * FROM outputinfo", function(err, res) {
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
            result(null, err);
        }
        else{
            result(null, res);
        }
    });
};

// Delete outputinfo
OutputInfo.delete = function deleteOutputInfo(outputinfoID, result) {
    db.query("DELETE FROM outputinfo WHERE outputinfoid = ?", outputinfoID, function(err, res) {
        if(err) {
            result(null, err);
        }
        else{
            result(null, res);
        }
    })
};

module.exports = OutputInfo;

const db = require('../../config/db');

// Constructor
const License = function(license) {
    this.licenseid = license.licenseID;
    this.licenseisrent = license.licenseIsRent;
    this.licenseexpires = license.licenseExpires;
    this.ebookID = license.ebookID;
    this.customerid = license.customerID;
};

// Get all license
License.getAll = function getAllLicense(result) {
    db.query("SELECT * FROM license", function(err, res) {
        if(err) {
            result(err, null);
        } else {
            result(null, res);
        }
    });
};

// Get license by ID
License.getLicenseByID = function getLicenseByID(licenseID, result) {
    db.query("SELECT * FROM license WHERE licenseid = ?", licenseID, function(err, res) {
        if(err) {
            result(err, null);
        } else {
            result(null, res);
        }
    });
};

// Store license
License.store = function storeLicense(newLicense, result) {
    db.query("INSERT INTO license set ?", newLicense, function (err, res) {

        if(err) {
            result(err, null);
        }
        else{
            result(null, res.insertId);
        }
    });
};

// Update license
License.update = function updateLicense(licenseID, license, result) {
    console.log(licenseID);
    db.query("UPDATE license SET licenseisrent = ?, licenseexpires = ?, ebookid = ?, customerid = ? WHERE licenseid = ?",
    [license.licenseisrent, license.licenseexpires, license.ebookid, license.customerid, licenseID],
    function(err, res) {
        if(err) {
            result(null, err);
        }
        else{
            result(null, res);
        }
    });
};

// Delete license
License.delete = function deleteLicense(licenseID, result) {
    db.query("DELETE FROM license WHERE licenseid = ?", licenseID, function(err, res) {
        if(err) {
            result(null, err);
        }
        else{
            result(null, res);
        }
    })
};

module.exports = License;

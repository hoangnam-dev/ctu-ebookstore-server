const db = require('../../config/db');

// Constructor
const Permission = function(permission) {
    this.permissionid = permission.permissionID;
    this.permissioncode = permission.permissionCode;
    this.permissionname = permission.permissionName;
    this.permissiondescription = permission.permissionDescription;
};

// Get all permission
Permission.getAll = function getAllPermission(result) {
    db.query("SELECT * FROM permission", function(err, res) {
        if(err) {
            result(err, null);
        } else {
            result(null, res);
        }
    });
};

// Get permission by ID
Permission.getPermissionByID = function getPermissionByID(permissionID, result) {
    db.query("SELECT * FROM permission WHERE permissionid = ?", permissionID, function(err, res) {
        if(err) {
            result(err, null);
        } else {
            result(null, res);
        }
    });
};

// Store permission
Permission.store = function storePermission(newPermission, result) {
    db.query("INSERT INTO permission set ?", newPermission, function (err, res) {

        if(err) {
            result(err, null);
        }
        else{
            result(null, res.insertId);
        }
    });
};

// Update permission
Permission.update = function updatePermission(permissionID, permission, result) {
    console.log(permissionID);
    db.query("UPDATE permission SET permissionname = ?, permissioncode = ?, permissiondescription = ? WHERE permissionid = ?",
    [permission.permissionname, permission.permissioncode, permission.permissiondescription, permissionID],
    function(err, res) {
        if(err) {
            result(null, err);
        }
        else{
            result(null, res);
        }
    });
};

// Delete permission
Permission.delete = function deletePermission(permissionID, result) {
    db.query("DELETE FROM permission WHERE permissionid = ?", permissionID, function(err, res) {
        if(err) {
            result(null, err);
        }
        else{
            result(null, res);
        }
    })
};

module.exports = Permission;

const db = require('../../config/db');

// Constructor
const Role = function(role) {
    this.roleid = role.roleID;
    this.rolecode = role.roleCode;
    this.rolename = role.roleName;
    this.roledescription = role.roleDescription;
};

// Get all role
Role.getAll = function getAllRole(result) {
    db.query("SELECT * FROM role", function(err, res) {
        if(err) {
            result(err, null);
        } else {
            result(null, res);
        }
    });
};

// Get role by ID
Role.getRoleByID = function getRoleByID(roleID, result) {
    db.query("SELECT * FROM role WHERE roleid = ?", roleID, function(err, res) {
        if(err) {
            result(err, null);
        } else {
            result(null, res);
        }
    });
};

// Store role
Role.store = function storeRole(newRole, result) {
    db.query("INSERT INTO role set ?", newRole, function (err, res) {

        if(err) {
            result(err, null);
        }
        else{
            result(null, res.insertId);
        }
    });
};

// Update role
Role.update = function updateRole(roleID, role, result) {
    console.log(roleID);
    db.query("UPDATE role SET rolename = ?, rolecode = ?, roledescription = ? WHERE roleid = ?",
    [role.rolename, role.rolecode, role.roledescription, roleID],
    function(err, res) {
        if(err) {
            result(null, err);
        }
        else{
            result(null, res);
        }
    });
};

// Delete role
Role.delete = function deleteRole(roleID, result) {
    db.query("DELETE FROM role WHERE roleid = ?", roleID, function(err, res) {
        if(err) {
            result(null, err);
        }
        else{
            result(null, res);
        }
    })
};

module.exports = Role;

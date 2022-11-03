const db = require("../../config/db");
const moment = require("moment");

// Constructor
const Role = function (role) {
  this.roleid = role.roleID;
  this.rolecode = role.roleCode;
  this.rolename = role.roleName;
  this.roledescription = role.roleDescription;
};

// Get all role
Role.getAll = function getAllRole(result) {
  db.query(
    "SELECT * FROM role WHERE roledeletedat IS NULL",
    function (err, res) {
      if (err) {
        result(err, null);
      } else {
        result(null, res);
      }
    }
  );
};

Role.hasPermission = function hasPermission(roleID, result) {
  const sql =
    "SELECT role_permission.roleid, permission.* FROM role_permission RIGHT JOIN permission ON role_permission.permissionid = permission.permissionid WHERE role_permission.roleid = ?";
  db.query(sql, [roleID],function (err, res) {
    if (err) {
      result(err, null);
    } else {
      result(null, res);
    }
  });
};

// Get role by ID
Role.getRoleByID = function getRoleByID(roleID, result) {
  db.query("SELECT * FROM role WHERE roleid = ?", roleID, function (err, res) {
    if (err) {
      result(err, null);
    } else {
      result(null, res);
    }
  });
};

// Search role
Role.search = function searchRole(col, val, result) {
  const sql =
    "SELECT * FROM role WHERE " +
    col +
    " LIKE '%" +
    val +
    "%' and roledeletedat IS NULL";
  db.query(sql, function (err, res) {
    if (err) {
      result(err, null);
    } else {
      result(null, res);
    }
  });
};

// Store role
Role.store = function storeRole(newRole, result) {
  db.query("INSERT INTO role set ?", newRole, function (err, res) {
    if (err) {
      result(err, null);
    } else {
      result(null, res.insertId);
    }
  });
};

// Update role
Role.update = function updateRole(role, result) {
  const roleID = role.roleid;
  const sql =
    "UPDATE role SET rolecode = ?, rolename = ?, roledescription = ? WHERE roleid = ?;";
  db.query(
    sql,
    [role.rolecode, role.rolename, role.roledescription, roleID],
    function (err, res) {
      if (err) {
        result(null, err);
      } else {
        result(null, res);
      }
    }
  );
};

// Give permission to role
Role.givePermissionTo = function givePermissionTo(roleID, permissonID, result) {
  db.query(
    "INSERT INTO role_permission SET roleid = ?, permissionid = ?",
    [roleID, permissonID],
    function (err, res) {
      if (err) {
        result(err, null);
      } else {
        result(null, res.insertId);
      }
    }
  );
};

// Revoke permission to role
Role.revokePermissionTo = function revokePermissionTo(
  roleID,
  permissonID,
  result
) {
  db.query(
    "DELETE FROM role_permission WHERE roleid = ? AND permissionid = ?",
    [roleID, permissonID],
    function (err, res) {
      if (err) {
        result(err, null);
      } else {
        result(null, res.insertId);
      }
    }
  );
};

// Delete role
Role.delete = function deleteRole(roleID, result) {
  let now = moment().format("YYYY-MM-DD HH:mm:ss");
  db.query(
    "UPDATE role SET roledeletedat = ? WHERE roleid = ?",
    [now, roleID],
    function (err, res) {
      if (err) {
        result(null, err);
      } else {
        result(null, res);
      }
    }
  );
};

// Restore role
Role.restore = function restoreRole(roleID, result) {
  db.query(
    "UPDATE role SET roledeletedat = NULL WHERE roleid = ?",
    [roleID],
    function (err, res) {
      if (err) {
        result(null, err);
      } else {
        result(null, res);
      }
    }
  );
};

module.exports = Role;

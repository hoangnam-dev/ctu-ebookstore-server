const db = require("../../config/db");

// Constructor
const UserAuth = function (user) {
  this.userusername = user.userUserName;
  this.userpassword = user.userPassword;
};

// Get list role of user
async function hasRole(userID) {
  return new Promise((resolve, reject) => {
    db.query(
      "SELECT role.* FROM user INNER JOIN role ON user.roleid = role.roleid WHERE user.userid = ?",
      [userID],
      async function (err, resSub) {
        if (err) {
          reject(err);
        } else {
          resolve(resSub);
        }
      }
    );
  });
}

// Get list role of user
async function userHasPermission(roleID) {
  return new Promise((resolve, reject) => {
    const sql = `SELECT permission.permissioncode FROM role 
    INNER JOIN role_permission ON role.roleid = role_permission.roleid 
    INNER JOIN permission ON role_permission.permissionid = permission.permissionid 
    WHERE role.roleid = '${roleID}'`;
  
    db.query(sql, async function (err, resSub) {
      if (err) {
        reject(err);
      } else {
        resolve(resSub);
      }
    });
  });
}

// Get address of user
async function hasAddress(userID) {
  return new Promise((resolve, reject) => {
    db.query(
      "SELECT district.provinceid, district.districtid, ward.wardid FROM user INNER JOIN ward ON user.wardid = ward.wardid INNER JOIN district ON ward.districtid = district.districtid WHERE user.userid =?",
      [userID],
      async function (err, resSub) {
        if (err) {
          reject(err);
        } else {
          resolve(resSub);
        }
      }
    );
  });
}

// Get list userstatus of user
async function hasUserStatus(userID) {
  return new Promise((resolve, reject) => {
    db.query(
      "SELECT userstatus.* FROM user INNER JOIN userstatus ON user.userstatusid = userstatus.userstatusid WHERE user.userid = ?",
      [userID],
      async function (err, resSub) {
        if (err) {
          reject(err);
        } else {
          resolve(resSub);
        }
      }
    );
  });
}

// User result,
async function resultUser(res) {
  let listInfo = res.map(async (res) => {
    var role = [];
    var permissions = [];
    var status = [];
    var address;

    await hasRole(res.userid)
      .then(function (resRole) {
        role = resRole;
      })
      .catch(function (errRole) {
        result(errRole, null);
      });

    await userHasPermission(res.roleid)
      .then(function (resPermission) {
        resPermission.forEach(permission => {
          permissions.push(permission.permissioncode)
        });
      })
      .catch(function (errPermission) {
        result(errPermission, null);
      });

    await hasUserStatus(res.userid)
      .then(function (resStatus) {
        status = resStatus;
      })
      .catch(function (errStatus) {
        result(errStatus, null);
      });

    await hasAddress(res.userid)
      .then(function (resAddress) {
        address = [
          resAddress[0].provinceid,
          resAddress[0].districtid,
          resAddress[0].wardid,
        ];
      })
      .catch(function (errAddress) {
        result(errAddress, null);
      });
    var userInfo = {
      ...res,
      roleList: role,
      statusList: status,
      userAddressSub: address,
      permissionList: permissions
    };
    return userInfo;
  });

  const resultData = await Promise.all(listInfo);
  return resultData;
}

// Login
UserAuth.checkUsernameLogin = function checkUsernameLogin(userName, result) {
  const sql = "SELECT * FROM user WHERE userusername = '" + userName + "'";
  db.query(sql, async function (err, res) {
    if (err) {
      result(err, null);
    } else {
      const userData = await resultUser(res);
      result(null, userData);
    }
  });
};

// Profile
UserAuth.profile = function profile(userID, result) {
  const sql = "SELECT * FROM user WHERE userid = '" + userID + "'";
  db.query(sql, async function (err, res) {
    if (err) {
      result(err, null);
    } else {
      const userData = await resultUser(res);
      result(null, userData);
    }
  });
};

// Get role and permission
// Get list permissions of role
async function hasPermission(roleID) {
  return new Promise((resolve, reject) => {
    db.query(
      "SELECT permission.* FROM role_permission RIGHT JOIN permission ON role_permission.permissionid = permission.permissionid WHERE role_permission.roleid = ?",
      [roleID],
      async function (err, resSub) {
        if (err) {
          reject(err);
        } else {
          resolve(resSub);
        }
      }
    );
  });
}

// Customer result,
async function resultRole(res) {
  let listPerm = res.map(async (res) => {
    var permissions = [];

    await hasPermission(res.roleid)
      .then(function (val) {
        permissions = val;
      })
      .catch(function (err) {
        result(err, null);
      });
    var roleInfo = {
      ...res,
      permissionList: permissions,
    };
    return roleInfo;
  });

  const roleData = await Promise.all(listPerm);
  return roleData;
}

// Get all role
UserAuth.getRoleAndPermission = function getRoleAndPermission(
  roleCode,
  result
) {
  const sql = `SELECT * FROM role WHERE rolecode = '${roleCode}' AND roledeletedat IS NULL`;
  db.query(sql, async function (err, res) {
    if (err) {
      result(err, null);
    } else {
      const roleData = await resultRole(res);
      result(null, roleData);
    }
  });
};

module.exports = UserAuth;

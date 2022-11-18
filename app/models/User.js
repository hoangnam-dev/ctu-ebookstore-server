const db = require("../../config/db");
const moment = require("moment");

// Constructor
const User = function (user) {
  this.userid = user.userID;
  this.username = user.userName;
  this.userusername = user.userUserName;
  this.userpassword = user.userPassword;
  this.usercic = user.userCIC;
  this.useravatar = user.userAvatar;
  this.userbirthdate = user.userBirthdate;
  this.usergender = user.userGender;
  this.useraddress = user.userAddress;
  this.useremail = user.userEmail;
  this.userphone = user.userPhone;
  this.userbanknumber = user.userBankNumber;
  this.usercreatedat = "";
  this.userstatusid = user.userStatusID;
  this.roleid = user.roleID;
  this.wardid = user.wardID;
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
    var status = [];
    var address;

    await hasRole(res.userid)
      .then(function (resRole) {
        role = resRole;
      })
      .catch(function (errRole) {
        result(errRole, null);
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
      userAddressSub : address,
    };
    return userInfo;
  });

  const resultData = await Promise.all(listInfo);
  return resultData;
}

// Get all user
User.getAll = function getAllUser(result) {
  db.query(
    "SELECT userid, username, userphone, useremail FROM user WHERE userdeletedat IS NULL",
    async function (err, res) {
      if (err) {
        result(err, null);
      } else {
        const userData = await resultUser(res);
        result(null, userData);
      }
    }
  );
};

// Get username
User.checkUserName = function checkUserName(userName, result) {
  const sql = "SELECT * FROM user WHERE userusername = '" + userName + "'";
  db.query(sql, function (err, res) {
    if (err) {
      result(err, null);
    } else {
      result(null, res);
    }
  });
};

// Get user by ID
User.getUserByID = function getUserByID(userID, result) {
  db.query(
    "SELECT * FROM user WHERE userid = ?",
    userID,
    async function (err, res) {
      if (err) {
        result(err, null);
      } else {
        const userData = await resultUser(res);
        result(null, userData);
      }
    }
  );
};

// Search user
User.search = function searchUser(col, val, roleID, statusID, result) {
  var subWhere = '';
  if(roleID !== undefined) {
    subWhere += ' AND roleid = ' + roleID;
  }
  if(statusID !== undefined) {
    subWhere += ' AND userstatusid = ' + statusID;
  }
  const sql = `SELECT * FROM user WHERE REPLACE(${col}, 'Đ', 'D') LIKE '%${val}%' ${subWhere} AND userdeletedat IS NULL`;
  db.query(sql, async function (err, res) {
    if (err) {
      result(err, null);
    } else {
      const userData = await resultUser(res);
      result(null, userData);
    }
  });
};

// Store user
User.store = function storeUser(newUser, result) {
  newUser.usercreatedat = moment().format("YYYY-MM-DD HH:mm:ss");
  db.query("INSERT INTO user set ?", newUser, function (err, res) {
    if (err) {
      result(err, null);
    } else {
      result(null, res.insertId);
    }
  });
};

// Update user
User.update = function updateUser(userID, user, result) {
  const sql =
    "UPDATE user SET username = ?, userbirthdate = ?, usergender = ?, useraddress = ?, usercic = ?, useremail = ?, userphone = ?, userbanknumber = ?, userstatusid = ?, roleid = ?, wardid = ? WHERE userid = ?";
  db.query(
    sql,
    [
      user.username,
      user.userbirthdate,
      user.usergender,
      user.useraddress,
      user.usercic,
      user.useremail,
      user.userphone,
      user.userbanknumber,
      user.userstatusid,
      user.roleid,
      user.wardid,
      userID,
    ],
    function (err, res) {
      if (err) {
        result(err, null);
      } else {
        result(null, res);
      }
    }
  );
};
// Chagne user avatar
User.changeAvatar = function changeAvatar(userID, userAvatar, result) {
  const sql = "UPDATE user SET useravatar = ? WHERE userid = ?";
  db.query(sql, [userAvatar, userID], function (err, res) {
    if (err) {
      result(err, null);
    } else {
      result(null, res);
    }
  });
};
// Change user password
User.changePassword = function changePassword(userID, userPassword, result) {
  const sql = "UPDATE user SET userpassword = ? WHERE userid = ?";
  db.query(sql, [userPassword, userID], function (err, res) {
    if (err) {
      result(err, null);
    } else {
      result(null, res);
    }
  });
};

// Delete user
User.delete = function deleteUser(userID, result) {
  let now = moment().format("YYYY-MM-DD HH:mm:ss");
  db.query(
    "UPDATE user SET userdeletedat = ? WHERE userid = ?",
    [now, userID],
    function (err, res) {
      if (err) {
        result(err, null);
      } else {
        result(null, res);
      }
    }
  );
};

// Restore user
User.restore = function restoreUser(userID, result) {
  db.query(
    "UPDATE user SET userdeletedat = NULL WHERE userid = ?",
    [userID],
    function (err, res) {
      if (err) {
        result(err, null);
      } else {
        result(null, res);
      }
    }
  );
};

module.exports = User;

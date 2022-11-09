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
  this.usercreatedat = '';
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

// Get list userstatus of user
async function hasUserStatus(userID) {
  return new Promise((resolve, reject) => {
    db.query(
      "SELECT userstatus.* FROM user INNER JOIN userstatus ON user.userid = userstatus.userstatusid WHERE user.userid = ?",
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

    var userInfo = {
      ...res,
      roleList: role,
      statusList: status,
    };
    return userInfo;
  });

  const resultData = await Promise.all(listInfo);
  return resultData;
}

// Get all user
User.getAll = function getAllUser(result) {
  db.query("SELECT userid, username, userphone FROM user WHERE userdeletedat IS NULL", async function (err, res) {
    if (err) {
      result(err, null);
    } else {
      const userData = await resultUser(res);
      result(null, userData);
    }
  });
};

// Get user by ID
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
  db.query("SELECT * FROM user WHERE userid = ?", userID, async function (err, res) {
    if (err) {
      result(err, null);
    } else {
        const userData = await resultUser(res);
        result(null, userData);
    }
  });
};

// Search user
User.search = function searchUser(col, val, result) {
  const sql = `SELECT * FROM user WHERE REPLACE(${col}, 'Đ', 'D') LIKE '%${val}%' AND userdeletedat IS NULL`;
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
  db.query(
    "UPDATE user SET username = ?, userusername = ?, userpassword = ?, userbirthdate = ?, usergender = ?, useravatar = ?, useraddress = ?, usercic = ?, useremail = ?, userphone = ?, userbanknumber = ?, userstatusid = ?, roleid = ?, wardid = ? WHERE userid = ?",
    [
      user.username,
      user.userusername,
      user.userpassword,
      user.userbirthdate,
      user.usergender,
      user.useravatar,
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
